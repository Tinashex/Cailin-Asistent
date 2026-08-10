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

import axios from 'axios';
import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import { simpleQuoted } from '../../lib/fakeQuoted.js';
import uploadCatbox from '../../lib/catbox.js';

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
  try {
    if (!ctx.isMedia && !ctx.quoted?.media) return ctx.reply("❌ Reply/kirim gambar dengan caption .remini");
    m.reply(global.msg?.wait || global.mess?.wait || '⏳ Sedang meningkatkan kualitas gambar (HD)...');

    const media = ctx.media || ctx.quoted?.media;
    let stream = await downloadContentFromMessage(media, "image");
    let buffer = Buffer.from([]);
    for await (let chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    let imgurl = await uploadCatbox(buffer);
    const apiKey = global.kyzzKey || global.APIKeys?.['https://api.kyzzz.eu.cc'] || "kyuujir";

    const apiUrl = global.API ? global.API('kyzz', '/api/tools/remini', { url: imgurl }, 'apikey')
      : `https://api.kyzzz.eu.cc/api/tools/remini?url=${encodeURIComponent(imgurl)}&apikey=${apiKey}`;

    const res = await axios.get(apiUrl, { responseType: 'arraybuffer' }).catch(() => null);

    if (res && res.data) {
      return await kyu.sendMessage(ctx.id, {
        image: Buffer.from(res.data),
        caption: "✨ *Remini HD Enhanced (Kyzz API)*\nKualitas gambar berhasil ditingkatkan!"
      }, { quoted: simpleQuoted(ctx) });
    }

    
    let termaiRes = await axios.get("https://api.termai.cc/api/tools/remini", {
      params: { url: imgurl, key: global.termaiKey || "Bell409" }
    });
    if (!termaiRes.data?.status) throw new Error("Gagal enhance gambar");

    await kyu.sendMessage(ctx.id, {
      image: { url: termaiRes.data.data.url },
      caption: "✨ *Remini HD Enhanced*\nKualitas gambar berhasil ditingkatkan!"
    }, { quoted: simpleQuoted(ctx) });
  } catch (error) {
    ctx.reply(`❌ Gagal meningkatkan kualitas gambar: ${error.message}`);
  }
};

handler.help        = ["remini", "hd", "enhance"];
handler.tags        = ["maker"];
handler.command     = /^(remini|hd|enhance)$/i;
handler.description = "Meningkatkan kualitas gambar menjadi HD via Kyzz API";

export default handler;
