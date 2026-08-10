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

let handler = async (m, { args, prefix }) => {
  try {
    if (args.length < 2) return m.reply(`⚡ Format: ${prefix}addlimit [nomor] [jumlah]`);
    const jid = makeJid(args[0]);
    const amount = parseInt(args[1]);
    if (isNaN(amount) || amount <= 0) return m.reply('❌ Jumlah tidak valid!');
    db.ensureUser(jid, jid.split('@')[0]);
    global.db.user[jid].limit = (global.db.user[jid].limit ?? 0) + amount;
    db.write(global.db);
    m.reply(`✅ Berhasil menambah *${amount}* limit ke *${jid.split('@')[0]}*\nTotal limit sekarang: *${global.db.user[jid].limit}*`);
  } catch (e) {
    m.reply(`❌ Error: ${e.message}`);
  }
};

handler.help        = ['addlimit', 'tambahLimit', 'addlmt'];
handler.tags        = ['owner'];
handler.command     = /^(addlimit|tambahlimit|addlmt)$/i;
handler.description = 'Tambah limit user (Owner)';
handler.owner       = true;

export default handler;
