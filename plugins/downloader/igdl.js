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
    if (!ctx.args.length) return ctx.reply('❌ Masukkan link Instagram.');
    m.reply(global.msg?.wait || global.mess?.wait || '⏳ Sedang diproses, mohon tunggu...');
    try {
      const res = await axios.get(`https://api.termai.cc/api/downloader/instagram?url=${encodeURIComponent(ctx.args[0])}&key=${global.bot.key.termai_api}`);
      const igdl = res.data;
      if (igdl.data.content.type === 'video') {
        await kyu.sendMessage(ctx.id, {
          video: { url: igdl.data.content.url }, caption: igdl.data.title }, { quoted: simpleQuoted(ctx) });
      } else {
        await kyu.sendMessage(ctx.id, {
          image: { url: igdl.data.content.url }, caption: igdl.data.title }, { quoted: simpleQuoted(ctx) });
      }
    } catch (e) { ctx.reply(`❌ Error: ${e.message}`); }
  
};

handler.help        = ["igdl","ig","instagram","instagramdownloader"];
handler.tags        = ["downloader"];
handler.command     = /^(igdl|ig|instagram|instagramdownloader)$/i;
handler.description = "Download media dari Instagram";

export default handler;
