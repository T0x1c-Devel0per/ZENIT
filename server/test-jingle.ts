import dotenv from 'dotenv';
import WhatsAppService from './services/whatsappService.js';

dotenv.config();

async function testJingle() {
  const targetNumber = '573144457149';
  const jingleId = process.env.WELCOME_AUDIO_MEDIA_ID;

  if (!jingleId) {
    console.error('❌ WELCOME_AUDIO_MEDIA_ID not found in .env');
    return;
  }

  console.log(`⏳ Sending welcome jingle (ID: ${jingleId}) to ${targetNumber} via YCloud...`);

  try {
    const result = await WhatsAppService.sendAudio(targetNumber, jingleId);
    console.log('✅ Jingle sent successfully!', result.id || '');
  } catch (error: any) {
    console.error('❌ Failed to send jingle:', error.message);
  }
}

testJingle();
