import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Servicio de Correo ZENIT
 * Configurado para enviar cotizaciones y notificaciones de leads.
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Envía una notificación de cotización a ZENIT y al Cliente
 */
export const sendContactNotification = async (
  name: string,
  email: string,
  phone: string | undefined,
  service: string,
  message: string
): Promise<boolean> => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('[Email] ⚠️ Credenciales SMTP no configuradas. Saltando envío.');
    console.log('Lead recibido:', { name, email, phone, service, message });
    return true; 
  }

  try {
    const invoiceNumber = `ZEN-${Date.now()}`;
    const invoiceDate = new Date().toLocaleDateString('es-CO');
    
    // Generar precio estimado (simulado para la cotización inicial)
    const estimatedPrice = Math.floor(Math.random() * 300000) + 150000;

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
      }).format(amount);
    };

    const mailOptions = {
      from: `"SENIT SOLUTIONS" <${process.env.SMTP_USER}>`,
      to: [process.env.CONTACT_EMAIL || process.env.SMTP_USER, email], 
      subject: `Cotización de Servicio SENIT SOLUTIONS - ${invoiceNumber}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background: #020617; padding: 30px; text-align: center; color: white;">
            <h1 style="color: #38bdf8; margin: 0; letter-spacing: 2px;">SENIT SOLUTIONS</h1>
            <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 14px;">Limpieza que Inspira Confianza</p>
          </div>
          
          <div style="padding: 30px; background: white;">
            <h2 style="color: #1e293b; margin-top: 0;">¡Hola, ${name}!</h2>
            <p style="color: #475569;">Hemos recibido tu solicitud vía WhatsApp. Aquí tienes una cotización preliminar para tu servicio:</p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #38bdf8;">
              <h3 style="margin-top: 0; color: #1e293b; font-size: 16px;">Resumen del Servicio</h3>
              <p style="margin: 5px 0;"><strong>Servicio:</strong> ${service}</p>
              <p style="margin: 5px 0;"><strong>Nro. Cotización:</strong> ${invoiceNumber}</p>
              <p style="margin: 5px 0;"><strong>Valor Estimado:</strong> <span style="color: #0284c7; font-size: 18px; font-weight: bold;">${formatCurrency(estimatedPrice)}</span></p>
            </div>
            
            <p style="color: #475569; font-size: 14px; font-style: italic;">*Este valor es un estimado inicial. Un asesor humano confirmará el precio final contigo a la brevedad.</p>
            
            <div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center;">
              <p style="margin: 0; font-weight: bold; color: #020617;">SENIT SOLUTIONS Colombia</p>
              <p style="margin: 5px 0; color: #64748b; font-size: 12px;">Bogotá, D.C. | Profesionalismo al Vapor</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Email] ✅ Cotización enviada a ${email}`);
    return true;
  } catch (error) {
    console.error('[Email] ❌ Error enviando correo:', error);
    return false;
  }
};