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
        if (!ctx.args.length) return ctx.reply("❌ Masukkan Mail ID.\nContoh: .fakemailinbox ID_MAIL");
        
        const res = await axios.get("https://api.vreden.my.id/api/v1/tools/fakemail/inbox", {
          params: { id: ctx.query }
        });
        
        const data = res.data;
        if (!data || data.status !== true) return ctx.reply("❌ Gagal mengambil inbox.");
        
        let mails = data.result.mails;
        if (!mails || mails.length === 0) return ctx.reply("📭 Inbox kosong. Belum ada email masuk.");
        
        let text = `┏━━━〔 FAKE MAIL INBOX 〕━━━┓\n\n`;
        mails.forEach((mail, i) => {
          text += 
`📨 *Email #${i + 1}*
From: ${mail.from || "-"}
Subject: ${mail.subject || "-"}
Date: ${mail.date || "-"}

`;
        });
        text += `┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`;
        
        ctx.reply(text);
      } catch (error) {
        ctx.reply(`❌ Error: ${error.message}`);
      }
    
};

handler.help        = ["fakemailinbox","fakemail-inbox","mailinbox"];
handler.tags        = ["tools"];
handler.command     = /^(fakemailinbox|fakemail-inbox|mailinbox)$/i;
handler.description = "Cek inbox fake mail";

export default handler;
