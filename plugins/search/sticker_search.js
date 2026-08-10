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
      if (!ctx.args.length) return ctx.reply("❌ Masukkan keyword sticker");
      
      try {
        const res = await axios.post("https://api.siputzx.my.id/api/sticker/combot-search", {
          q: ctx.query,
          page: 1
        }, {
          headers: { "Content-Type": "application/json" }
        });
        
        const data = res.data.data.results;
        if (!data || !data.length) return ctx.reply("❌ Sticker tidak ditemukan");
        
        const pack = data[Math.floor(Math.random() * data.length)];
        const list = pack.sticker_urls.sort(() => 0.5 - Math.random()).slice(0, 5);
        const album = list.map((u, i) => ({
          image: { url: u },
          caption: `[ ${pack.title} ]\nSticker ${i + 1}`
        }));
        
        await kyu.sendMessage(
          ctx.id,
          { album },
          { quoted: simpleQuoted(ctx) }
        );
      } catch (error) {
        ctx.reply(`❌ Gagal mengambil sticker: ${error.message}`);
      }
    
};

handler.help        = ["sticker-search","stickersearch","ssearch","combotstickers"];
handler.tags        = ["search"];
handler.command     = /^(sticker-search|stickersearch|ssearch|combotstickers)$/i;
handler.description = "Mencari sticker dari combot";

export default handler;
