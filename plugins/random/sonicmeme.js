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
        const n = Math.floor(Math.random() * 33) + 1;
        const url = `https://raw.githubusercontent.com/RullzFuqi/library/main/database/meme/sonic/sonic-${n}.jpg`;
        
        await kyu.sendMessage(
          ctx.id,
          {
            image: { url },
            caption: "┏━━━〔 SONIC MEME 〕━━━┓\n┃         🌀🌀🌀         ┃\n┗━━━━━━━━━━━━━━━━━━━━┛" },
          { quoted: simpleQuoted(ctx) }
        );
      } catch (error) {
        ctx.reply(`❌ Gagal mengambil meme sonic: ${error.message}`);
      }
    
};

handler.help        = ["sonicmeme","sonic","memesonic"];
handler.tags        = ["random"];
handler.command     = /^(sonicmeme|sonic|memesonic)$/i;
handler.description = "Mengirim meme sonic random";

export default handler;
