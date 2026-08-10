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
        const res = await fetch("https://zenquotes.io/api/random");
        const data = await res.json();
        const q = data[0];
        
        const teks = 
`┏━━━〔 RANDOM QUOTE 〕━━━┓
┃
┃ “${q.q}”
┃
┃ — ${q.a}
┃
┗━━━━━━━━━━━━━━━━━━━━┛`;

        await ctx.reply(teks);
      } catch (error) {
        ctx.reply(`❌ Gagal mengambil quote: ${error.message}`);
      }
    
};

handler.help        = ["quote","quotes","kata","randomquote"];
handler.tags        = ["random"];
handler.command     = /^(quote|quotes|kata|randomquote)$/i;
handler.description = "Mendapatkan quote random";

export default handler;
