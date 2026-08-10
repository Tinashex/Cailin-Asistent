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

import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import { simpleQuoted } from '../../lib/fakeQuoted.js';
import uploadCatbox from '../../lib/catbox.js';

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
  try {
    const input = ctx.query;
    if (!input) return ctx.reply("❌ Masukkan nama dan durasi!\nContoh: *.fakecall Furina|00:08* (sambil reply/kirim foto)");

    const [nama, durasi = "00:05"] = input.split("|").map(v => v.trim());
    if (!nama) return ctx.reply("❌ Nama tidak boleh kosong.");

    m.reply(global.msg?.wait || global.mess?.wait || '⏳ Sedang diproses, mohon tunggu...');
    const media = ctx.media || ctx.quoted?.media;
    let avatarUrl = "";

    if (media) {
      const stream = await downloadContentFromMessage(media, "image");
      let chunks = [];
      for await (const chunk of stream) chunks.push(chunk);
      const buffer = Buffer.concat(chunks);
      avatarUrl = await uploadCatbox(buffer).catch(() => "");
    } else {
      avatarUrl = await kyu.profilePictureUrl(ctx.sender, "image").catch(() => "https://files.catbox.moe/14nuzw.jpg");
    }

    const apiKey = global.kyzzKey || global.APIKeys?.['https://api.kyzzz.eu.cc'] || "kyuujir";
    const apiUrl = global.API ? global.API('kyzz', '/api/canvas/fakecall', {
      nama,
      durasi,
      avatar: avatarUrl
    }, 'apikey') : `https://api.kyzzz.eu.cc/api/canvas/fakecall?nama=${encodeURIComponent(nama)}&durasi=${encodeURIComponent(durasi)}&avatar=${encodeURIComponent(avatarUrl)}&apikey=${apiKey}`;

    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`API Kyzz: ${res.status}`);

    const imageBuffer = await res.arrayBuffer();

    await kyu.sendMessage(ctx.id, {
      image: Buffer.from(imageBuffer),
      mimetype: "image/png",
      caption: `📞 *Fake Call Card*\n\n👤 Nama: ${nama}\n⏱️ Durasi: ${durasi}`
    }, { quoted: simpleQuoted(ctx) });
  } catch (error) {
    ctx.reply(`❌ Gagal membuat Fake Call: ${error.message}`);
  }
};

handler.help        = ["fakecall", "callfake"];
handler.tags        = ["maker"];
handler.command     = /^(fakecall|callfake)$/i;
handler.description = "Membuat kartu panggilan palsu (iOS/WhatsApp) via Kyzz API";

export default handler;
