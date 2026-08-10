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
  try {
    const input = ctx.query;
    if (!input) return ctx.reply("❌ Masukkan pesan quote Nokia!\nContoh: *.qnokia Halo dunia|Kyzz*");

    const [messageText, senderName = ctx.pushname || "Kyu User"] = input.split("|").map(v => v.trim());

    m.reply(global.msg?.wait || global.mess?.wait || '⏳ Sedang diproses, mohon tunggu...');
    const apiKey = global.kyzzKey || global.APIKeys?.['https://api.kyzzz.eu.cc'] || "kyuujir";

    const apiUrl = global.API ? global.API('kyzz', '/api/canvas/quote-nokia', {
      message: messageText,
      sender: senderName
    }, 'apikey') : `https://api.kyzzz.eu.cc/api/canvas/quote-nokia?message=${encodeURIComponent(messageText)}&sender=${encodeURIComponent(senderName)}&apikey=${apiKey}`;

    const res = await axios.get(apiUrl, { responseType: 'arraybuffer' });

    await kyu.sendMessage(ctx.id, {
      image: Buffer.from(res.data),
      mimetype: 'image/png',
      caption: `📱 *Nokia Quote Canvas*\n\n💬 "${messageText}"\n👤 — ${senderName}`
    }, { quoted: simpleQuoted(ctx) });
  } catch (error) {
    ctx.reply(`❌ Gagal membuat Quote Nokia: ${error.message}`);
  }
};

handler.help        = ["qnokia", "quotenokia"];
handler.tags        = ["maker"];
handler.command     = /^(qnokia|quotenokia)$/i;
handler.description = "Membuat quote jadul layar Nokia via Kyzz API";

export default handler;
