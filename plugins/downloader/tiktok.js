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
import { simpleQuoted } from '../../lib/fakeQuoted.js';

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
  if (!ctx.args.length) return ctx.reply('❌ Masukkan link TikTok.');
  const url = ctx.args[0];
  if (!/(tiktok\.com|vt\.tiktok\.com)/i.test(url)) return ctx.reply('❌ Link TikTok tidak valid.');

  m.reply(global.msg?.wait || global.mess?.wait || '⏳ Sedang diproses, mohon tunggu...');
  try {
    const apiUrl = global.API ? global.API('kyzz', '/api/download/tiktok', { url }, 'apikey')
      : `https://api.kyzzz.eu.cc/api/download/tiktok?url=${encodeURIComponent(url)}&apikey=${global.kyzzKey || 'kyuujir'}`;

    const { data } = await axios.get(apiUrl).catch(() => ({ data: null }));

    if (data?.status && data?.result) {
      const res = data.result;
      if (res.video || res.hdplay || res.play) {
        await kyu.sendMessage(ctx.id, {
          video: { url: res.video || res.hdplay || res.play },
          caption: `🎬 *TIKTOK DOWNLOADER*\n\n📌 Title: ${res.title || '-'}\n👤 Author: ${res.author?.unique_id || res.author || '-'}`
        }, { quoted: simpleQuoted(ctx) });
      }
      if (res.audio || res.music) {
        await kyu.sendMessage(ctx.id, {
          audio: { url: res.audio || res.music },
          mimetype: 'audio/mpeg',
          fileName: 'tiktok_audio.mp3'
        }, { quoted: simpleQuoted(ctx) });
      }
      return;
    }

    
    const fallback = await axios.post('https://tikwm.com/api/', { url, hd: 1 }, { headers: { 'content-type': 'application/json' } });
    const tikData = fallback.data?.data;
    if (!tikData) return ctx.reply('❌ Gagal mengambil data TikTok.');

    await kyu.sendMessage(ctx.id, {
      video: { url: tikData.hdplay || tikData.play },
      caption: `🎬 *TIKTOK DOWNLOADER*\n\n📌 Title: ${tikData.title || '-'}\n👤 Author: ${tikData.author?.unique_id || '-'}`
    }, { quoted: simpleQuoted(ctx) });

    if (tikData.music) {
      await kyu.sendMessage(ctx.id, {
        audio: { url: tikData.music },
        mimetype: 'audio/mpeg',
        fileName: 'tiktok_audio.mp3'
      }, { quoted: simpleQuoted(ctx) });
    }
  } catch (e) {
    ctx.reply(`❌ Gagal download TikTok: ${e.message}`);
  }
};

handler.help        = ["tiktok", "tt", "ttdl", "tiktokdl"];
handler.tags        = ["downloader"];
handler.command     = /^(tiktok|tt|ttdl|tiktokdl)$/i;
handler.description = "Download video & audio dari TikTok tanpa watermark";

export default handler;
