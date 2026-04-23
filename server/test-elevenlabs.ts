import * as dotenv from 'dotenv';
import * as fs from 'fs';
import TTSService from './services/ttsService.js';

dotenv.config();

async function testElevenLabs() {
  console.log('🧪 Iniciando prueba de voz con ElevenLabs...');

  const testText = "¡ZENIT SOLUTIONS! ¡ZENIT SOLUTIONS! ... ¡Qué más pues! Soy ZeniBot, la inteligencia de ZENIT SOLUTIONS. Tu asesor experto en limpieza profunda al vapor. Estoy listo para dejar tus espacios impecables... ¿En qué te ayudo hoy?";

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
