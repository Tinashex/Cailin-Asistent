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

import db from '../../data/db.js';

let handler = async (m, { ctx }) => {
  try {
    const defaultLimit = global.bot?.defaultLimit || 20;
    const count = db.resetAllLimits(defaultLimit);
    db.write(global.db);
    m.reply(
      `✅ *Reset Limit Berhasil*\n\n` +
      `👥 Total user direset: *${count}*\n` +
      `💳 Limit default: *${defaultLimit}*\n\n` +
      `ℹ️ User owner & premium tidak terpengaruh.`
    );
  } catch (e) {
    m.reply(`❌ Error: ${e.message}`);
  }
};

handler.help        = ['resetlimit', 'resetlmt', 'resetallimit'];
handler.tags        = ['owner'];
handler.command     = /^(resetlimit|resetlmt|resetallimit)$/i;
handler.description = 'Reset limit semua user (Owner)';
handler.owner       = true;

export default handler;
