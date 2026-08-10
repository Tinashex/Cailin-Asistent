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

import yts from 'yt-search';
import { simpleQuoted } from '../../lib/fakeQuoted.js';

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
  if (!ctx.query) return ctx.reply('❌ Masukkan judul lagu.\nContoh: *.play melody alan walker*');

  m.reply(global.msg?.wait || global.mess?.wait || '⏳ Sedang diproses, mohon tunggu...');
  try {
    const search = await yts(ctx.query);
    const video = search.videos[0];
    if (!video) return ctx.reply('❌ Lagu tidak ditemukan.');

    const ytUrl = video.url;

    
    const base = 'https://youtubedl.siputzx.my.id';
    const pollRes = await fetch(`${base}/download?type=audio&url=${encodeURIComponent(ytUrl)}`);
    const data = await pollRes.json();
    const fileUrl = data.fileUrl || data.file_url;

    if (!fileUrl) throw new Error('Gagal mendapatkan file audio');

    const fullUrl = fileUrl.startsWith('http') ? fileUrl : `${base}${fileUrl}`;
    const mp3Res = await fetch(fullUrl);
    const audioBuf = Buffer.from(await mp3Res.arrayBuffer());

    await kyu.sendMessage(ctx.id, {
      audio: audioBuf,
      mimetype: 'audio/mpeg',
      fileName: `${video.title}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: video.title,
          body: `Durasi: ${video.timestamp} | ${video.author.name}`,
          thumbnailUrl: video.thumbnail,
          sourceUrl: ytUrl,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: simpleQuoted(ctx) });
  } catch (e) {
    ctx.reply(`❌ Gagal memutar lagu: ${e.message}`);
  }
};

handler.help        = ["play", "ytplay", "lagu"];
handler.tags        = ["search"];
handler.command     = /^(play|ytplay|lagu)$/i;
handler.description = "Mencari dan memutar audio dari YouTube";

export default handler;
