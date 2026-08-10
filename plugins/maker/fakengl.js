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

import axios from "axios";
import { simpleQuoted } from '../../lib/fakeQuoted.js';

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
  try {
    if (!ctx.query) return ctx.reply("❌ Masukkan teks.");
    m.reply(global.msg?.wait || global.mess?.wait || '⏳ Sedang diproses, mohon tunggu...');

    const parts = ctx.query.split("|").map(v => v.trim());
    const inputText = parts[0];
    const bgColor = parts[1] || "dark";

    const apiKey = global.api?.termaiKey || global.bot?.key?.termai_api || "Bell409";
    const res = await axios.get(
      `https://api.termai.cc/api/maker/ngl`,
      {
        params: {
          text: inputText,
          backgroundColor: bgColor,
          key: apiKey
        },
        responseType: "arraybuffer"
      }
    );

    await kyu.sendMessage(ctx.id, {
      image: Buffer.from(res.data),
      caption: "✅ *Fake NGL*\nBerhasil dibuat!"
    }, { quoted: simpleQuoted(ctx) });
  } catch (error) {
    ctx.reply(`❌ Gagal membuat Fake NGL: ${error.message}`);
  }
};

handler.help        = ["fakengl", "fakeng", "nglmaker"];
handler.tags        = ["maker"];
handler.command     = /^(fakengl|fakeng|nglmaker)$/i;
handler.description = "Membuat fake NGL message";

export default handler;
