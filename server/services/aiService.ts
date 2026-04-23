import OpenAI from 'openai';
import { toFile } from 'openai/uploads';
import { File } from 'node:buffer';

// Polyfill para entornos de Node antiguos (como Railway por defecto)
if (!globalThis.File) {
  (globalThis as any).File = File;
}

/**
 * AI Service using OpenAI GPT-4o-mini
 * Handles generating responses and transcribing audio.
 */
class AIService {
  private static _openai: OpenAI | null = null;

  // Memoria in-memory (role: 'user' | 'assistant', content: string)
  private static chatHistory = new Map<string, any[]>();

  static getChatHistory(from: string) {
    return this.chatHistory.get(from) || [];
  }

  static initHistory(from: string) {
    if (!this.chatHistory.has(from)) {
      this.chatHistory.set(from, []);
    }
  }

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
      Tu nombre es "ZENIT Bot", el asesor inteligente de ZENIT SOLUTIONS, una empresa líder en limpieza al vapor profesional en Bogotá, Colombia.
      
      PERSONALIDAD Y TONO (CRÍTICO):
      - Habla con un tono carismatico, amable y profesional, sin nungun acento.
      - Sé muy carismatico, respetuoso y servicial.
      
      NUESTROS SERVICIOS OFICIALES:
      1. Limpieza Residencial: Hogares impecables con productos ecológicos y técnicas profesionales.
      2. Limpieza Comercial: Oficinas, locales comerciales, cristales y mantenimiento de áreas comunes.
      3. Limpieza Post-Construcción: Remoción de escombros finos, pulido de pisos y superficies delicadas tras obras o remodelaciones.
      4. Limpieza Especializada: Expertos en Limpieza de Tapicería (sofás, sillas), Tratamiento de Alfombras, Desinfección de espacios y servicios para eventos.
      
      OBJETIVOS:
      - Responder dudas sobre estos servicios.
      - Para cotizaciones, pedir: nombre, email, teléfono y servicio de interés.
      
      REGLAS DE ORO:
      - IDENTIDAD: En cada respuesta (especialmente la primera), menciónanos como ZENIT SOLUTIONS.
      - CIERRE DEL PRIMER MENSAJE: Únicamente en tu primer contacto con el cliente (cuando no hay historial previo), termina siempre con la pregunta exacta: "¿Qué vamos a limpiar hoy?". En los siguientes mensajes, NO repitas esta pregunta, sé más natural según la conversación.
      - Sé BREVE (2 a 4 oraciones).
      - Usa emojis elegantes.
    `;
  }

  /**
   * Generate an AI response for a given text prompt
   */
  static async generateResponse(from: string, prompt: string): Promise<string> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        return 'Lo siento, mi servicio de inteligencia no está configurado. Por favor contacta a un asesor humano.';
      }

      const openai = this.getClient();

      // 1. Recuperar historial del usuario
      let history = this.chatHistory.get(from) || [];

      // 2. Agregar el mensaje actual del usuario al historial
      history.push({ role: 'user', content: prompt });

      // 3. Limitar a los últimos 10 mensajes
      if (history.length > 10) {
        history = history.slice(history.length - 10);
      }

      // 4. Construir el array de mensajes para OpenAI
      const messages = [
        { role: 'system', content: this.getSystemPrompt() },
        ...history
      ];

      // 5. Llamar a GPT-4o-mini
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 150, // Forzar respuestas cortas
      });

      const responseText = completion.choices[0]?.message?.content || 'Lo siento, no pude generar una respuesta.';

      // 6. Guardar la respuesta del bot en el historial
      history.push({ role: 'assistant', content: responseText });
      this.chatHistory.set(from, history);

      return responseText;
    } catch (error: any) {
      console.error('[AIService] ❌ Error generating content:', error.message);
      return 'Lo siento, tuve un pequeño problema procesando tu mensaje. ¿Podrías repetirlo?';
    }
  }

  /**
   * Generate an AI response from an audio file (Voice Note) via Whisper + GPT-4o-mini
   */
  static async generateResponseFromAudio(from: string, audioBuffer: Buffer, mimeType: string): Promise<{ response: string; transcription: string }> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        return { response: 'Lo siento, mi servicio de inteligencia no está configurado.', transcription: '' };
      }

      const openai = this.getClient();

      // 1. Convertir el buffer a un archivo compatible con OpenAI (usando su utilidad toFile)
      // MimeType viene de WhatsApp, usualmente es audio/ogg
      const fileExtension = mimeType.includes('ogg') ? 'ogg' : 'mp3';
      const file = await toFile(audioBuffer, `audio.${fileExtension}`, { type: mimeType });

      console.log('[AIService] 🎙️ Transcribiendo audio con Whisper...');
      // 2. Transcribir el audio usando Whisper
      const transcription = await openai.audio.transcriptions.create({
        file: file,
        model: 'whisper-1',
        language: 'es' // Forzar español para mayor precisión
      });

      const userText = transcription.text;
      console.log(`[AIService] 📝 Transcripción: "${userText}"`);

      // 3. Ya tenemos el texto, lo pasamos por el flujo normal de chat para que se guarde en la memoria y genere respuesta
      const promptInfo = `[Nota de voz transcrita]: ${userText}`;
      const responseText = await this.generateResponse(from, promptInfo);

      return { response: responseText, transcription: userText };

    } catch (error: any) {
      console.error('[AIService] ❌ Error processing audio:', error.message);
      return {
        response: 'Lo siento, tuve un problema escuchando tu nota de voz. ¿Podrías escribirlo o intentarlo de nuevo?',
        transcription: ''
      };
    }
  }
}

export default AIService;
