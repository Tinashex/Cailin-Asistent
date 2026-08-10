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
    let mediaMessage = ctx.quoted?.media;
    if (!mediaMessage) return ctx.reply("❌ Reply gambar dulu!");
    m.reply(global.msg?.wait || global.mess?.wait || '⏳ Sedang diproses, mohon tunggu...');

    let stream = await downloadContentFromMessage(mediaMessage, "image");
    let buffer = Buffer.from([]);
    for await (let chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    let imgurl = await uploadCatbox(buffer);
    let res = await axios.get("https://api.nekolabs.web.id/canvas/gura", {
      params: { imageUrl: imgurl },
      responseType: "arraybuffer"
    });

    await kyu.sendMessage(ctx.id, {
      image: Buffer.from(res.data),
      caption: "✅ *Gura Meme*\nBerhasil dibuat!"
    }, { quoted: simpleQuoted(ctx) });
  } catch (error) {
    ctx.reply(`❌ Gagal membuat Gura Meme: ${error.message}`);
  }
};

handler.help        = ["gura", "memegura"];
handler.tags        = ["maker"];
handler.command     = /^(gura|memegura)$/i;
handler.description = "Membuat meme Gura dari gambar";

export default handler;
