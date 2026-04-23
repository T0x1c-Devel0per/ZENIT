import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

async function testMusic() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error('❌ ELEVENLABS_API_KEY no está configurada.');
    return;
  }

  console.log('🧪 Generando música con ElevenLabs Music (v1/music)...');

  const prompt = "A mid-tempo classic Colombian Salsa song. Smooth piano, bongos, and subtle brass. Lyrics: 'De Bogotá para el mundo, con vapor y con esmero, ZENIT limpia tu hogar entero. ¡ZENIT SOLUTIONS!'. Melodic male salsa singer, professional and warm. Not too aggressive, but with good rhythm.";

  try {
    const response = await fetch('https://api.elevenlabs.io/v1/music', {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        music_length_ms: 20000, // 20 segundos
        model_id: 'music_v1'
      })
    });

    if (!response.ok) {
      const errData = await response.json() as any;
      throw new Error(errData.detail?.message || 'Error generating music');
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const fileName = 'zenit-song.mp3';
    fs.writeFileSync(fileName, buffer);
    
    console.log(`\n✅ ¡Música generada con éxito! Archivo: ${fileName}`);
    console.log('Puedes escucharlo y enviarlo a WhatsApp.');
  } catch (error: any) {
    console.error('\n❌ Error durante la generación de música:', error.message);
  }
}

testMusic();
