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
        if (!ctx.args.length) return ctx.reply("❌ Masukkan nama negara.\nContoh: .countryinfo Indonesia");
        
        const res = await axios.get("https://api.siputzx.my.id/api/tools/countryInfo", {
          params: { name: ctx.query }
        });
        
        const data = res.data;
        if (!data || data.status !== true) return ctx.reply("❌ Negara tidak ditemukan.");
        
        let c = data.data;
        let neighbors = c.neighbors?.map(v => `• ${v.name}`).join("\n") || "-";
        
        await kyu.sendMessage(ctx.id, {
          image: { url: c.flag },
          caption: 
`┏━━━〔 COUNTRY INFO 〕━━━┓
┃ 🏳️ Nama: ${c.name}
┃ 🏛️ Ibu Kota: ${c.capital}
┃ 🌏 Benua: ${c.continent.name} ${c.continent.emoji}
┃ 📞 Kode Telepon: ${c.phoneCode}
┃ 💱 Mata Uang: ${c.currency}
┃ 🚗 Jalur Mengemudi: ${c.drivingSide}
┃ 🗣️ Bahasa: ${c.languages.native.join(", ")}
┃ 📐 Luas: ${c.area.squareKilometers.toLocaleString()} km²
┃ 🌐 Domain: ${c.internetTLD}
┃ 🏛️ Bentuk Negara: ${c.constitutionalForm}
┃ ⭐ Terkenal: ${c.famousFor}
┃
┃ 🧭 Tetangga:
${neighbors}
┃
┃ 🗺️ ${c.googleMapsLink}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛` }, { quoted: simpleQuoted(ctx) });
      } catch (error) {
        ctx.reply(`❌ Error: ${error.message}`);
      }
    
};

handler.help        = ["countryinfo","country","negara"];
handler.tags        = ["tools"];
handler.command     = /^(countryinfo|country|negara)$/i;
handler.description = "Menampilkan informasi negara";

export default handler;
