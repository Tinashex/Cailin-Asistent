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
    if (!ctx.args.length) return ctx.reply('❌ Masukkan link Facebook.');
    m.reply(global.msg?.wait || global.mess?.wait || '⏳ Sedang diproses, mohon tunggu...');
    try {
      const url = ctx.args[0];
      const res = await axios.get(`https://api.termai.cc/api/downloader/facebook?url=${encodeURIComponent(url)}&key=${global.bot.key.termai_api}`);
      if (res.data.status !== true) return ctx.reply(`❌ Gagal: ${res.data.message || 'Tidak ada respons.'}`);
      await kyu.sendMessage(ctx.id, {
        video: { url: res.data.urls.sd },
        caption: res.data.title }, { quoted: simpleQuoted(ctx) });
    } catch (e) { ctx.reply(`❌ Error: ${e.message}`); }
  
};

handler.help        = ["fbdl","fb","facebook","facebookdownloader"];
handler.tags        = ["downloader"];
handler.command     = /^(fbdl|fb|facebook|facebookdownloader)$/i;
handler.description = "Download video dari Facebook";

export default handler;
