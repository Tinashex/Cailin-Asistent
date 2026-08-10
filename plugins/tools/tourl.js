/**

   * WhatsApp bot Cailin Assistant using baileys (@wishkeysocket/baileys)
   * Type plugins  | Modules ESM
   * Creator Mommy kyu
   * Follow https://whatsapp.com/channel/0029Vb7gcbuLdQelWzrTzD3D
   * Follow https://whatsapp.com/channel/0029VbCsmdMC1Fu6NbIaaY2T
   
   ** Dilarang menjual   script ini.*
   
   ** [ID] - Baca file README.md untuk melihat panduan!
   ** [ENG] -  Read the README.md file to see the guide!
   
   ** Copyright (©) Mommy kyu 2026 **
   
**/

import axios from 'axios';
import FormData from 'form-data';
import { downloadContentFromMessage, prepareWAMessageMedia } from '@whiskeysockets/baileys';
import { simpleQuoted } from '../../lib/fakeQuoted.js';


async function atharsUpload(buffer, fileName) {
  const form = new FormData();
  form.append('file', buffer, fileName);

  const res = await axios.post('https://athars.space/upload.php', form, {
    headers: {
      ...form.getHeaders(),
      'User-Agent': 'Mozilla/5.0',
      Accept: '*/*'
    },
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
    timeout: 30000
  });

  const output = res.data;
  if (typeof output === 'string' && output.trim().startsWith('http')) {
    return output.trim();
  }
  if (typeof output === 'string') {
    return `https://athars.space/${output.trim()}`;
  }
  throw new Error('Response Athars invalid');
}


async function waServerUpload(sock, buffer, mediaType) {
  const isImage = mediaType === 'image';
  const isVideo = mediaType === 'video';
  const isAudio = mediaType === 'audio';

  const mediaInput = isImage ? { image: buffer }
                   : isVideo ? { video: buffer }
                   : isAudio ? { audio: buffer }
                   : { document: buffer, mimetype: 'application/octet-stream' };

  const uploaded = await prepareWAMessageMedia(mediaInput, {
    upload: sock.waUploadToServer
  });

  const msg = uploaded.imageMessage || uploaded.videoMessage || uploaded.audioMessage || uploaded.documentMessage;
  if (msg?.url) {
    return msg.url;
  }
  throw new Error('Upload WhatsApp Server gagal');
}

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
  const sock = kyu || ctx?.conn;
  const media = ctx.media || ctx.quoted?.media;

  if (!media) {
    return ctx.reply(`❌ *Penggunaan:* Balas atau kirim gambar, video, atau audio dengan perintah *${prefix}tourl* atau *${prefix}upload*`);
  }

  m.reply('⏳ Sedang mengupload media...');

  try {
    const type = ctx.mediaType || ctx.quoted?.mediaType || 'image';
    const stream = await downloadContentFromMessage(media, type);
    let chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);

    const extension = (ctx.mimetype || ctx.quoted?.mimetype || 'image/jpeg').split('/')[1] || 'bin';
    const fileName = `upload_${Date.now()}.${extension}`;
    const sizeKb = (buffer.length / 1024).toFixed(2);

    
    const [atharsRes, waRes] = await Promise.allSettled([
      atharsUpload(buffer, fileName),
      waServerUpload(sock, buffer, type)
    ]);

    const atharsUrl = atharsRes.status === 'fulfilled' ? atharsRes.value : '❌ Gagal';
    const waUrl = waRes.status === 'fulfilled' ? waRes.value : '❌ Gagal';

    const primaryUrl = atharsRes.status === 'fulfilled' ? atharsRes.value : waUrl;

    let caption = `🌐 *MEDIA UPLOADED RESULTS*\n\n` +
      `📊 *Size* : ${sizeKb} KB\n\n` +
      `📌 *1. Athars Space URL*\n${atharsUrl}\n\n` +
      `📌 *2. WhatsApp Server URL*\n${waUrl}`;

    await sock.sendMessage(m.chat || ctx.id, {
      text: caption,
      buttons: [
        { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: '📋 Copy Athars URL', copy_code: typeof atharsUrl === 'string' && atharsUrl.startsWith('http') ? atharsUrl : primaryUrl }) },
        { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: '📋 Copy WA Server URL', copy_code: typeof waUrl === 'string' && waUrl.startsWith('http') ? waUrl : primaryUrl }) }
      ]
    }, { quoted: simpleQuoted(ctx) });

  } catch (e) {
    ctx.reply(`❌ Gagal upload media: ${e.message}`);
  }
};

handler.help        = ["tourl", "upload"];
handler.tags        = ["tools"];
handler.command     = /^(tourl|upload)$/i;
handler.description = "Mengupload media secara otomatis ke Athars Space dan WA Server";

export default handler;
