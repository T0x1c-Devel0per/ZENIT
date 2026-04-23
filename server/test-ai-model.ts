import * as dotenv from 'dotenv';
import AIService from './services/aiService.js';
import ExtractionService from './services/extractionService.js';

dotenv.config();

async function testNewModel() {
  console.log('⏳ Probando la nueva arquitectura: OpenAI GPT-4o-mini...\n');

  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ ADVERTENCIA: No tienes la variable OPENAI_API_KEY en tu archivo .env local.');
    console.error('Por favor, agrégala para poder ejecutar la prueba real contra los servidores de OpenAI.');
    return;
  }

  try {
    const testPhone = '123456789';

    // 1. Prueba de Chatbot (AIService)
    console.log('🤖 1. Prueba de Chatbot:');
    const userPrompt = 'Hola, soy un cliente potencial. ¿Qué servicios de limpieza ofreces en Bogotá?';
    console.log(`Mensaje del cliente: "${userPrompt}"`);
    
    const startTimeAI = performance.now();
    const aiResponse = await AIService.generateResponse(testPhone, userPrompt);
    const endTimeAI = performance.now();
    
    console.log(`Tiempo de respuesta AI: ${(endTimeAI - startTimeAI).toFixed(3)}ms\n`);
    console.log('Respuesta de ZENIT Bot:');
    console.log(aiResponse);
    console.log('\n--------------------------------------------------');

    // 2. Prueba de Extractor de Leads (ExtractionService)
    console.log('🔍 2. Prueba de Extractor de Leads:');
    const rawTextToExtract = 'Me llamo Carlos Alberto, mi correo es carlos.alb@hotmail.com, mi teléfono es 3154445566 y me gustaría que me coticen el lavado a vapor de 2 tapetes persas enormes. Mil gracias.';
    console.log(`Texto a analizar: "${rawTextToExtract}"`);

    const startTimeExt = performance.now();
    const extractedData = await ExtractionService.extractInfo(rawTextToExtract);
    const endTimeExt = performance.now();

    console.log(`Tiempo de extracción: ${(endTimeExt - startTimeExt).toFixed(3)}ms\n`);
    console.log('Datos extraídos en JSON:');
    console.log(JSON.stringify(extractedData, null, 2));

    console.log('\n🎉 ¡Las pruebas de OpenAI finalizaron con éxito!');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  }
}

testNewModel();
