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
        const res = await fetch("https://api.some-random-api.com/animu/quote");
        const data = await res.json();
        
        const teks = 
`┏━━━〔 ANIME QUOTE 〕━━━┓
┃
┃ “${data.quote}”
┃
┃ — ${data.character || data.name}
┃ Anime: ${data.anime}
┃
┗━━━━━━━━━━━━━━━━━━━━┛`;

        await ctx.reply(teks);
      } catch (error) {
        ctx.reply(`❌ Gagal mengambil quote anime: ${error.message}`);
      }
    
};

handler.help        = ["animequote","animequoted","nimequote","nimequoted","quoteanime"];
handler.tags        = ["random"];
handler.command     = /^(animequote|animequoted|nimequote|nimequoted|quoteanime)$/i;
handler.description = "Mendapatkan quote random dari anime";

export default handler;
