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
  if (!ctx.query) return ctx.reply('❌ Masukkan pertanyaan untuk GPT-4.\nContoh: *.gpt4 jelaskan teori relativitas*');

  m.reply(global.msg?.wait || global.mess?.wait || '⏳ Sedang diproses, mohon tunggu...');
  try {
    const apiUrl = global.API ? global.API('kyzz', '/api/ai/gpt4', {
      prompt: ctx.query
    }, 'apikey') : `https://api.kyzzz.eu.cc/api/ai/gpt4?prompt=${encodeURIComponent(ctx.query)}&apikey=${global.kyzzKey || 'kyuujir'}`;

    const { data } = await axios.get(apiUrl);
    const resultText = data.reply || data.result || data.text || (typeof data === 'string' ? data : null);

    if (!resultText) return ctx.reply('❌ Gagal mendapatkan respons dari GPT-4.');

    await kyu.sendMessage(ctx.id, {
      text: `🤖 *GPT-4 AI*\n\n${resultText}`
    }, { quoted: simpleQuoted(ctx) });
  } catch (e) {
    ctx.reply(`❌ Gagal menghubungi GPT-4: ${e.message}`);
  }
};

handler.help        = ["gpt4", "gpt"];
handler.tags        = ["ai"];
handler.command     = /^(gpt4|gpt)$/i;
handler.description = "Tanya jawab AI menggunakan GPT-4 via Kyzz API";

export default handler;
