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

import FormData from 'form-data';
import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import { simpleQuoted } from '../../lib/fakeQuoted.js';
import uploadCatbox from '../../lib/catbox.js';

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
  try {
    const input = ctx.query;
    if (!input && !ctx.isMedia && !ctx.quoted?.media) return ctx.reply("❌ Contoh: .iqc3 teks kamu | 16:00 (bisa reply/kirim gambar)");

    const parts = (input || "").split("|").map(v => v.trim());
    const inputText = parts[0] || "IQC Hitam";
    const time = parts[1] || "19:00";

    m.reply(global.msg?.wait || global.mess?.wait || '⏳ Sedang diproses, mohon tunggu...');
    const apiKey = global.kyzzKey || global.APIKeys?.['https://api.kyzzz.eu.cc'] || "kyuujir";

    let imgUrl = "";
    let buffer = null;

    if (ctx.isMedia || ctx.quoted?.media) {
      const media = ctx.media || ctx.quoted?.media;
      const stream = await downloadContentFromMessage(media, "image");
      let chunks = [];
      for await (const chunk of stream) chunks.push(chunk);
      buffer = Buffer.concat(chunks);
      imgUrl = await uploadCatbox(buffer).catch(() => "");
    } else {
      imgUrl = await kyu.profilePictureUrl(ctx.sender, "image").catch(() => "https://files.catbox.moe/14nuzw.jpg");
    }

    const form = new FormData();
    if (buffer) {
      form.append("image", buffer, { filename: "image.jpg", contentType: "image/jpeg" });
    }
    form.append("text", inputText);
    form.append("time", time);
    form.append("url", imgUrl);

    const apiUrl = `https://api.kyzzz.eu.cc/api/canvas/iqc-hitam?apikey=${apiKey}`;
    const res = await fetch(apiUrl, {
      method: "POST",
      body: form,
      headers: form.getHeaders ? form.getHeaders() : {}
    });

    if (!res.ok) throw new Error(`API Kyzz: ${res.status}`);

    const imageBuffer = await res.arrayBuffer();

    await kyu.sendMessage(ctx.id, {
      image: Buffer.from(imageBuffer),
      mimetype: "image/png",
      caption: "✅ *— IQC Hitam (Kyzz API)*\nBerhasil dibuat!"
    }, { quoted: simpleQuoted(ctx) });
  } catch (error) {
    ctx.reply(`❌ Gagal membuat IQC3: ${error.message}`);
  }
};

handler.help        = ["iqc3", "iqchitam", "iphonequote3"];
handler.tags        = ["maker"];
handler.command     = /^(iqc3|iqchitam|iphonequote3)$/i;
handler.description = "Membuat iPhone Quote Hitam via Kyzz API";

export default handler;
