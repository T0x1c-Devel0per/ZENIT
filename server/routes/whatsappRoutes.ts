import { Router } from 'express';
import WhatsAppController from '../controllers/whatsappController.js';

const router = Router();

/**
 * WhatsApp API Routes
 */

// Webhook validation (GET) and event receiving (POST)
// Note: Both use the same path as required by Meta
router.get('/webhook', WhatsAppController.verifyWebhook);
router.post('/webhook', WhatsAppController.handleWebhook);

// Manual message sending
router.post('/send', WhatsAppController.manualSend);

export default router;
