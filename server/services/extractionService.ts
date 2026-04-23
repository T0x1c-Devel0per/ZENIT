import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Extraction Service
 * Uses Gemini to extract structured contact information from raw chat messages.
 */
class ExtractionService {
  private static _model: any = null;

  private static getModel() {
    if (!this._model) {
      const apiKey = process.env.GEMINI_API_KEY || '';
      if (!apiKey) throw new Error('GEMINI_API_KEY no está configurada');
      
      const genAI = new GoogleGenerativeAI(apiKey);
      this._model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash-lite',
        systemInstruction: `
      Eres un extractor de datos ultra-preciso. Tu única tarea es leer mensajes de chat y extraer información de contacto en formato JSON.
      
      Si encuentras estos campos, extráelos:
      - name: Nombre de la persona.
      - email: Correo electrónico válido.
      - phone: Número de teléfono o WhatsApp.
      - service: El servicio de limpieza que le interesa.
      - message: Cualquier detalle adicional o el mensaje original resumido.

      IMPORTANTE:
      - Responde UNICAMENTE con el objeto JSON. 
      - Si no encuentras un campo, ponlo como null.
      - No agregues explicaciones ni texto adicional.
      - Ejemplo de salida: {"name": "Juan", "email": "juan@mail.com", "phone": "123", "service": "Limpieza", "message": "Detalles"}
    `,
      });
    }
    return this._model;
  }

  /**
   * Tries to extract structured data from a message
   */
  static async extractInfo(text: string) {
    try {
      if (!process.env.GEMINI_API_KEY) return null;

      const result = await this.getModel().generateContent(text);
      const response = await result.response;
      let jsonText = response.text().replace(/```json|```/g, '').trim();
      
      // Intentar extraer solo el bloque JSON si hay texto adicional
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }
      
      return JSON.parse(jsonText);
    } catch (error) {
      console.error('[ExtractionService] ❌ Error extracting info:', error);
      return null;
    }
  }
}

export default ExtractionService;
