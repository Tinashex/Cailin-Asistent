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
      if (!ctx.args.length) return ctx.reply("❌ Masukkan kata kunci.\nContoh: .yts ultraman");
      
      try {
        const data = await yts(ctx.query);
        if (!data.all || data.all.length === 0) {
          return ctx.reply(`❌ Hasil tidak ditemukan untuk "${ctx.query}"`);
        }
        
        const res = data.all[0];
        
        if (res.type === "video") {
          const caption = 
`┏━━━〔 YOUTUBE SEARCH 〕━━━┓
┃ 🎬 Judul: ${res.title}
┃ 👤 Channel: ${res.author?.name || "-"}
┃ ⏱ Durasi: ${res.timestamp || "-"}
┃ 👁 Penonton: ${res.views?.toLocaleString() || "-"}
┗━━━━━━━━━━━━━━━━━━━━┛
🔗 Link: ${res.url}`;
          
          const sections = data.all
            .filter(v => v.type === "video")
            .slice(0, 10)
            .map((v, i) => ({
              title: `#${i + 1} ${v.title}`,
              highlight_label: v.timestamp || "-",
              rows: [
                {
                  header: "YTDL",
                  title: "🎥 Download Video",
                  id: `.ytmp4 ${v.url}`,
                  description: "Kirim sebagai mp4"
                },
                {
                  header: "YTDL",
                  title: "📁 Download Audio",
                  id: `.ytmp3 ${v.url}`,
                  description: "Kirim sebagai file mp3"
                },
                {
                  header: "YTDL",
                  title: "🎙️ Voice Note",
                  id: `.ytmp3 voice ${v.url}`,
                  description: "Kirim sebagai voice note"
                }
              ]
            }));
          
          await kyu.sendMessage(ctx.id, {
            image: { url: res.thumbnail },
            caption,
            buttons: [
              {
                buttonId: "active",
                buttonText: { displayText: "🧾 List Download" },
                type: 4,
                nativeFlowInfo: {
                  name: "single_select",
                  paramsJson: JSON.stringify({
                    title: "🧾 Pilih Video untuk Download",
                    sections
                  })
                }
              }
            ],
            headerType: 4 }, { quoted: simpleQuoted(ctx) });
        } else if (res.type === "live") {
          await ctx.reply(
`┏━━━〔 YOUTUBE LIVE 〕━━━┓
┃ 🔴 Judul: ${res.title}
┃ 👤 Channel: ${res.author?.name || "-"}
┃ 👁 Menonton: ${res.views?.toLocaleString() || "-"}
┗━━━━━━━━━━━━━━━━━━━━┛
🔗 Link: ${res.url}`
          );
        } else if (res.type === "channel") {
          await ctx.reply(
`┏━━━〔 YOUTUBE CHANNEL 〕━━━┓
┃ 📺 Nama: ${res.name}
┃ 👥 Subscriber: ${res.subCount || "-"}
┃ 🎥 Total video: ${res.videoCount || "-"}
┗━━━━━━━━━━━━━━━━━━━━┛
🔗 Link: ${res.url}`
          );
        } else if (res.type === "playlist") {
          await ctx.reply(
`┏━━━〔 YOUTUBE PLAYLIST 〕━━━┓
┃ 📂 Judul: ${res.title}
┃ 🎥 Jumlah video: ${res.videoCount || "-"}
┃ 👤 Channel: ${res.author?.name || "-"}
┗━━━━━━━━━━━━━━━━━━━━┛
🔗 Link: ${res.url}`
          );
        } else {
          await ctx.reply(
`┏━━━〔 YOUTUBE ${res.type.toUpperCase()} 〕━━━┓
┃ 📌 Judul: ${res.title || res.name || "-"}
┃ 👤 Pemilik: ${res.author?.name || "-"}
┗━━━━━━━━━━━━━━━━━━━━┛
🔗 Link: ${res.url}`
          );
        }
      } catch (error) {
        ctx.reply(`❌ Error: ${error.message}`);
      }
    
};

handler.help        = ["ytsearch","yts","play","ytsearch"];
handler.tags        = ["search"];
handler.command     = /^(ytsearch|yts|play|ytsearch)$/i;
handler.description = "Mencari konten di YouTube";

export default handler;
