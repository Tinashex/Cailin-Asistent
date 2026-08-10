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
    if (!ctx.query) return ctx.reply("❌ Masukkan teks komentar!");
    m.reply(global.msg?.wait || global.mess?.wait || '⏳ Sedang diproses, mohon tunggu...');

    let imgUser = await kyu.profilePictureUrl(ctx.sender, "image").catch(
      () => "https://h.uguu.se/uwVJCwKw.jpg"
    );

    const res = await axios.get(`https://some-random-api.com/canvas/misc/youtube-comment`, {
      params: {
        avatar: imgUser,
        username: ctx.pushname || "User",
        comment: ctx.query
      },
      responseType: "arraybuffer"
    });

    await kyu.sendMessage(ctx.id, {
      image: Buffer.from(res.data),
      caption: "✅ *YouTube Comment*\nBerhasil dibuat!"
    }, { quoted: simpleQuoted(ctx) });
  } catch (error) {
    ctx.reply(`❌ Gagal membuat fake comment: ${error.message}`);
  }
};

handler.help        = ["fakeytcomment", "fakeyt", "ytcomment"];
handler.tags        = ["maker"];
handler.command     = /^(fakeytcomment|fakeyt|ytcomment)$/i;
handler.description = "Membuat fake YouTube comment";

export default handler;
