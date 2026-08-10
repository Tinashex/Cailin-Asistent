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
import fs from "fs";
import path from "path";
import { downloadContentFromMessage } from "@whiskeysockets/baileys";
import { simpleQuoted } from '../../lib/fakeQuoted.js';
import { writeExifImg } from "../../lib/exif.js";
import uploadCatbox from "../../lib/catbox.js";

const PRESET = {
  putihkan: "ubah warna objek/karakter menjadi putih bersih, realistis, detail tinggi",
  hitamkan: "ubah warna objek/karakter menjadi hitam pekat, realistis, detail tinggi",
  hijaukan: "ubah warna objek/karakter menjadi hijau natural, realistis, detail tinggi" };

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
      try {
        if (!ctx.isMedia) return ctx.reply("❌ Reply *gambar* yang ingin diedit.");
        if (ctx.mediaType !== "image") return ctx.reply("❌ Media harus berupa *gambar*.");
        
        const stream = await downloadContentFromMessage(ctx.media, "image");
        let buffer = Buffer.alloc(0);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
        
        let prompt = ctx.query;
        if (!prompt) {
          return ctx.reply(
            `❌ Gunakan salah satu cara berikut:
• *.putihkan*
• *.hitamkan*
• *.hijaukan*

Atau prompt bebas:
• *.img2img ubah warna menjadi merah metalik*`
          );
        }
        
        m.reply(global.msg?.wait || global.mess?.wait || '⏳ Sedang diproses, mohon tunggu...');
        let res = await axios.post(
          "https://api.termai.cc/api/img2img/edit?key=Bell409",
          { image: buffer, prompt },
          {
            headers: { "Content-Type": "application/json" },
            responseType: "arraybuffer",
            timeout: 60000 }
        );
        
        await kyu.sendMessage(ctx.id, {
          image: Buffer.from(res.data),
          caption: `✅ *Img2Img Berhasil*\n\nPrompt: ${prompt}` }, { quoted: simpleQuoted(ctx) });
      } catch (error) {
        if (error.response) {
          ctx.reply(`❌ API Error ${error.response.status}`);
        } else {
          ctx.reply(`❌ Gagal memproses gambar: ${error.message}`);
        }
      }
    
};

handler.help        = ["img2img","editgambar","aiimage"];
handler.tags        = ["maker"];
handler.command     = /^(img2img|editgambar|aiimage)$/i;
handler.description = "Edit gambar dengan AI (preset atau prompt bebas)";

export default handler;
