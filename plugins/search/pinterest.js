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
  if (!ctx.query) return ctx.reply('❌ Masukkan kata kunci pencarian Pinterest.\nContoh: *.pinterest aesthetic wallpaper*');

  m.reply(global.msg?.wait || global.mess?.wait || '⏳ Sedang mencari gambar Pinterest...');
  try {
    const apiUrl = global.API ? global.API('kyzz', '/api/search/pinterest', { query: ctx.query }, 'apikey')
      : `https://api.kyzzz.eu.cc/api/search/pinterest?query=${encodeURIComponent(ctx.query)}&apikey=${global.kyzzKey || 'kyuujir'}`;

    const { data } = await axios.get(apiUrl).catch(() => ({ data: null }));
    let images = data?.result || data?.data || (Array.isArray(data) ? data : []);

    if (!images || !images.length) {
      
      const fallback = await axios.get(`https://api.termai.cc/api/search/pinterest?query=${encodeURIComponent(ctx.query)}&key=${global.termaiKey || 'Bell409'}`);
      images = fallback.data?.data || [];
    }

    if (!images.length) return ctx.reply('❌ Gambar tidak ditemukan.');

    const imgUrl = typeof images[0] === 'string' ? images[0] : (images[0]?.images_url || images[0]?.url);

    await kyu.sendMessage(ctx.id, {
      image: { url: imgUrl },
      caption: `🖼️ *Pinterest Search*\n\n🔍 Keyword: ${ctx.query}`
    }, { quoted: simpleQuoted(ctx) });
  } catch (e) {
    ctx.reply(`❌ Gagal mencari di Pinterest: ${e.message}`);
  }
};

handler.help        = ["pinterest", "pin"];
handler.tags        = ["search"];
handler.command     = /^(pinterest|pin)$/i;
handler.description = "Mencari gambar dari Pinterest via Kyzz API";

export default handler;
