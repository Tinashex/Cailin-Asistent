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

import { simpleQuoted } from '../../lib/fakeQuoted.js';
import { makeJid } from '../../core/tools.js';
import db from '../../data/db.js';

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
    try {
      const raw = ctx.args[0]?.replace(/\D/g, '') || '';
      const jid = raw ? makeJid(raw) : ctx.quoted?.sender;
      if (!jid) return ctx.reply('❌ Sertakan nomor atau reply pesan target.');

      const noJid = jid.split('@')[0];

      
      if (noJid === global.bot?.author?.number) {
        return ctx.reply('❌ Tidak bisa menghapus owner utama!');
      }

      if (global.db.user[jid]) global.db.user[jid].ownerAcces = false;

      
      if (global.bot.owner) {
        global.bot.owner = global.bot.owner.filter(v => v !== noJid && v !== jid);
      }

      db.write(global.db);

      await kyu.sendMessage(ctx.id, {
        text: `✅ *${noJid}* berhasil dihapus dari daftar owner` }, { quoted: simpleQuoted(ctx) });
    } catch (e) {
      ctx.reply(`❌ Error: ${e.message}`);
    }
  
};

handler.help        = ["delowner","hapusowner"];
handler.tags        = ["owner"];
handler.command     = /^(delowner|hapusowner)$/i;
handler.description = "Menghapus nomor dari daftar owner";
handler.owner       = true;

export default handler;
