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
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { writeExifImg, writeExifVid } from "../../lib/exif.js";
import { simpleQuoted } from '../../lib/fakeQuoted.js';

const execAsync = promisify(exec);

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
      try {
        if (!ctx.isMedia) return ctx.reply("❌ Harap reply sticker yang ingin dijadikan media");
        
        let buffer = await ctx.download();
        const timestamp = Date.now();
        const getPath = (ext) => path.join(process.cwd(), "tmp/", `${timestamp}.${ext}`);
        
        fs.mkdirSync("./tmp/", { recursive: true });
        fs.writeFileSync(getPath("webp"), buffer);
        
        await ctx.reply(global.msg?.wait || global.mess?.wait || '⏳ Sedang diproses, mohon tunggu...');
        
        const isAnimated = ctx.quoted?.stickerMessage?.isAnimated || false;
        
        if (isAnimated) {
          await execAsync(`ffmpeg -i "${getPath("webp")}" -c:v libx264 -pix_fmt yuv420p -movflags +faststart "${getPath("mp4")}"`);
          await kyu.sendMessage(ctx.id, {
            video: fs.readFileSync(getPath("mp4")),
            caption: "✅ Berhasil dikonversi ke video!"
          }, { quoted: simpleQuoted(ctx) });
          fs.unlinkSync(getPath("mp4"));
        } else {
          await execAsync(`ffmpeg -i "${getPath("webp")}" "${getPath("png")}"`);
          await kyu.sendMessage(ctx.id, {
            image: fs.readFileSync(getPath("png")),
            caption: "✅ Berhasil dikonversi ke gambar!"
          }, { quoted: simpleQuoted(ctx) });
          fs.unlinkSync(getPath("png"));
        }
        
        fs.unlinkSync(getPath("webp"));
      } catch (error) {
        ctx.reply(`❌ Gagal mengkonversi sticker: ${error.message}`);
      }
    
};

handler.help        = ["toimg","sticker2media","stikertoimg"];
handler.tags        = ["tools"];
handler.command     = /^(toimg|sticker2media|stikertoimg)$/i;
handler.description = "Ubah sticker jadi media (gambar/video)";

export default handler;
