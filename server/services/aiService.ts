import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * AI Service using Google Gemini
 * Handles generating responses for customer inquiries.
 */
class AIService {
  private static genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  private static model = AIService.genAI.getGenerativeModel({ 
    model: 'gemini-flash-latest',
    systemInstruction: `
      Tu nombre es "SENIT Bot", el asesor inteligente de SENIT SOLUTIONS, una empresa líder en limpieza al vapor profesional en Bogotá, Colombia.
      
      Tus objetivos son:
      1. Responder preguntas sobre nuestros servicios premium (Limpieza residencial profunda, desinfección comercial, mantenimiento de espacios de lujo).
      2. Ser elegante, profesional, eficiente y servicial.
      3. Si el cliente quiere una cotización, pídele su nombre, email, teléfono y el servicio que le interesa.
      4. Menciona que en SENIT SOLUTIONS usamos tecnología de vanguardia y procesos ecológicos para garantizar espacios impecables y saludables.
      
      Información de contacto oficial:
      - Empresa: SENIT SOLUTIONS
      - Ubicación: Bogotá, Colombia.
      
      Responde de forma concisa y profesional. Usa emojis elegantes. Mantén el tono de un asesor de alto nivel.
    `,
  });

  /**
   * Generate an AI response for a given prompt
   */
  static async generateResponse(prompt: string): Promise<string> {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return 'Lo siento, mi servicio de inteligencia no está configurado. Por favor contacta a un asesor humano.';
      }

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error('[AIService] ❌ Error generating content:', error.message);
      return 'Lo siento, tuve un pequeño problema procesando tu mensaje. ¿Podrías repetirlo?';
    }
  }
}

export default AIService;
