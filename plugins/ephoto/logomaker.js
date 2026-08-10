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

import { ephoto } from '../../lib/ephoto.js';
import { simpleQuoted } from '../../lib/fakeQuoted.js';

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
  if (!ctx.query) return ctx.reply("❌ Masukkan teks!\nContoh: *" + prefix + command + "* Kyu Bot");
  m.reply(global.msg?.wait || global.mess?.wait || '⏳ Sedang memproses efek Ephoto360...');
  try {
    const { buffer } = await ephoto('https://en.ephoto360.com/free-bear-logo-maker-online-673.html', ctx.query);
    await kyu.sendMessage(ctx.id, {
      image: buffer,
      caption: "✅ *LOGOMAKER Text*\n📝 " + ctx.query
    }, { quoted: simpleQuoted(ctx) });
  } catch (e) {
    ctx.reply("❌ Gagal memproses efek *logomaker*: " + (e.message || e));
  }
};

handler.help        = ["logomaker"];
handler.tags        = ["ephoto"];
handler.command     = /^(logomaker)$/i;
handler.description = "logomaker text effect";

export default handler;
