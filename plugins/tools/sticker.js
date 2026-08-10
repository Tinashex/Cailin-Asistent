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
        if (!ctx.isMedia) return ctx.reply("❌ Harap reply gambar atau video yang ingin dijadikan stiker");
        
        let buffer = await ctx.download();
        const exif = {
          packname: `STICKER MADE BY ${global.bot?.name || "Bot"}`,
          author: "RullzFuqi",
          categories: ["🤖"]
        };

        const sticker = ctx.mediaType === "video"
          ? await writeExifVid(buffer, exif, false)
          : await writeExifImg(buffer, exif, false);

        await kyu.sendMessage(ctx.id, { sticker }, { quoted: simpleQuoted(ctx) });
      } catch (error) {
        ctx.reply(`❌ Gagal membuat sticker: ${error.message}`);
      }
    
};

handler.help        = ["sticker","s","stikermaker"];
handler.tags        = ["tools"];
handler.command     = /^(sticker|s|stikermaker)$/i;
handler.description = "Ubah gambar/video jadi stiker";

export default handler;
