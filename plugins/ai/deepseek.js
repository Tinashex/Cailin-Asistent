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
  if (!ctx.query) return ctx.reply('❌ Masukkan pertanyaan untuk Deepseek AI.\nContoh: *.deepseek buatkan fungsi quicksort di JS*');

  m.reply(global.msg?.wait || global.mess?.wait || '⏳ Sedang diproses, mohon tunggu...');
  try {
    const apiUrl = global.API ? global.API('kyzz', '/api/ai/deepseek', {
      prompt: ctx.query
    }, 'apikey') : `https://api.kyzzz.eu.cc/api/ai/deepseek?prompt=${encodeURIComponent(ctx.query)}&apikey=${global.kyzzKey || 'kyuujir'}`;

    const { data } = await axios.get(apiUrl).catch(() => ({ data: null }));
    const responseText = data?.reply || data?.result || data?.answer || (typeof data === 'string' ? data : null);

    if (!responseText) {
      const res = await axios.post('https://api.termai.cc/api/ai/deepseek', { prompt: ctx.query, key: global.termaiKey || 'Bell409' });
      const fallbackText = res.data?.data || res.data?.reply || res.data?.result;
      if (!fallbackText) throw new Error('API Deepseek tidak merespon');
      return kyu.sendMessage(ctx.id, { text: `🐳 *Deepseek AI*\n\n${fallbackText}` }, { quoted: simpleQuoted(ctx) });
    }

    await kyu.sendMessage(ctx.id, {
      text: `🐳 *Deepseek AI*\n\n${responseText}`
    }, { quoted: simpleQuoted(ctx) });
  } catch (e) {
    ctx.reply(`❌ Gagal menghubungi Deepseek AI: ${e.message}`);
  }
};

handler.help        = ["deepseek", "ds"];
handler.tags        = ["ai"];
handler.command     = /^(deepseek|ds)$/i;
handler.description = "Tanya jawab AI menggunakan Deepseek via Kyzz API";

export default handler;
