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

import { simpleQuoted } from './fakeQuoted.js';

export default async function sendCecan(kyu, ctx, category) {
  try {
    const apiKey = global.kyzzKey || global.APIKeys?.['https://api.kyzzz.eu.cc'] || 'kyuujir';
    const imgUrl = global.API
      ? global.API('kyzz', `/api/cecan/${category}`, {}, 'apikey')
      : `https://api.kyzzz.eu.cc/api/cecan/${category}?apikey=${apiKey}`;

    await kyu.sendMessage(ctx.id, {
      image: { url: imgUrl },
      caption: `🎴 *Cewe Random — ${category}*`
    }, { quoted: simpleQuoted(ctx) });
  } catch (e) {
    ctx.reply(`❌ Gagal mengambil gambar ${category}: ${e.message}`);
  }
}
