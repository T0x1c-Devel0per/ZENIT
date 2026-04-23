import nodemailer from 'nodemailer';

/**
 * Email Service
 * Handles sending notifications for new leads.
 */
class EmailService {
  private static transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  /**
   * Send a notification email for a new contact/lead
   */
  static async sendContactNotification(contactData: any) {
    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('[EmailService] ⚠️ EMAIL_USER or EMAIL_PASS not configured. Skipping email.');
        return;
      }

      const { name, email, phone, service, message } = contactData;

      const mailOptions = {
        from: `"ZENIT Bot" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: `🚀 Nuevo Lead de WhatsApp: ${name}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #0ea5e9;">¡Nuevo Lead Recibido!</h2>
            <p>Se ha capturado un nuevo contacto a través del bot de WhatsApp:</p>
            <hr />
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
            <p><strong>Servicio:</strong> ${service}</p>
            <p><strong>Mensaje/Contexto:</strong> ${message}</p>
            <hr />
            <p style="font-size: 12px; color: #777;">Este es un mensaje automático enviado por el sistema ZENIT.</p>
          </div>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('[EmailService] ✅ Email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('[EmailService] ❌ Error sending email:', error);
      throw error;
    }
  }
}

export default EmailService;
