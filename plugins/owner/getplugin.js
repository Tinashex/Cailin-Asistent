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

import fs from 'fs';
import path from 'path';
import { simpleQuoted } from '../../lib/fakeQuoted.js';

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
    try {
      const name = ctx.args[0]?.toLowerCase();
      if (!name) return ctx.reply('❌ Masukkan nama plugin.');
      const filename = name.endsWith('.js') ? name : `${name}.js`;
      const dir = path.join(process.cwd(), 'plugins');
      const target = path.join(dir, filename);
      if (!fs.existsSync(target)) return ctx.reply(`❌ Plugin *${filename}* tidak ditemukan.`);
      const code = fs.readFileSync(target, 'utf-8');
      if (code.length > 65000) return ctx.reply('❌ Kode terlalu panjang.');
      await kyu.sendMessage(ctx.id, { text: `\`\`\`${code}\`\`\`` }, { quoted: simpleQuoted(ctx) });
    } catch (e) { ctx.reply(`❌ Error: ${e.message}`); }
  
};

handler.help        = ["getplugin","gp","ambilplugin"];
handler.tags        = ["owner"];
handler.command     = /^(getplugin|gp|ambilplugin)$/i;
handler.description = "Mengambil source kode plugin";
handler.owner       = true;

export default handler;
