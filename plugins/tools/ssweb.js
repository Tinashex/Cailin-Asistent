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
  try {
    let url = ctx.query?.trim();
    if (!url) return ctx.reply("❌ Masukkan URL.\nContoh: .ssweb https://github.com");

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    m.reply(global.msg?.wait || global.mess?.wait || '⏳ Sedang mengambil screenshot website...');
    const apiKey = global.kyzzKey || global.APIKeys?.['https://api.kyzzz.eu.cc'] || "kyuujir";

    const apiUrl = global.API ? global.API('kyzz', '/api/tools/ssweb', { url }, 'apikey')
      : `https://api.kyzzz.eu.cc/api/tools/ssweb?url=${encodeURIComponent(url)}&apikey=${apiKey}`;

    const res = await axios.get(apiUrl, { responseType: 'arraybuffer' }).catch(() => null);

    if (res && res.data) {
      return await kyu.sendMessage(ctx.id, {
        image: Buffer.from(res.data),
        caption: `🌐 *Screenshot Web (Kyzz API)*\n\n🔗 URL: ${url}`
      }, { quoted: simpleQuoted(ctx) });
    }

    
    const fallback = await axios.get(`https://image.thum.io/get/fullpage/${url}`, { responseType: 'arraybuffer' });
    await kyu.sendMessage(ctx.id, {
      image: Buffer.from(fallback.data),
      caption: `🌐 *Screenshot Web*\n\n🔗 URL: ${url}`
    }, { quoted: simpleQuoted(ctx) });
  } catch (error) {
    ctx.reply(`❌ Gagal screenshot website: ${error.message}`);
  }
};

handler.help        = ["ssweb", "screenshotweb", "webscreenshot"];
handler.tags        = ["tools"];
handler.command     = /^(ssweb|screenshotweb|webscreenshot)$/i;
handler.description = "Screenshot website via Kyzz API";

export default handler;
