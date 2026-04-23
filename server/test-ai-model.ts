import * as dotenv from 'dotenv';
import AIService from './services/aiService.js';
import ExtractionService from './services/extractionService.js';

dotenv.config();

async function testNewModel() {
  console.log('⏳ Probando el nuevo motor: gemini-2.5-flash-lite...\n');

  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ ADVERTENCIA: No tienes la variable GEMINI_API_KEY en tu archivo .env local.');
    console.error('Por favor, agrégala para poder ejecutar la prueba real contra los servidores de Google.');
    return;
  }

  try {
    // 1. Prueba de Chatbot (AIService)
    console.log('🤖 1. Prueba de Chatbot:');
    const prompt = 'Hola, soy un cliente potencial. ¿Qué servicios de limpieza ofreces en Bogotá?';
    console.log(`Mensaje del cliente: "${prompt}"`);
    
    console.time('Tiempo de respuesta AI');
    const aiResponse = await AIService.generateResponse(prompt);
    console.timeEnd('Tiempo de respuesta AI');
    
    console.log(`\nRespuesta de ZENIT Bot:\n${aiResponse}\n`);

    // 2. Prueba de Extracción de Datos (ExtractionService)
    console.log('--------------------------------------------------');
    console.log('🔍 2. Prueba de Extractor de Leads:');
    const leadText = 'Me llamo Carlos Alberto, mi correo es carlos.alb@hotmail.com, mi teléfono es 3154445566 y me gustaría que me coticen el lavado a vapor de 2 tapetes persas enormes. Mil gracias.';
    console.log(`Texto a analizar: "${leadText}"`);

    console.time('Tiempo de extracción');
    const extractedData = await ExtractionService.extractInfo(leadText);
    console.timeEnd('Tiempo de extracción');

    console.log('\nDatos extraídos en JSON:');
    console.log(JSON.stringify(extractedData, null, 2));

    console.log('\n🎉 ¡Las pruebas del nuevo modelo Flash-8B finalizaron con éxito sin errores de límite!');

  } catch (error: any) {
    console.error('\n❌ Error durante las pruebas:', error.message);
  }
}

testNewModel();
