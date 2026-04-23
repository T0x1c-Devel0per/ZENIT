import type { Request, Response } from 'express';
import WhatsAppService from '../services/whatsappService.js';
import AIService from '../services/aiService.js';

/**
 * Controller for WhatsApp Webhooks and Sending
 */
class WhatsAppController {
  
  /**
   * Webhook Verification (GET)
   * This is called by Meta when you configure the webhook in the developer portal.
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
   * This receives messages, status updates, etc.
   */
  static async handleWebhook(req: Request, res: Response) {
    try {
      const body = req.body;

      // Check if it's a WhatsApp message event
      if (body.object === 'whatsapp_business_account') {
        const entry = body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;

        // 1. Handle incoming messages
        if (value?.messages?.[0]) {
          const message = value.messages[0];
          const from = message.from; // Sender's phone number
          const messageId = message.id;
          const type = message.type;

          console.log(`[WhatsApp] 📩 Message received from ${from} (Type: ${type})`);

          if (type === 'text') {
            const text = message.text.body;
            console.log(`[WhatsApp] Content: "${text}"`);

            // 🤖 AI Logic: Generate response using Gemini
            const aiResponse = await AIService.generateResponse(text);
            
            // 📩 Send response back via WhatsApp
            await WhatsAppService.sendMessage(from, aiResponse);
            
            // Mark as read
            await WhatsAppService.markAsRead(messageId);
          }
        }

        // 2. Handle message status updates (sent, delivered, read)
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
      return res.status(500).send('INTERNAL_SERVER_ERROR');
    }
  }

  /**
   * Manual send endpoint (POST)
   * For testing or manual triggers from the UI
   */
  static async manualSend(req: Request, res: Response) {
    try {
      const { to, message } = req.body;

      if (!to || !message) {
        return res.status(400).json({ success: false, error: 'Phone (to) and message are required' });
      }

      const result = await WhatsAppService.sendMessage(to, message);

      return res.json({
        success: true,
        message: 'WhatsApp message sent successfully',
        data: result
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

export default WhatsAppController;
