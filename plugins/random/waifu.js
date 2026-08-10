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

import axios from "axios";
import { simpleQuoted } from '../../lib/fakeQuoted.js';

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
      try {
        const res = await axios.get(
          "https://raw.githubusercontent.com/RullzFuqi/library/main/database/random/waifu.json"
        );
        
        const waifuList = res.data;
        const randomWaifu = waifuList[Math.floor(Math.random() * waifuList.length)];
        
        await kyu.sendMessage(
          ctx.id,
          {
            image: { url: randomWaifu.image },
            caption: `┏━━━〔 RANDOM WAIFU 〕━━━┓\n┃ Name: ${randomWaifu.name || "Unknown"}\n┃ From: ${randomWaifu.from || "Unknown"}\n┗━━━━━━━━━━━━━━━━━━━━┛` },
          { quoted: simpleQuoted(ctx) }
        );
      } catch (error) {
        ctx.reply(`❌ Gagal mengambil waifu: ${error.message}`);
      }
    
};

handler.help        = ["waifu","randomwaifu","waifurandom"];
handler.tags        = ["random"];
handler.command     = /^(waifu|randomwaifu|waifurandom)$/i;
handler.description = "Mengirim gambar waifu random";

export default handler;
