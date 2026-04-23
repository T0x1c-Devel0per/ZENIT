import * as dotenv from 'dotenv';
import * as fs from 'fs';
import TTSService from './services/ttsService.js';

dotenv.config();

async function testElevenLabs() {
  console.log('🧪 Iniciando prueba de voz con ElevenLabs...');

  const testText = "Hola, soy el asistente virtual de ZENIT SOLUTIONS. Es un gusto saludarte. Estamos listos para dejar tus espacios impecables con nuestra tecnología de limpieza al vapor.";

  try {
    const audioBuffer = await TTSService.generateAudio(testText);
    
    const fileName = 'elevenlabs-test.mp3';
    fs.writeFileSync(fileName, audioBuffer);
    
    console.log(`\n✅ ¡Prueba exitosa! Se ha generado el archivo: ${fileName}`);
    console.log('Puedes abrir este archivo en tu computadora para escuchar la nueva voz premium.');
  } catch (error) {
    console.error('\n❌ Error durante la prueba de ElevenLabs:', error);
  }
}

testElevenLabs();
