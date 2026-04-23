import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';

dotenv.config();

async function testGemini() {
  const apiKey = 'AIzaSyDuEvFLDEmAjKSps3ggZ9bTv_nWYGjJPHU';
  
  if (!apiKey) {
    console.error('❌ No hay API Key configurada.');
    return;
  }

  console.log('⏳ Probando conexión con Google Gemini...');

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = 'Hola Gemini, responde con un mensaje corto confirmando que estás conectado y listo para trabajar con SteamClean.';

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('\n✅ ¡CONEXIÓN EXITOSA!');
    console.log('🤖 Respuesta de Gemini:', text);
  } catch (error: any) {
    console.error('\n❌ Error en la conexión:', error.message);
  }
}

testGemini();
