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

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { simpleQuoted } from '../../lib/fakeQuoted.js';

function extractYtId(input) {
  const match = input.match(/(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/live\/)([\w-]{6,})/);
  return match ? `https://www.youtube.com/watch?v=${match[2]}` : input;
}

async function dlBuffer(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return Buffer.from(await r.arrayBuffer());
}

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
  if (!ctx.args.length) return ctx.reply('❌ Masukkan link YouTube.');
  const ytUrl = extractYtId(ctx.args[0]);
  if (!ytUrl.includes('youtube.com/')) return ctx.reply('❌ Link YouTube tidak valid.');

  m.reply(global.msg?.wait || global.mess?.wait || '⏳ Memulai download video...');
  try {
    const apiUrl = global.API ? global.API('kyzz', '/api/download/ytmp4', { url: ytUrl }, 'apikey')
      : `https://api.kyzzz.eu.cc/api/download/ytmp4?url=${encodeURIComponent(ytUrl)}&apikey=${global.kyzzKey || 'kyuujir'}`;

    const { data } = await axios.get(apiUrl).catch(() => ({ data: null }));
    let videoUrl = data?.result?.downloadUrl || data?.result?.url || data?.downloadUrl;
    let title = data?.result?.title || 'YouTube Video';

    if (!videoUrl) {
      
      const pollRes = await fetch(`https://youtubedl.siputzx.my.id/download?type=merge&url=${encodeURIComponent(ytUrl)}`);
      const pollData = await pollRes.json();
      videoUrl = pollData.fileUrl || pollData.file_url;
      title = pollData.title || title;
      if (!videoUrl?.startsWith('http')) videoUrl = `https://youtubedl.siputzx.my.id${videoUrl}`;
    }

    const mp4Buf = await dlBuffer(videoUrl);

    await kyu.sendMessage(ctx.id, {
      video: mp4Buf,
      mimetype: 'video/mp4',
      caption: `🎬 *YouTube Video*\n\n📌 Title: ${title}\n🔗 Link: ${ytUrl}`
    }, { quoted: simpleQuoted(ctx) });
  } catch (e) {
    ctx.reply(`❌ Gagal download ytmp4: ${e.message}`);
  }
};

handler.help        = ["ytmp4", "ytm4", "ytvideo"];
handler.tags        = ["downloader"];
handler.command     = /^(ytmp4|ytm4|ytvideo)$/i;
handler.description = "Download video dari YouTube (MP4)";

export default handler;
