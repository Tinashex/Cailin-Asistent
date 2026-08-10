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
      if (!ctx.args.length) return ctx.reply("❌ Masukkan query pencarian!\nContoh: .nekopoisearch Shoujo Ramune");
      
      try {
        const { data } = await axios.get(
          `https://api.nekolabs.web.id/discovery/nekopoi/v1/search?q=${encodeURIComponent(ctx.query)}`
        );
        
        if (!data.result || !data.result.length) return ctx.reply("❌ Hasil tidak ditemukan!");
        
        const first = data.result[0];
        
        await kyu.sendMessage(ctx.id, {
          image: { url: first.cover },
          caption: 
`┏━━━〔 NEKOPOI SEARCH 〕━━━┓
┃ Title: ${first.title}
┃ Type: ${first.type}
┗━━━━━━━━━━━━━━━━━━━━┛
🔗 URL: ${first.url}` }, { quoted: simpleQuoted(ctx) });
      } catch (error) {
        ctx.reply(`❌ Error: ${error.message}`);
      }
    
};

handler.help        = ["nekopoisearch","nekopoi-search","nekopoi"];
handler.tags        = ["search"];
handler.command     = /^(nekopoisearch|nekopoi-search|nekopoi)$/i;
handler.description = "Mencari konten di Nekopoi";

export default handler;
