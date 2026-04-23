import * as dotenv from 'dotenv';
import { sendContactNotification } from './utils/email.js';

dotenv.config();

async function testEmail() {
  console.log('🧪 Iniciando prueba de envío de correo con Brevo...');
  
  const testData = {
    name: 'Juan Pablo (Prueba Brevo)',
    email: 'juanchistos0102@gmail.com',
    phone: '+573144457149',
    service: 'Limpieza Profunda Residencial (Prueba)',
    message: 'Este es un mensaje de prueba para verificar que la integración con Brevo SMTP está funcionando correctamente desde el servidor de ZENIT.'
  };

  try {
    const result = await sendContactNotification(
      testData.name,
      testData.email,
      testData.phone,
      testData.service,
      testData.message
    );

    if (result) {
      console.log('\n✅ ¡Prueba exitosa! El correo debería llegar en unos segundos a juanchistos0102@gmail.com.');
      console.log('Revisa también tu bandeja de SPAM por si acaso.');
    } else {
      console.error('\n❌ La prueba falló. El servicio de correo devolvió false.');
    }
  } catch (error) {
    console.error('\n❌ Error crítico durante la prueba de correo:', error);
  }
}

testEmail();
