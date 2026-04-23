import * as dotenv from 'dotenv';

dotenv.config();

async function testTTS() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ Error: La variable OPENAI_API_KEY no se encontró en el archivo .env');
    return;
  }

  console.log('⏳ Conectando con OpenAI TTS usando tu llave...');

  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: 'Hola, esta es una prueba de voz de Senit Solutions. Si me escuchas, el sistema está funcionando.',
        voice: 'nova',
        response_format: 'mp3'
      })
    });

    if (!response.ok) {
      const errData = await response.json() as any;
      console.error('\n❌ La prueba falló. Respuesta de OpenAI:');
      console.error(errData.error?.message || errData);
    } else {
      console.log('\n✅ ¡ÉXITO! La llave de OpenAI es válida y el audio se generó correctamente.');
      console.log('Tamaño del audio generado:', response.headers.get('content-length'), 'bytes');
      console.log('Ahora puedes probar enviarle una nota de voz a tu WhatsApp.');
    }
  } catch (error: any) {
    console.error('\n❌ Error de red:', error.message);
  }
}

testTTS();
