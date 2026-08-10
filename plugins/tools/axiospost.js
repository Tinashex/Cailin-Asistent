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
        if (!ctx.args[0]) return ctx.reply("❌ Masukkan URL!");
        if (!ctx.args[1]) return ctx.reply("❌ Masukkan body JSON!");
        
        const url = ctx.args[0];
        const body = JSON.parse(ctx.args.slice(1).join(" "));
        const res = await axios.post(url, body);
        
        await kyu.sendMessage(ctx.id, {
          text: JSON.stringify(res.data, null, 2).slice(0, 4000)
        }, { quoted: simpleQuoted(ctx) });
      } catch (error) {
        ctx.reply(`❌ Error: ${error.message}`);
      }
    
};

handler.help        = ["axiospost","post","fetchpost"];
handler.tags        = ["tools"];
handler.command     = /^(axiospost|post|fetchpost)$/i;
handler.description = "POST request menggunakan axios dengan body JSON";

export default handler;
