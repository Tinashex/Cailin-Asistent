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
import { downloadContentFromMessage } from "@whiskeysockets/baileys";
import { simpleQuoted } from '../../lib/fakeQuoted.js';
import uploadCatbox from "../../lib/catbox.js";

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
  try {
    if (!ctx.isMedia) return ctx.reply("❌ Reply/kirim gambar dengan caption .blur");
    m.reply(global.msg?.wait || global.mess?.wait || '⏳ Sedang diproses, mohon tunggu...');

    let buffer = Buffer.from([]);
    let stream = await downloadContentFromMessage(ctx.media, "image");
    for await (let chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    let imgurl = await uploadCatbox(buffer);
    let res = await axios.get(`https://api.siputzx.my.id/api/canvas/blur?image=${imgurl}`, { 
      responseType: "arraybuffer" 
    });

    await kyu.sendMessage(ctx.id, {
      image: Buffer.from(res.data),
      caption: "✅ *Blur Effect*\nGambar berhasil diproses!"
    }, { quoted: simpleQuoted(ctx) });
  } catch (error) {
    ctx.reply(`❌ Gagal membuat blur: ${error.message}`);
  }
};

handler.help        = ["blur", "makeblur"];
handler.tags        = ["maker"];
handler.command     = /^(blur|makeblur)$/i;
handler.description = "Membuat efek blur pada gambar";

export default handler;
