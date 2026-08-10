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
import * as cheerio from "cheerio";
import yts from "yt-search";
import { Buffer } from "buffer";
import { contactQuoted, simpleQuoted } from '../../lib/fakeQuoted.js';





let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
      if (!ctx.args.length) return ctx.reply("❌ Masukkan judul anime");
      
      try {
        const { data } = await axios.get(
          `https://api.nekolabs.web.id/discovery/otakudesu/search?q=${encodeURIComponent(ctx.query)}`
        );
        
        if (!data.success || !data.result.length) {
          return ctx.reply("❌ Anime tidak ditemukan.");
        }
        
        const a = data.result[0];
        
        await kyu.sendMessage(ctx.id, {
          image: { url: a.cover },
          caption: 
`┏━━━〔 ANIME DETAIL 〕━━━┓
┃ Title   : ${a.title}
┃ Rating  : ${a.rating}
┃ Status  : ${a.status}
┃ Genre   : ${a.genres.join(", ")}
┗━━━━━━━━━━━━━━━━━━━━┛

┏━━━〔 SOURCE 〕━━━┓
┃ ${a.url}
┗━━━━━━━━━━━━━━━━━━━━┛` }, { quoted: simpleQuoted(ctx) });
      } catch (error) {
        ctx.reply(`❌ Error: ${error.message}`);
      }
    
};

handler.help        = ["otakudesu","otakudesu-search","otakudesus"];
handler.tags        = ["search"];
handler.command     = /^(otakudesu|otakudesu-search|otakudesus)$/i;
handler.description = "Mencari anime di Otakudesu";

export default handler;
