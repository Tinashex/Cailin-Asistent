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

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
    try {
      const name = ctx.args[0];
      if (!name) return ctx.reply('❌ Nama plugin tidak ditemukan.');
      const filename = name.endsWith('.js') ? name : `${name.toLowerCase()}.js`;
      const target = path.join(process.cwd(), 'plugins', filename);
      if (!fs.existsSync(target)) return ctx.reply(`❌ Plugin *${filename}* tidak ditemukan.`);
      fs.unlinkSync(target);
      ctx.reply(`🗑️ Plugin *${filename}* berhasil dihapus.`);
    } catch (e) { ctx.reply(`❌ Error: ${e.message}`); }
  
};

handler.help        = ["delplugin","delcommand","hapusplugin"];
handler.tags        = ["owner"];
handler.command     = /^(delplugin|delcommand|hapusplugin)$/i;
handler.description = "Menghapus plugin";
handler.owner       = true;

export default handler;
