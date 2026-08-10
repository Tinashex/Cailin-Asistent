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
      if (!ctx.args.length) return ctx.reply("❌ Masukkan judul manga");
      
      try {
        if (ctx.args[0].toLowerCase() === "detail") {
          const q = ctx.args.slice(1).join(" ").trim();
          const url = q.startsWith("http") ? q : "https://komiku.org/manga/" + q.replace(/\s+/g, "-").toLowerCase() + "/";
          
          const res = await axios.get(url);
          const $ = cheerio.load(res.data);
          
          const title = $("#Judul h1 span").text().trim();
          const indo = $("#Judul .j2").text().trim();
          const desk = $(".desc").text().trim().slice(0, 600);
          const img = $(".ims img").attr("src");
          
          const info = {};
          $(".inftable tr").each((i, e) => {
            const k = $(e).find("td").eq(0).text().trim();
            const v = $(e).find("td").eq(1).text().trim();
            if (k) info[k] = v;
          });
          
          const genre = $(".genre span").map((i, e) => $(e).text()).get().join(", ");
          
          const teks = 
`┏━━━〔 DETAIL MANGA 〕━━━┓
┃ Judul : ${title}
┃ Indo  : ${indo}
┃ Jenis : ${info["Jenis Komik"] || "-"}
┃ Konsep: ${info["Konsep Cerita"] || "-"}
┃ Author: ${info["Pengarang"] || "-"}
┃ Status: ${info["Status"] || "-"}
┃ Umur  : ${info["Umur Pembaca"] || "-"}
┃ Genre : ${genre}
┗━━━━━━━━━━━━━━━━━━━━┛

Sinopsis:
${desk}...

🔗 Link → ${url}`;
          
          await kyu.sendMessage(ctx.id, {
            image: { url: img },
            caption: teks }, { quoted: simpleQuoted(ctx) });
        } else {
          const res = await axios.get("https://api.komiku.id/", {
            params: { post_type: "manga", s: ctx.query }
          });
          
          const $ = cheerio.load(res.data);
          const el = $(".bge").first();
          if (!el.length) return ctx.reply("❌ Manga tidak ditemukan");
          
          const title = el.find("h3").text().trim();
          const link = "https://komiku.org" + el.find("a").attr("href");
          const img = el.find("img").attr("src");
          const type = el.find(".tpe1_inf").text().trim();
          const update = el.find(".kan p").text().trim();
          const awal = el.find(".new1").eq(0).text().replace(/\s+/g, " ").trim();
          const latest = el.find(".new1").eq(1).text().replace(/\s+/g, " ").trim();
          
          const teks = 
`┏━━━〔 KOMIKU SEARCH 〕━━━┓
┃ Judul   : ${title}
┃ Tipe    : ${type}
┃ Update  : ${update}
┃ Awal    : ${awal}
┃ Terbaru : ${latest}
┗━━━━━━━━━━━━━━━━━━━━┛
🔍 Detail → .komikusearch detail ${link}`;
          
          await kyu.sendMessage(ctx.id, {
            image: { url: img },
            caption: teks }, { quoted: simpleQuoted(ctx) });
        }
      } catch (error) {
        ctx.reply(`❌ Gagal mengambil data: ${error.message}`);
      }
    
};

handler.help        = ["komikusearch","komiku","mangasearch"];
handler.tags        = ["search"];
handler.command     = /^(komikusearch|komiku|mangasearch)$/i;
handler.description = "Mencari manga di Komiku";

export default handler;
