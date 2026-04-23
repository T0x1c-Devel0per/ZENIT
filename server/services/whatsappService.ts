/**
 * WhatsApp Cloud API Service
 * Handles interaction with Meta's Graph API for WhatsApp messages.
 */
class WhatsAppService {
  private static API_VERSION = 'v18.0';
  private static BASE_URL = `https://graph.facebook.com/${this.API_VERSION}`;

  /**
   * Send a text message to a WhatsApp number
   */
  static async sendMessage(to: string, message: string) {
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const token = process.env.WHATSAPP_TOKEN;

    if (!phoneId || !token) {
      throw new Error('WhatsApp configuration missing: Phone ID or Token');
    }

    const url = `${this.BASE_URL}/${phoneId}/messages`;

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to,
      type: 'text',
      text: {
        preview_url: false,
        body: message,
      },
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as any;

      if (!response.ok) {
        throw new Error(data.error?.message || 'Error sending WhatsApp message');
      }

      console.log(`[WhatsAppService] ✅ Message sent to ${to}: ${data.messages[0].id}`);
      return data;
    } catch (error: any) {
      console.error(`[WhatsAppService] ❌ Error sending message:`, error.message);
      throw error;
    }
  }

  /**
   * Send a template message (required for business-initiated conversations)
   */
  static async sendTemplate(to: string, templateName: string, languageCode = 'es', components: any[] = []) {
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const token = process.env.WHATSAPP_TOKEN;

    const url = `${this.BASE_URL}/${phoneId}/messages`;

    const payload = {
      messaging_product: 'whatsapp',
      to: to,
      type: 'template',
      template: {
        name: templateName,
        language: {
          code: languageCode,
        },
        components: components,
      },
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as any;

      if (!response.ok) {
        throw new Error(data.error?.message || 'Error sending WhatsApp template');
      }

      return data;
    } catch (error: any) {
      console.error(`[WhatsAppService] ❌ Error sending template:`, error.message);
      throw error;
    }
  }

  /**
   * Mark a received message as read
   */
  static async markAsRead(messageId: string) {
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const token = process.env.WHATSAPP_TOKEN;

    const url = `${this.BASE_URL}/${phoneId}/messages`;

    const payload = {
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId,
    };

    try {
      await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      return true;
    } catch (error) {
      console.error(`[WhatsAppService] ❌ Error marking as read:`, error);
      return false;
    }
  }
}

export default WhatsAppService;
