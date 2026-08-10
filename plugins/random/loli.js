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
        const res = await axios.get("https://api.nekolabs.web.id/random/loli", {
          responseType: "arraybuffer"
        });
        
        await kyu.sendMessage(
          ctx.id,
          {
            image: Buffer.from(res.data),
            caption: "┏━━━〔 RANDOM LOLI 〕━━━┓\n┃            🎀            ┃\n┗━━━━━━━━━━━━━━━━━━━━┛" },
          { quoted: simpleQuoted(ctx) }
        );
      } catch (error) {
        ctx.reply(`❌ Gagal mengambil gambar loli: ${error.message}`);
      }
    
};

handler.help        = ["loli","randomloli"];
handler.tags        = ["random"];
handler.command     = /^(loli|randomloli)$/i;
handler.description = "Mengirim gambar loli random";

export default handler;
