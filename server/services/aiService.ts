import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * AI Service using Google Gemini
 * Handles generating responses for customer inquiries.
 */
class AIService {
  private static genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  private static model = AIService.genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash',
    systemInstruction: `
      Eres el asistente virtual experto de SteamClean, una empresa líder en limpieza al vapor profesional en Bogotá, Colombia.
      
      Tus objetivos son:
      1. Responder preguntas sobre nuestros servicios (Limpieza residencial, comercial, tapicerías, colchones, etc.).
      2. Ser amable, profesional y servicial.
      3. Si el cliente quiere una cotización, pídele su nombre, email, teléfono y el servicio que le interesa.
      4. Menciona que usamos tecnología ecológica y de alta temperatura (vapor) para eliminar el 99.9% de bacterias y ácaros.
      
      Información de contacto oficial:
      - Teléfono/WhatsApp: +57 312 345 6789
      - Email: contacto@steamclean.com.co
      - Ubicación: Bogotá, Colombia.
      
      Responde de forma concisa y usa emojis para que el chat sea amigable. Mantén el tono de un asesor premium.
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
