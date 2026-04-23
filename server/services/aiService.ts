import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * AI Service using Google Gemini
 * Handles generating responses for customer inquiries.
 */
class AIService {
  private static _model: any = null;

  private static getModel() {
    if (!this._model) {
      const apiKey = process.env.GEMINI_API_KEY || '';
      if (!apiKey) throw new Error('GEMINI_API_KEY no está configurada');
      
      const genAI = new GoogleGenerativeAI(apiKey);
      this._model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash-lite',
        systemInstruction: `
      Tu nombre es "ZENIT Bot", el asesor inteligente de ZENIT SOLUTIONS, una empresa líder en limpieza al vapor profesional en Bogotá, Colombia.
      
      Tus objetivos son:
      1. Responder preguntas sobre nuestros servicios premium (Limpieza residencial profunda, desinfección comercial, mantenimiento de espacios de lujo).
      2. Ser elegante, profesional, eficiente y servicial.
      3. Si el cliente quiere una cotización, pídele su nombre, email, teléfono y el servicio que le interesa.
      4. Menciona que en ZENIT SOLUTIONS usamos tecnología de vanguardia y procesos ecológicos para garantizar espacios impecables y saludables.
      
      Información de contacto oficial:
      - Empresa: ZENIT SOLUTIONS
      - Ubicación: Bogotá, Colombia.
      
      Responde de forma concisa y profesional. Usa emojis elegantes. Mantén el tono de un asesor de alto nivel.
    `,
      });
    }
    return this._model;
  }

  /**
   * Generate an AI response for a given prompt
   */
  static async generateResponse(prompt: string): Promise<string> {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return 'Lo siento, mi servicio de inteligencia no está configurado. Por favor contacta a un asesor humano.';
      }

      const result = await this.getModel().generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error('[AIService] ❌ Error generating content:', error.message);
      return 'Lo siento, tuve un pequeño problema procesando tu mensaje. ¿Podrías repetirlo?';
    }
  }
  /**
   * Generate an AI response from an audio file (Voice Note)
   */
  static async generateResponseFromAudio(audioBuffer: Buffer, mimeType: string): Promise<string> {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return 'Lo siento, mi servicio de inteligencia no está configurado.';
      }

      const base64Audio = audioBuffer.toString('base64');

      const result = await this.getModel().generateContent([
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Audio
          }
        },
        { text: "Responde a este mensaje de voz de forma natural, como si estuvieras teniendo una conversación por WhatsApp." }
      ]);
      
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error('[AIService] ❌ Error generating content from audio:', error.message);
      return 'Lo siento, tuve un problema escuchando tu nota de voz. ¿Podrías escribirlo o intentarlo de nuevo?';
    }
  }
}

export default AIService;
