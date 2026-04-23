import * as dotenv from 'dotenv';
import * as fs from 'fs';
import WhatsAppService from './services/whatsappService.js';

dotenv.config();

async function sendTestAudio() {
  const to = '573144457149'; // Tu número
  const filePath = 'elevenlabs-test.mp3';

  console.log(`📤 Intentando enviar audio de prueba a ${to}...`);

  if (!fs.existsSync(filePath)) {
    console.error('❌ El archivo de audio no existe. Primero ejecuta la prueba de ElevenLabs.');
    return;
  }

  try {
    const audioBuffer = fs.readFileSync(filePath);
    
    console.log('⏳ Subiendo audio a Meta...');
    const mediaId = await WhatsAppService.uploadMedia(audioBuffer, 'audio/mpeg');
    
    console.log(`✅ Audio subido (ID: ${mediaId}). Enviando mensaje...`);
    await WhatsAppService.sendAudio(to, mediaId);
    
    console.log('\n🚀 ¡Audio enviado con éxito! Revisa tu WhatsApp.');
  } catch (error) {
    console.error('\n❌ Error enviando el audio a WhatsApp:', error);
  }
}

sendTestAudio();
