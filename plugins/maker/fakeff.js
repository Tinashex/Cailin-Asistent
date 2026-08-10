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
    if (!input) return ctx.reply("❌ Masukkan username Free Fire!\nContoh: *.fakeff kyyy* atau *.fakeff kyyy|3*");

    const parts = input.split("|").map(v => v.trim());
    const username = parts[0];
    const lobby = parts[1] || "1";

    m.reply(global.msg?.wait || global.mess?.wait || '⏳ Sedang diproses, mohon tunggu...');
    const apiKey = global.kyzzKey || global.APIKeys?.['https://api.kyzzz.eu.cc'] || "kyuujir";

    const apiUrl = global.API ? global.API('kyzz', '/api/canvas/fake-ff', {
      username,
      lobby,
      apikey: apiKey
    }) : `https://api.kyzzz.eu.cc/api/canvas/fake-ff?username=${encodeURIComponent(username)}&lobby=${encodeURIComponent(lobby)}&apikey=${apiKey}`;

    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`API Kyzz: ${res.status}`);

    const imageBuffer = await res.arrayBuffer();

    await kyu.sendMessage(ctx.id, {
      image: Buffer.from(imageBuffer),
      mimetype: "image/png",
      caption: `✅ *Fake Free Fire Lobby*\n\n🎮 Username: ${username}\n🏛️ Lobby: ${lobby}`
    }, { quoted: simpleQuoted(ctx) });
  } catch (error) {
    ctx.reply(`❌ Gagal membuat Fake FF Lobby: ${error.message}`);
  }
};

handler.help        = ["fakeff", "fffake", "fflobby"];
handler.tags        = ["maker"];
handler.command     = /^(fakeff|fffake|fflobby)$/i;
handler.description = "Membuat Fake Free Fire Lobby (Lobby 1-30)";

export default handler;
