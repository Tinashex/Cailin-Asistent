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
  if (!ctx.query) return ctx.reply('❌ Masukkan pencarian TikTok.\nContoh: *.tiktoksearch jj anime*');

  m.reply(global.msg?.wait || global.mess?.wait || '⏳ Sedang mencari video TikTok...');
  try {
    const apiUrl = global.API ? global.API('kyzz', '/api/search/tiktok', { query: ctx.query }, 'apikey')
      : `https://api.kyzzz.eu.cc/api/search/tiktok?query=${encodeURIComponent(ctx.query)}&apikey=${global.kyzzKey || 'kyuujir'}`;

    const { data } = await axios.get(apiUrl).catch(() => ({ data: null }));
    const result = data?.result || data?.data;

    if (result && Array.isArray(result) && result.length) {
      const video = result[0];
      const videoUrl = video.play || video.video || video.url;
      if (videoUrl) {
        return kyu.sendMessage(ctx.id, {
          video: { url: videoUrl },
          caption: `🎬 *TikTok Search*\n\n📌 Title: ${video.title || ctx.query}\n👤 Author: ${video.author?.unique_id || video.author || '-'}`
        }, { quoted: simpleQuoted(ctx) });
      }
    }

    
    const fallback = await axios.post('https://tikwm.com/api/feed/search', { keywords: ctx.query, count: 5 });
    const videos = fallback.data?.data?.videos;
    if (!videos || !videos.length) return ctx.reply('❌ Video TikTok tidak ditemukan.');

    const first = videos[0];
    await kyu.sendMessage(ctx.id, {
      video: { url: `https://tikwm.com${first.play}` },
      caption: `🎬 *TikTok Search*\n\n📌 Title: ${first.title}\n👤 Author: ${first.author.unique_id}`
    }, { quoted: simpleQuoted(ctx) });
  } catch (e) {
    ctx.reply(`❌ Gagal mencari TikTok: ${e.message}`);
  }
};

handler.help        = ["tiktoksearch", "ttsearch"];
handler.tags        = ["search"];
handler.command     = /^(tiktoksearch|ttsearch)$/i;
handler.description = "Mencari video TikTok berdasarkan kata kunci via Kyzz API";

export default handler;
