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
import fs from "fs";
import path from "path";
import { simpleQuoted } from '../../lib/fakeQuoted.js';
import { writeExifImg } from "../../lib/exif.js";

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
  try {
    let teks = ctx.query;
    if (!teks) return ctx.reply("❌ Masukkan teks brat.");
    m.reply(global.msg?.wait || global.mess?.wait || '⏳ Sedang diproses, mohon tunggu...');

    let filename = `brat-${teks.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 50)}.webp`;
    let filepath = path.join(process.cwd(), "tmp/", filename);

    if (fs.existsSync(filepath)) {
      return await kyu.sendMessage(ctx.id, {
        sticker: fs.readFileSync(filepath)
      }, { quoted: simpleQuoted(ctx) });
    }

    const res = await axios.get(
      "https://aqul-brat.hf.space/api/brat?text=" + encodeURIComponent(teks),
      { responseType: "arraybuffer" }
    );

    const stickerBuffer = await writeExifImg(
      res.data,
      { packname: global.botname || "Kyu Bot", author: global.author || "Ky Dev" },
      false
    );

    fs.mkdirSync(path.dirname(filepath), { recursive: true });
    fs.writeFileSync(filepath, stickerBuffer);

    await kyu.sendMessage(ctx.id, {
      sticker: stickerBuffer
    }, { quoted: simpleQuoted(ctx) });
  } catch (error) {
    ctx.reply(`❌ Gagal membuat sticker brat: ${error.message}`);
  }
};

handler.help        = ["brat", "makebrat"];
handler.tags        = ["maker"];
handler.command     = /^(brat|makebrat)$/i;
handler.description = "Membuat sticker brat dari teks";

export default handler;
