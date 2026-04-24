import OpenAI from 'openai';

/**
 * Extraction Service
 * Uses OpenAI GPT-4o-mini to extract structured contact information from raw chat messages.
 */
class ExtractionService {
  private static _openai: OpenAI | null = null;

  private static getClient(): OpenAI {
    if (!this._openai) {
      const apiKey = process.env.OPENAI_API_KEY || '';
      if (!apiKey) throw new Error('OPENAI_API_KEY no está configurada');
      this._openai = new OpenAI({ apiKey });
    }
    return this._openai;
  }

  private static getSystemPrompt(): string {
    return `
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
    `;
  }

  /**
   * Tries to extract structured data from a message
   */
  static async extractInfo(text: string) {
    try {
      if (!process.env.OPENAI_API_KEY) return null;
      if (!text || !text.trim()) return null;
      const openai = this.getClient();

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: this.getSystemPrompt() },
          { role: 'user', content: text }
        ],
        response_format: { type: 'json_object' }, // Forzar salida en JSON
        temperature: 0.1, // Baja temperatura para mayor precisión
      });

      const jsonText = completion.choices[0]?.message?.content;
      if (!jsonText) return null;

      return JSON.parse(jsonText);
    } catch (error) {
      console.error('[ExtractionService] ❌ Error extracting info:', error);
      return null;
    }
  }
}

export default ExtractionService;
