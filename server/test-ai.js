import { GoogleGenerativeAI } from '@google/generative-ai';

async function testGemini() {
  const apiKey = 'AIzaSyDuEvFLDEmAjKSps3ggZ9bTv_nWYGjJPHU';
  
  console.log('⏳ Probando conexión con Google Gemini 2.0 Flash...');

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt = 'Hola Gemini 2.0, confirma que estás listo para ayudar a los clientes de SteamClean con un mensaje muy corto.';

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('\n✅ ¡CONEXIÓN EXITOSA!');
    console.log('🤖 Respuesta de Gemini 2.0:', text);
  } catch (error) {
    console.error('\n❌ Error en la conexión:', error.message);
  }
}

testGemini();
