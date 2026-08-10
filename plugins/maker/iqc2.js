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

import { simpleQuoted } from '../../lib/fakeQuoted.js';

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
  try {
    const input = ctx.query;
    if (!input) return ctx.reply("❌ Contoh: .iqc2 teks kamu | 20:00");

    const parts = input.split("|").map(v => v.trim());
    const inputText = parts[0];
    const time = parts[1] || "19:00";

    m.reply(global.msg?.wait || global.mess?.wait || '⏳ Sedang diproses, mohon tunggu...');
    const apiKey = global.kyzzKey || global.APIKeys?.['https://api.kyzzz.eu.cc'] || "kyuujir";

    const apiUrl = global.API ? global.API('kyzz', '/api/canvas/iqc-pink', {
      text: inputText,
      time: time,
      apikey: apiKey
    }) : `https://api.kyzzz.eu.cc/api/canvas/iqc-pink?text=${encodeURIComponent(inputText)}&time=${encodeURIComponent(time)}&apikey=${apiKey}`;

    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`API Kyzz: ${res.status}`);

    const imageBuffer = await res.arrayBuffer();

    await kyu.sendMessage(ctx.id, {
      image: Buffer.from(imageBuffer),
      mimetype: "image/png",
      caption: "✅ *— IQC Pink (Kyzz API)*\nBerhasil dibuat!"
    }, { quoted: simpleQuoted(ctx) });
  } catch (error) {
    ctx.reply(`❌ Gagal membuat IQC2: ${error.message}`);
  }
};

handler.help        = ["iqc2", "iqcpink", "iphonequote2"];
handler.tags        = ["maker"];
handler.command     = /^(iqc2|iqcpink|iphonequote2)$/i;
handler.description = "Membuat iPhone Quote Pink via Kyzz API";

export default handler;
