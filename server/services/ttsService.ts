

/**
 * Text-to-Speech Service using OpenAI
 */
class TTSService {
  /**
   * Generates an audio buffer from text using OpenAI's TTS API
   */
  static async generateAudio(text: string): Promise<Buffer> {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY no está configurada.');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: text,
          voice: 'alloy', // 'alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'
          response_format: 'mp3'
        })
      });

      if (!response.ok) {
        const errData = await response.json() as any;
        throw new Error(errData.error?.message || 'Error generating TTS audio');
      }

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error: any) {
      console.error('[TTSService] ❌ Error generating audio:', error.message);
      throw error;
    }
  }
}

export default TTSService;
