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
  hijaukan: "ubah warna objek/karakter menjadi hijau natural, realistis, detail tinggi",
};

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
      ctx.command = "putihkan";
      ctx.args = ["putihkan"];
      ctx.query = PRESET.putihkan;
      const cmd = exports.default.find(c => c.name === "img2img");
      if (cmd) await cmd.execute(kyu, ctx, msg);
    
};

handler.help        = ["putihkan","makewhite"];
handler.tags        = ["maker"];
handler.command     = /^(putihkan|makewhite)$/i;
handler.description = "Ubah warna objek menjadi putih (preset img2img)";

export default handler;
