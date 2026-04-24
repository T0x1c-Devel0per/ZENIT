import OpenAI from 'openai';

/**
 * Text-to-Speech Service using ElevenLabs and OpenAI
 * Provides ultra-realistic voices for a premium customer experience.
 */
class TTSService {
  /**
   * Generates an audio buffer from text using ElevenLabs API
   */
  static async generateAudio(text: string): Promise<Buffer> {
    const apiKey = process.env.ELEVENLABS_API_KEY;
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
          model_id: 'eleven_multilingual_v2',
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

  /**
   * Generates an audio buffer from text using OpenAI TTS
   */
  static async generateAudioOpenAI(text: string): Promise<Buffer> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY no está configurada.');

    try {
      console.log(`[TTSService] 🎙️ Generando audio con OpenAI TTS (Voz: nova)...`);
      const openai = new OpenAI({ apiKey });
      
      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "nova", // Voz profesional y clara
        input: text,
      });

      const buffer = Buffer.from(await mp3.arrayBuffer());
      return buffer;
    } catch (error: any) {
      console.error('[TTSService] ❌ Error generating audio with OpenAI:', error.message);
      throw error;
    }
  }
}

export default TTSService;
