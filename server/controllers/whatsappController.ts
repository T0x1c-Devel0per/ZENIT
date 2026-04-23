import type { Request, Response } from 'express';
import WhatsAppService from '../services/whatsappService.js';
import AIService from '../services/aiService.js';
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

          if (type === 'text' || type === 'interactive') {
            let text = '';
            
            if (type === 'text') {
              text = message.text.body;
            } else if (type === 'interactive') {
              if (message.interactive.type === 'button_reply') {
                text = message.interactive.button_reply.title;
                console.log(`[WhatsApp] 🔘 User clicked button: ${message.interactive.button_reply.id}`);
              } else {
                res.status(200).send('EVENT_RECEIVED');
                return;
              }
            }

            console.log(`[WhatsApp] Content: "${text}"`);

            // ⚡ Respond 200 OK immediately
            res.status(200).send('EVENT_RECEIVED');

            // 🤖 Background Logic
            (async () => {
              try {
                // 1. Generate AI Response
                const aiResponse = await AIService.generateResponse(text);
                
                // Enviar la respuesta de la IA junto con los botones interactivos
                await WhatsAppService.sendInteractiveButtons(from, aiResponse, [
                  { id: 'btn_cotizar', title: 'Cotizar Servicio' },
                  { id: 'btn_servicios', title: 'Ver Servicios' },
                  { id: 'btn_humano', title: 'Hablar con Asesor' }
                ]);
                await WhatsAppService.markAsRead(messageId);

                // 🔍 2. EXTRACTION: Detect lead data
                const extracted = await ExtractionService.extractInfo(text);
                
                if (extracted && extracted.name && extracted.email && extracted.service) {
                    console.log('[WhatsApp] 💎 Lead detected from chat:', extracted.name);
                    
                    try {
                        // Limpiar teléfono para cumplir con el regex del modelo y evitar saltos de línea
                        let cleanPhone = extracted.phone || from;
                        cleanPhone = cleanPhone.replace(/[^\d+]/g, ''); // Deja solo números y signos +
                        if (!cleanPhone.startsWith('+')) cleanPhone = `+${cleanPhone}`;

                        // Guardar en MongoDB
                        const newContact = new Contact({
                            name: extracted.name,
                            email: extracted.email,
                            phone: cleanPhone,
                            service: extracted.service,
                            message: extracted.message || text
                        });
                        
                        await newContact.save();
                        console.log('[WhatsApp] 💾 Contact saved to MongoDB');

                        // Enviar Email de Cotización
                        await sendContactNotification(
                            extracted.name,
                            extracted.email,
                            cleanPhone,
                            extracted.service,
                            extracted.message || text
                        );
                    } catch (saveError: any) {
                        console.error('[WhatsApp] ❌ Error saving/emailing lead:', saveError.message);
                    }
                }
              } catch (aiError: any) {
                console.error('[WhatsAppController] ❌ Background AI error:', aiError.message);
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
