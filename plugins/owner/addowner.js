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
import { makeJid, ensureUser } from '../../core/tools.js';
import db from '../../data/db.js';

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
    try {
      const raw = ctx.args[0]?.replace(/\D/g, '') || '';
      const jid = raw ? makeJid(raw) : ctx.quoted?.sender;
      if (!jid) return ctx.reply('❌ Sertakan nomor atau reply pesan target.');

      ensureUser(jid, jid.split('@')[0]);
      global.db.user[jid].ownerAcces = true;

      
      if (!global.bot.owner) global.bot.owner = [];
      const noJid = jid.split('@')[0];
      if (!global.bot.owner.includes(noJid)) global.bot.owner.push(noJid);

      db.write(global.db);

      await kyu.sendMessage(ctx.id, {
        text: `✅ *${noJid}* berhasil ditambahkan sebagai owner` }, { quoted: simpleQuoted(ctx) });
    } catch (e) {
      ctx.reply(`❌ Error: ${e.message}`);
    }
  
};

handler.help        = ["addowner","tambahowner"];
handler.tags        = ["owner"];
handler.command     = /^(addowner|tambahowner)$/i;
handler.description = "Menambahkan nomor ke daftar owner";
handler.owner       = true;

export default handler;
