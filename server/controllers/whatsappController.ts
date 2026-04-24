import type { Request, Response } from 'express';
import crypto from 'crypto';
import WhatsAppService from '../services/whatsappService.js';
import AIService from '../services/aiService.js';
import TTSService from '../services/ttsService.js';
import ExtractionService from '../services/extractionService.js';
import Contact from '../models/Contact.js';
import { sendContactNotification } from '../utils/email.js';

/**
 * Controller for WhatsApp Webhooks and Sending
 */
class WhatsAppController {
  
  /**
   * Webhook Verification (GET) - Kept for legacy Meta compatibility or if YCloud sends challenge
   * Note: YCloud usually verifies via POST and YCloud-Signature header.
   */
  static verifyWebhook(req: Request, res: Response) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'zenit_whatsapp_token_2026';

    if (mode === 'subscribe' && token === verifyToken) {
      console.log('[WhatsAppController] ✅ Webhook verified successfully');
      return res.status(200).send(challenge);
    } else {
      console.log('[WhatsAppController] ℹ️ Webhook GET received, might not be required for YCloud');
      return res.status(403).send('Forbidden');
    }
  }

  /**
   * Handle Webhook Events (POST)
   */
  static async handleWebhook(req: Request, res: Response) {
    try {
      const body = req.body;
      console.log(`[WhatsAppController] 📥 Webhook received! Body:`, JSON.stringify(body, null, 2));

      const signatureHeader = req.headers['ycloud-signature'] as string;
      const webhookSecret = process.env.YCLOUD_WEBHOOK_SECRET;

      // Optional: Verify YCloud Signature if secret is configured
      if (webhookSecret && signatureHeader) {
        // signatureHeader format: t=timestamp,s=signature
        const parts = signatureHeader.split(',');
        let t = '';
        let s = '';
        for (const part of parts) {
          if (part.startsWith('t=')) t = part.substring(2);
          if (part.startsWith('s=')) s = part.substring(2);
        }

        if (t && s) {
          const rawBody = (req as any).rawBody || JSON.stringify(body);
          const payloadToSign = `${t}.${rawBody}`;
          const expectedSignature = crypto.createHmac('sha256', webhookSecret).update(payloadToSign).digest('hex');

          if (expectedSignature !== s) {
            console.error('[WhatsAppController] ❌ Webhook signature verification failed');
            return res.status(401).send('Unauthorized');
          }
        }
      }

      // Check for YCloud webhook format
      if (body.type && body.type.startsWith('whatsapp.inbound_message')) {
        const messageData = body.whatsapp_inbound_message || body.whatsappInboundMessage || body.message || body.data || body;

        if (messageData && messageData.from) {
          const from = messageData.from;
          const messageId = messageData.id || 'unknown';
          const type = messageData.type;

          console.log(`[WhatsApp] 📩 Message received from ${from} (Type: ${type})`);

          if (type === 'text' || type === 'interactive' || type === 'audio') {
            let text = '';
            let mediaId = '';
            
            if (type === 'text') {
              text = messageData.text?.body || '';
              console.log(`[WhatsApp] Content: "${text}"`);
            } else if (type === 'interactive') {
              if (messageData.interactive?.type === 'button_reply') {
                text = messageData.interactive.button_reply.title;
                console.log(`[WhatsApp] 🔘 User clicked button: ${messageData.interactive.button_reply.id}`);
              } else {
                res.status(200).send('EVENT_RECEIVED');
                return;
              }
            } else if (type === 'audio') {
              mediaId = messageData.audio?.id;
              console.log(`[WhatsApp] 🎤 Audio received. Media ID: ${mediaId}`);
            }

            // ⚡ Respond 200 OK immediately
            res.status(200).send('EVENT_RECEIVED');

            // 🤖 Background Logic
            (async () => {
              try {
                let aiResponse = '';

                // Activar el indicador de 'Escribiendo...' o 'Grabando audio...' inmediatamente
                await WhatsAppService.sendTypingIndicator(from);

                // 🎵 Bienvenida con Jingle pre-grabado (Solo la primera vez para ahorrar tokens)
                const history = AIService.getChatHistory(from);
                const isNewUser = !history || history.length === 0;
                
                if (isNewUser && process.env.WELCOME_AUDIO_MEDIA_ID) {
                  console.log(`[WhatsApp] 🎵 Sending welcome jingle to new user ${from}...`);
                  try {
                    await WhatsAppService.sendAudio(from, process.env.WELCOME_AUDIO_MEDIA_ID);
                  } catch (audioErr: any) {
                    console.error('[WhatsApp] ⚠️ Welcome audio failed (probably invalid media ID):', audioErr.message);
                  }
                  
                  // Inicializar historial inmediatamente para que el siguiente mensaje no dispare la canción
                  // (Incluso si la respuesta de la IA tarda un poco)
                  AIService.initHistory(from); 
                }

                // Si es un audio, descargamos, pasamos a Whisper, y la respuesta la mandamos a TTS
                if (type === 'audio' && mediaId) {
                  console.log('[WhatsApp] ⏳ Downloading audio from YCloud...');
                  const audioBuffer = await WhatsAppService.downloadMedia(mediaId);
                  
                  console.log('[WhatsApp] 🧠 Processing audio with Whisper & GPT-4o-mini...');
                  const mimeType = messageData.audio?.mime_type || 'audio/ogg';
                  const audioResult = await AIService.generateResponseFromAudio(from, audioBuffer, mimeType);
                  aiResponse = audioResult.response;
                  text = audioResult.transcription; // Guardar transcripción para extraer datos
                  
                  console.log('[WhatsApp] 🎙️ Generating Voice Note con OpenAI TTS...');
                  try {
                    const ttsBuffer = await TTSService.generateAudio(aiResponse);
                    const newMediaId = await WhatsAppService.uploadMedia(ttsBuffer, 'audio/mpeg');
                    await WhatsAppService.sendAudio(from, newMediaId);
                  } catch (ttsErr: any) {
                    console.error('[WhatsApp] ❌ Failed to generate/send TTS audio, falling back to text:', ttsErr.message);
                    await WhatsAppService.sendMessage(from, aiResponse);
                  }
                } else {
                  // Flujo normal de texto
                  aiResponse = await AIService.generateResponse(from, text);
                  await WhatsAppService.sendMessage(from, aiResponse);
                }
                
                await WhatsAppService.markAsRead(messageId);

                // 🔍 2. EXTRACTION: Detect lead data
                if (text) {
                  const extracted = await ExtractionService.extractInfo(text);
                  
                  // Validación más flexible: Si tenemos nombre y al menos un dato de contacto (email o el mismo número de origen)
                  if (extracted && extracted.name && (extracted.phone || extracted.email || from)) {
                      console.log('[WhatsApp] 💎 Lead detected from chat:', extracted.name);
                      
                      try {
                          // Limpiar teléfono
                          let cleanPhone = extracted.phone || from;
                          cleanPhone = cleanPhone.replace(/[^\d+]/g, ''); 
                          if (!cleanPhone.startsWith('+')) cleanPhone = `+${cleanPhone}`;

                          const newContact = new Contact({
                              name: extracted.name,
                              email: extracted.email || 'no-email@zenit.com',
                              phone: cleanPhone,
                              service: extracted.service || 'Interesado en servicios de limpieza',
                              message: extracted.message || text
                          });
                          
                          await newContact.save();
                          console.log('[WhatsApp] 💾 Contact saved to MongoDB');

                          await sendContactNotification(
                              extracted.name,
                              extracted.email || 'no-email@zenit.com',
                              cleanPhone,
                              extracted.service || 'Interesado en servicios de limpieza',
                              extracted.message || text
                          );
                      } catch (saveError: any) {
                          console.error('[WhatsApp] ❌ Error saving/emailing lead:', saveError.message);
                      }
                  }
                }
              } catch (aiError: any) {
                console.error('[WhatsAppController] ❌ Background AI error:', aiError.message);
              }
            })();

            return;
          } else if (type === 'unsupported' || type === 'system' || type === 'unknown') {
            console.log(`[WhatsApp] 📞 Unsupported message or call received from ${from}`);
            res.status(200).send('EVENT_RECEIVED');
            
            // Responder indicando que no se aceptan llamadas
            (async () => {
              try {
                const fallbackMessage = "¡Hola! 👋 Soy el asistente virtual de ZENIT. Mi línea no está habilitada para recibir llamadas de voz o video. Por favor, escríbeme tu consulta por texto o envíame una nota de voz y te atenderé de inmediato.";
                await WhatsAppService.sendMessage(from, fallbackMessage);
              } catch (err: any) {
                console.error('[WhatsAppController] ❌ Error sending call fallback:', err.message);
              }
            })();
            return;
          }
        }
        return res.status(200).send('EVENT_RECEIVED');
      } else if (body.object === 'whatsapp_business_account') {
        // Fallback for Meta legacy webhook structure just in case
        console.log(`[WhatsApp] ⚠️ Received Meta format webhook`);
        return res.status(200).send('EVENT_RECEIVED');
      } else {
        return res.status(404).send('NOT_WHATSAPP_EVENT');
      }
    } catch (error: any) {
      console.error('[WhatsAppController] ❌ Error handling webhook:', error.message);
      if (!res.headersSent) {
        return res.status(200).send('ERROR_BUT_RECEIVED');
      }
    }
  }

  /**
   * Manual send endpoint
   */
  static async manualSend(req: Request, res: Response) {
    try {
      const { to, message } = req.body;
      if (!to || !message) {
        return res.status(400).json({ success: false, error: 'Phone (to) and message are required' });
      }
      const result = await WhatsAppService.sendMessage(to, message);
      return res.json({ success: true, message: 'WhatsApp message sent successfully', data: result });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default WhatsAppController;
