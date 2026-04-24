import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = 'https://api.ycloud.com/v2';

async function uploadToYCloud() {
  const apiKey = process.env.YCLOUD_API_KEY;
  const fromNumber = process.env.YCLOUD_WHATSAPP_NUMBER;
  const filePath = path.join(process.cwd(), 'zenit-song.mp3');

  if (!apiKey || !fromNumber) {
    console.error('❌ YCLOUD_API_KEY or YCLOUD_WHATSAPP_NUMBER missing in .env');
    return;
  }

  if (!fs.existsSync(filePath)) {
    console.error('❌ zenit-song.mp3 not found in root directory');
    return;
  }

  console.log(`⏳ Uploading zenit-song.mp3 to YCloud for number ${fromNumber}...`);

  const url = `${BASE_URL}/whatsapp/media/${fromNumber}/upload`;
  const buffer = fs.readFileSync(filePath);
  
  // Use a proper FormData construction for Node.js
  const formData = new FormData();
  const blob = new Blob([buffer], { type: 'audio/mpeg' });
  formData.append('file', blob, 'zenit-song.mp3');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
      },
      body: formData
    });

    const data = await response.json() as any;

    if (!response.ok) {
      console.error('❌ YCloud Upload Error:', JSON.stringify(data, null, 2));
      return;
    }

    console.log('\n✅ SUCCESS! YCloud Media Uploaded.');
    console.log('-----------------------------------');
    console.log('NEW MEDIA ID:', data.id);
    console.log('-----------------------------------');
    console.log('\nUpdate your .env and Railway variables with this ID.');
  } catch (error: any) {
    console.error('❌ Network Error:', error.message);
  }
}

uploadToYCloud();
