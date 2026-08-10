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
import { simpleQuoted } from '../../lib/fakeQuoted.js';

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
  if (!ctx.query) return ctx.reply('❌ Masukkan prompt gambar AI.\nContoh: *.text2img anime girl with cat ears in cherry blossom garden*');

  m.reply(global.msg?.wait || global.mess?.wait || '⏳ Sedang diproses, mohon tunggu...');
  try {
    const apiUrl = global.API ? global.API('kyzz', '/api/ai/text2img', {
      prompt: ctx.query
    }, 'apikey') : `https://api.kyzzz.eu.cc/api/ai/text2img?prompt=${encodeURIComponent(ctx.query)}&apikey=${global.kyzzKey || 'kyuujir'}`;

    const res = await axios.get(apiUrl, { responseType: 'arraybuffer' });

    await kyu.sendMessage(ctx.id, {
      image: Buffer.from(res.data),
      caption: `🎨 *Text 2 Image AI*\n\nPrompt: ${ctx.query}`
    }, { quoted: simpleQuoted(ctx) });
  } catch (e) {
    ctx.reply(`❌ Gagal membuat gambar Text2Img: ${e.message}`);
  }
};

handler.help        = ["text2img", "t2i", "aiimg"];
handler.tags        = ["maker"];
handler.command     = /^(text2img|t2i|aiimg)$/i;
handler.description = "Generate gambar dari prompt teks via Kyzz API";

export default handler;
