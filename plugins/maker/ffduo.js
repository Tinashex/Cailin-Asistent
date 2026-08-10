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
    if (!input) return ctx.reply("❌ Masukkan nama pengguna duo!\nContoh: *.ffduo kyuu|naa* atau *.ffduo kyuu|naa|5*");

    const parts = input.split("|").map(v => v.trim());
    const user1 = parts[0];
    const user2 = parts[1] || "partner";
    const template = parts[2] || "random";

    if (!user1) return ctx.reply("❌ Masukkan minimal nama user1!\nContoh: *.ffduo kyuu|naa*");

    m.reply(global.msg?.wait || global.mess?.wait || '⏳ Sedang diproses, mohon tunggu...');
    const apiKey = global.kyzzKey || global.APIKeys?.['https://api.kyzzz.eu.cc'] || "kyuujir";

    const apiUrl = global.API ? global.API('kyzz', '/api/canvas/ffduo', {
      user1,
      user2,
      template,
      apikey: apiKey
    }) : `https://api.kyzzz.eu.cc/api/canvas/ffduo?user1=${encodeURIComponent(user1)}&user2=${encodeURIComponent(user2)}&template=${encodeURIComponent(template)}&apikey=${apiKey}`;

    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`API Kyzz: ${res.status}`);

    const imageBuffer = await res.arrayBuffer();

    await kyu.sendMessage(ctx.id, {
      image: Buffer.from(imageBuffer),
      mimetype: "image/png",
      caption: `✅ *Free Fire Duo*\n\n👤 User 1: ${user1}\n👤 User 2: ${user2}\n🎨 Template: ${template}`
    }, { quoted: simpleQuoted(ctx) });
  } catch (error) {
    ctx.reply(`❌ Gagal membuat FF Duo: ${error.message}`);
  }
};

handler.help        = ["ffduo", "ffduomaker"];
handler.tags        = ["maker"];
handler.command     = /^(ffduo|ffduomaker)$/i;
handler.description = "Membuat avatar Free Fire Duo (Template 1-11 / Random)";

export default handler;
