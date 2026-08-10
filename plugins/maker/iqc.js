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
    if (!input) return ctx.reply("❌ Contoh: .iqc hello | Telkomsel");

    const [inputText, carrier = "Telkomsel"] = input.split("|").map(v => v.trim());
    m.reply(global.msg?.wait || global.mess?.wait || '⏳ Sedang diproses, mohon tunggu...');
    const apiKey = global.api?.termaiKey || global.bot?.key?.termai_api || "Bell409";

    const params = new URLSearchParams({
      text: inputText,
      timestamp: "19:00",
      emojiType: "ios",
      statusBarTime: "19:00",
      signal: "4",
      battery: "50",
      carrier,
      key: apiKey
    });

    const apiUrl = global.API ? global.API('termai', '/api/maker/iqc', {
      text: inputText,
      timestamp: "19:00",
      emojiType: "ios",
      statusBarTime: "19:00",
      signal: "4",
      battery: "50",
      carrier,
      key: apiKey
    }) : `https://api.termai.cc/api/maker/iqc?${params}`;

    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`API: ${res.status}`);

    const imageBuffer = await res.arrayBuffer();

    await kyu.sendMessage(ctx.id, {
      image: Buffer.from(imageBuffer),
      mimetype: "image/png",
      caption: "✅ *— kyu 𝗆𝗎𝗅𝗍𝗂 𝖽𝖾𝗏𝗂𝖼𝖾*\nBerhasil dibuat!"
    }, { quoted: simpleQuoted(ctx) });
  } catch (error) {
    ctx.reply(`❌ Gagal membuat gambar: ${error.message}`);
  }
};

handler.help        = ["iqc", "iphonequote"];
handler.tags        = ["maker"];
handler.command     = /^(iqc|iphonequote)$/i;
handler.description = "Membuat iPhone quote image";

export default handler;
