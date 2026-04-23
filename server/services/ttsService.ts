/**
 * Text-to-Speech Service using ElevenLabs
 * Provides ultra-realistic voices for a premium customer experience.
 */
class TTSService {
  /**
   * Generates an audio buffer from text using ElevenLabs API
   */
  static async generateAudio(text: string): Promise<Buffer> {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    // Usamos la voz "Bella" (muy natural para español) por defecto, o la que esté en el .env
    const voiceId = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL'; 
    
    if (!apiKey) {
      throw new Error('ELEVENLABS_API_KEY no está configurada.');
    }

    try {
      console.log(`[TTSService] 🎙️ Generando audio con ElevenLabs (Voz: ${voiceId})...`);
      
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'accept': 'audio/mpeg'
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2', // El mejor modelo para español
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        const errData = await response.json() as any;
        throw new Error(errData.detail?.message || 'Error generating ElevenLabs audio');
      }

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error: any) {
      console.error('[TTSService] ❌ Error generating audio with ElevenLabs:', error.message);
      throw error;
    }
  }
}

export default TTSService;
