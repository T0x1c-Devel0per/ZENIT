import * as dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

async function listModels() {
  try {
    const apiKey = process.env.GEMINI_API_KEY || '';
    if (!apiKey) {
      console.error('No API key');
      return;
    }
    
    // El SDK oficial actual no exporta listModels de forma sencilla, pero podemos intentar instanciar el cliente fetch
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + apiKey);
    const data = await response.json() as any;
    console.log('Modelos disponibles:');
    if (data.models) {
      data.models.forEach((m: any) => {
        if (m.name.includes('flash')) {
          console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`);
        }
      });
    } else {
      console.log(data);
    }
  } catch (err: any) {
    console.error('Error:', err.message);
  }
}

listModels();
