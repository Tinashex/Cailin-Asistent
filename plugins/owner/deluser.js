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

import { makeJid } from '../../core/tools.js';
import db from '../../data/db.js';

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
    try {
      if (!ctx.args.length) return ctx.reply(`⚡ Format: ${ctx.prefix}deluser [nomor]`);
      const jid = makeJid(ctx.args[0]);
      if (!global.db.user[jid]) return ctx.reply(`❌ User tidak ditemukan.`);
      delete global.db.user[jid];
      db.write(global.db);
      ctx.reply(`🗑️ *User Dihapus*\n👤 ${jid.split('@')[0]}`);
    } catch (e) { ctx.reply(`❌ Error: ${e.message}`); }
  
};

handler.help        = ["deluser","deleteuser","hapususer"];
handler.tags        = ["owner"];
handler.command     = /^(deluser|deleteuser|hapususer)$/i;
handler.description = "Hapus user dari database";
handler.owner       = true;

export default handler;
