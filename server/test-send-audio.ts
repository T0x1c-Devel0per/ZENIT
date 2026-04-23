import * as dotenv from 'dotenv';
import WhatsAppService from './services/whatsappService.js';
import TTSService from './services/ttsService.js';

dotenv.config();

async function testNovaVoice() {
  const testNumber = '573144457149'; // Tu número

  console.log(`⏳ Generando voz con OpenAI (Modelo: TTS-1, Voz: Nova)...`);
  try {
    const textToSpeak = "Hola Juan Pablo. Soy el asistente inteligente de Zenit Solutions. Quería enviarte este mensaje de prueba para que escuches cómo suena mi voz. Estoy listo para ayudar a tus clientes con cotizaciones de limpieza residencial y comercial. ¡Un saludo!";
    
    // Generar el audio usando la llave de OpenAI
    const audioBuffer = await TTSService.generateAudio(textToSpeak);
    console.log(`✅ Audio generado exitosamente (${audioBuffer.length} bytes)`);

    console.log(`⏳ Subiendo el audio generado a los servidores de Meta WhatsApp...`);
    const mediaId = await WhatsAppService.uploadMedia(audioBuffer, 'audio/mpeg');
    console.log(`✅ Audio subido con éxito. Media ID: ${mediaId}`);

    console.log(`⏳ Enviando nota de voz a ${testNumber}...`);
    await WhatsAppService.sendAudio(testNumber, mediaId);
    console.log(`🎉 ¡ÉXITO TOTAL! Revisa tu WhatsApp para escuchar a Nova hablando sobre ZENIT.`);
    
  } catch (error: any) {
    console.error('\n❌ Error durante la prueba:', error.message);
  }
}

testNovaVoice();
