import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Extraction Service
 * Uses Gemini to extract structured contact information from raw chat messages.
 */
class ExtractionService {
  private static genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  private static model = ExtractionService.genAI.getGenerativeModel({ 
    model: 'gemini-flash-latest',
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

  /**
   * Tries to extract structured data from a message
   */
  static async extractInfo(text: string) {
    try {
      if (!process.env.GEMINI_API_KEY) return null;

      const result = await this.model.generateContent(text);
      const response = await result.response;
      const jsonText = response.text().replace(/```json|```/g, '').trim();
      
      return JSON.parse(jsonText);
    } catch (error) {
      console.error('[ExtractionService] ❌ Error extracting info:', error);
      return null;
    }
  }
}

export default ExtractionService;
