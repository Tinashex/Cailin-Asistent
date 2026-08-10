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
      if (!ctx.args.length) return ctx.reply("❌ Masukkan nama repository.\nContoh: .githubsearch baileys");
      
      try {
        const res = await axios.get(
          `https://api.github.com/search/repositories?q=${encodeURIComponent(ctx.query)}&per_page=5`
        );
        
        const list = res.data.items;
        if (!list?.length) return ctx.reply(`❌ Tidak ditemukan hasil untuk: ${ctx.query}`);
        
        const teks = [
          "┏━━━〔 GITHUB SEARCH 〕━━━┓",
          ...list.map((r, i) => 
            `${i + 1}. ${r.full_name}\n   ⭐ Stars : ${r.stargazers_count}\n   🍴 Forks : ${r.forks_count}\n   📝 Info  : ${r.description || "Tanpa deskripsi"}\n   🔗 Link  : ${r.html_url}`
          ),
          "┗━━━━━━━━━━━━━━━━━━━━┛"
        ].join("\n\n");
        
        await ctx.reply(teks);
      } catch (error) {
        ctx.reply(`❌ Error: ${error.message}`);
      }
    
};

handler.help        = ["githubsearch","ghsearch","github"];
handler.tags        = ["search"];
handler.command     = /^(githubsearch|ghsearch|github)$/i;
handler.description = "Mencari repository di GitHub";

export default handler;
