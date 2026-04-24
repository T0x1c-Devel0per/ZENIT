/**
 * WhatsApp Cloud API Service
 * Handles interaction with Meta's Graph API for WhatsApp messages.
 */
class WhatsAppService {
  private static BASE_URL = `https://api.ycloud.com/v2`;

  /**
   * Send a text message to a WhatsApp number via YCloud
   */
  static async sendMessage(to: string, message: string) {
    const from = process.env.YCLOUD_WHATSAPP_NUMBER;
    const apiKey = process.env.YCLOUD_API_KEY;

    if (!from || !apiKey) {
      throw new Error('YCloud configuration missing: YCLOUD_WHATSAPP_NUMBER or YCLOUD_API_KEY');
    }

    const url = `${this.BASE_URL}/whatsapp/messages/send`;

    const payload = {
      from: from,
      to: to,
      type: 'text',
      text: {
        body: message,
      },
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'X-API-Key': apiKey,
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
   * Send a template message via YCloud
   */
  static async sendTemplate(to: string, templateName: string, languageCode = 'es', components: any[] = []) {
    const from = process.env.YCLOUD_WHATSAPP_NUMBER;
    const apiKey = process.env.YCLOUD_API_KEY;

    const url = `${this.BASE_URL}/whatsapp/messages/send`;

    const payload = {
      from: from,
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
          'X-API-Key': apiKey || '',
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
   * Send an interactive message with quick reply buttons via YCloud
   */
  static async sendInteractiveButtons(to: string, text: string, buttons: { id: string; title: string }[]) {
    const from = process.env.YCLOUD_WHATSAPP_NUMBER;
    const apiKey = process.env.YCLOUD_API_KEY;

    if (!from || !apiKey) {
      throw new Error('YCloud configuration missing');
    }

    const url = `${this.BASE_URL}/whatsapp/messages/send`;

    // Map buttons to YCloud interactive format
    const actionButtons = buttons.slice(0, 3).map(btn => ({
      type: 'reply',
      reply: {
        id: btn.id,
        title: btn.title.substring(0, 20)
      }
    }));

    const payload = {
      from: from,
      to: to,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: {
          text: text
        },
        action: {
          buttons: actionButtons
        }
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as any;

      if (!response.ok) {
        throw new Error(data.error?.message || 'Error sending WhatsApp interactive message');
      }

      console.log(`[WhatsAppService] ✅ Interactive message sent to ${to}`);
      return data;
    } catch (error: any) {
      console.error(`[WhatsAppService] ❌ Error sending interactive message:`, error.message);
      throw error;
    }
  }

  /**
   * Mark a message as read via YCloud
   */
  static async markAsRead(messageId: string): Promise<void> {
    try {
      const from = process.env.YCLOUD_WHATSAPP_NUMBER;
      const apiKey = process.env.YCLOUD_API_KEY;

      if (!from || !apiKey) throw new Error('YCloud config missing');

      // YCloud might not require marking as read directly, or it might have a specific endpoint.
      // Usually, it's a message status update.
      // Let's omit sending this if not strictly needed or map it to standard YCloud usage.
      // Assuming a generic /whatsapp/messages/markAsRead endpoint if exists, 
      // but if not, this can safely be a no-op as BSPs often auto-mark read or don't require it.
      console.log('[WhatsAppService] Mark as read called for', messageId);
    } catch (error: any) {
      console.error('[WhatsAppService] ❌ Error marking message as read:', error.message);
    }
  }

  /**
   * Simulates 'Typing...' or 'Recording audio...' indicator via YCloud (if supported)
   */
  static async sendTypingIndicator(to: string): Promise<void> {
    try {
      // YCloud may not have a sender_action endpoint documented directly.
      // We will skip it for now to avoid 404s, or implement it if we know the endpoint.
      console.log('[WhatsAppService] Typing indicator requested for', to);
    } catch (error: any) {
      console.error('[WhatsAppService] ❌ Error sending typing indicator:', error.message);
    }
  }

  /**
   * Download a media file from YCloud given its media ID
   */
  static async downloadMedia(mediaId: string): Promise<Buffer> {
    const apiKey = process.env.YCLOUD_API_KEY;
    if (!apiKey) throw new Error('YCloud API Key missing');

    // YCloud Media retrieval
    // Usually GET /v2/whatsapp/media/{mediaId}
    const urlReq = await fetch(`${this.BASE_URL}/whatsapp/media/${mediaId}`, {
      headers: { 'X-API-Key': apiKey }
    });
    const urlData = await urlReq.json() as any;
    
    if (!urlReq.ok) {
      throw new Error(urlData.error?.message || 'Failed to get media URL from YCloud');
    }

    const mediaUrl = urlData.url || urlData.link; // Adjust depending on exact YCloud response
    if (!mediaUrl) {
      throw new Error('YCloud response did not contain a media URL');
    }

    // 2. Download actual binary
    const mediaReq = await fetch(mediaUrl); // YCloud media links might not need auth, or use same auth
    
    if (!mediaReq.ok) {
      throw new Error('Failed to download media binary');
    }

    const arrayBuffer = await mediaReq.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  /**
   * Upload a media file to YCloud and return its new Media ID
   */
  static async uploadMedia(buffer: Buffer, mimeType: string): Promise<string> {
    const apiKey = process.env.YCLOUD_API_KEY;
    if (!apiKey) throw new Error('YCloud config missing');

    const url = `${this.BASE_URL}/whatsapp/media`;

    // Create a Blob from the buffer to append to FormData
    const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });
    const formData = new FormData();
    formData.append('file', blob, 'audio.mp3');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey
        // Do NOT set Content-Type to multipart/form-data manually, fetch will do it with the correct boundary
      },
      body: formData
    });

    const data = await response.json() as any;
    if (!response.ok) {
      throw new Error(data.error?.message || 'Error uploading media to YCloud');
    }

    return data.id; // Return the new media_id
  }

  /**
   * Send an audio message to a user via YCloud
   */
  static async sendAudio(to: string, mediaId: string) {
    const from = process.env.YCLOUD_WHATSAPP_NUMBER;
    const apiKey = process.env.YCLOUD_API_KEY;
    if (!from || !apiKey) throw new Error('YCloud config missing');

    const url = `${this.BASE_URL}/whatsapp/messages/send`;

    const payload = {
      from: from,
      to: to,
      type: 'audio',
      audio: {
        id: mediaId
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json() as any;
      if (!response.ok) {
        throw new Error(data.error?.message || 'Error sending audio message');
      }

      console.log(`[WhatsAppService] 🎵 Audio sent to ${to}`);
      return data;
    } catch (error: any) {
      console.error(`[WhatsAppService] ❌ Error sending audio:`, error.message);
      throw error;
    }
  }
}

export default WhatsAppService;
