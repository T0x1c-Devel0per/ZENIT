import type { Request, Response } from 'express';
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
   * Webhook Verification (GET)
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
      console.error('[WhatsAppController] ❌ Webhook verification failed');
      return res.status(403).send('Forbidden');
    }
  }

  /**
   * Handle Webhook Events (POST)
   */
  static async handleWebhook(req: Request, res: Response) {
    try {
      const body = req.body;

      if (body.object === 'whatsapp_business_account') {
        const entry = body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;

        if (value?.messages?.[0]) {
          const message = value.messages[0];
          const from = message.from; 
          const messageId = message.id;
          const type = message.type;

          console.log(`[WhatsApp] 📩 Message received from ${from} (Type: ${type})`);

          if (type === 'text' || type === 'interactive' || type === 'audio') {
            let text = '';
            let mediaId = '';
            
            if (type === 'text') {
              text = message.text.body;
              console.log(`[WhatsApp] Content: "${text}"`);
            } else if (type === 'interactive') {
              if (message.interactive.type === 'button_reply') {
                text = message.interactive.button_reply.title;
                console.log(`[WhatsApp] 🔘 User clicked button: ${message.interactive.button_reply.id}`);
              } else {
                res.status(200).send('EVENT_RECEIVED');
                return;
              }
            } else if (type === 'audio') {
              mediaId = message.audio.id;
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
                const isNewUser = !AIService.getChatHistory(from) || AIService.getChatHistory(from).length === 0;
                if (isNewUser && process.env.WELCOME_AUDIO_MEDIA_ID) {
                  console.log('[WhatsApp] 🎵 Sending welcome jingle (pre-recorded)...');
                  await WhatsAppService.sendAudio(from, process.env.WELCOME_AUDIO_MEDIA_ID);
                }

                // Si es un audio, descargamos, pasamos a Whisper, y la respuesta la mandamos a TTS
                if (type === 'audio' && mediaId) {
                  console.log('[WhatsApp] ⏳ Downloading audio from Meta...');
                  const audioBuffer = await WhatsAppService.downloadMedia(mediaId);
                  
                  console.log('[WhatsApp] 🧠 Processing audio with Whisper & GPT-4o-mini...');
                  const mimeType = message.audio.mime_type || 'audio/ogg';
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

        if (value?.statuses?.[0]) {
          const status = value.statuses[0];
          console.log(`[WhatsApp] 📊 Status update for ${status.id}: ${status.status}`);
        }

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
