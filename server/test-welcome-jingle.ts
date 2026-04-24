import * as dotenv from 'dotenv';
import WhatsAppService from './services/whatsappService.js';

dotenv.config();

async function testWelcomeJingle() {
  const to = '573144457149'; // Tu número de prueba
  const mediaId = '2358611777882637'; // El nuevo ID del jingle con la voz correcta

  console.log(`🧪 Probando envío de Jingle de Bienvenida a ${to}...`);
  console.log(`🆔 Media ID: ${mediaId}`);

  try {
    const result = await WhatsAppService.sendAudio(to, mediaId);
    console.log('\n✅ ¡ÉXITO! El jingle ha sido enviado correctamente.');
    console.log('Verifica tu WhatsApp.');
  } catch (error: any) {
    console.error('\n❌ Error al enviar el jingle:', error.message);
  }
}

testWelcomeJingle();
