import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Sends an email notification when a new contact form is submitted
 */
export const sendContactNotification = async (
  name: string,
  email: string,
  phone: string | undefined,
  service: string,
  message: string
): Promise<boolean> => {
  // Check if SMTP credentials are configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP credentials not configured. Skipping email notification.');
    console.log('Contact form received:', { name, email, phone, service, message });
    return true; // Return true to indicate success despite not sending email
  }

  try {
    // Generate a mock invoice for the client
    const invoiceNumber = `INV-${Date.now()}`;
    const invoiceDate = new Date().toLocaleDateString('es-CO');
    const services = [
      { name: service, price: Math.floor(Math.random() * 500000) + 100000, currency: 'COP' } // Random price between 100,000 and 600,000 COP
    ];
    const totalAmount = services.reduce((sum, service) => sum + service.price, 0);

    // Format prices in Colombian Pesos
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    };

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: [process.env.CONTACT_EMAIL || 'admin@example.com', email], // Send to admin and client
      subject: `Factura de Servicio - ${invoiceNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #f8fafc; padding: 20px; text-align: center; border-bottom: 2px solid #0ea5e9;">
            <h1 style="color: #0ea5e9; margin: 0;">SteamClean</h1>
            <p style="margin: 5px 0 0 0; color: #64748b;">Servicios Profesionales de Limpieza al Vapor</p>
          </div>
          
          <div style="padding: 20px;">
            <h2 style="color: #1e293b;">Confirmación de Cotización</h2>
            <p>Hola <strong>${name}</strong>,</p>
            <p>Gracias por contactarnos. Hemos recibido tu solicitud de información sobre nuestro servicio de <strong>${service}</strong>.</p>
            
            <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1e293b;">Detalles de la Cotización</h3>
              <p><strong>Número de Cotización:</strong> ${invoiceNumber}</p>
              <p><strong>Fecha:</strong> ${invoiceDate}</p>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background-color: #e2e8f0;">
                  <th style="padding: 10px; text-align: left;">Servicio</th>
                  <th style="padding: 10px; text-align: right;">Precio</th>
                </tr>
              </thead>
              <tbody>
                ${services.map(service => `
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${service.name}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">${formatCurrency(service.price)}</td>
                  </tr>
                `).join('')}
              </tbody>
              <tfoot>
                <tr>
                  <td style="padding: 10px; font-weight: bold; text-align: right; border-top: 2px solid #0ea5e9;">TOTAL:</td>
                  <td style="padding: 10px; font-weight: bold; text-align: right; border-top: 2px solid #0ea5e9;">${formatCurrency(totalAmount)}</td>
                </tr>
              </tfoot>
            </table>
            
            <div style="background: #fffbeb; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e;"><strong>Nota:</strong> Este es un valor estimado. El precio final puede variar según las condiciones específicas del lugar y los servicios adicionales requeridos.</p>
            </div>
            
            <p>Nuestro equipo se pondrá en contacto contigo pronto para coordinar los detalles del servicio y resolver cualquier duda.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0;"><strong>SteamClean</strong></p>
              <p style="margin: 5px 0; color: #64748b;">Bogotá, Colombia</p>
              <p style="margin: 5px 0; color: #64748b;">contacto@steamclean.com.co</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    // Still return true since the contact was saved to DB even if email failed
    return true;
  }
};