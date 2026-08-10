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
    const sender = m.sender || ctx.sender;
    db.ensureUser(sender, m.pushname || sender.split('@')[0]);
    const user = global.db.user[sender];
    const isPremium = user.premium?.status === true;
    const isOwner = user.ownerAcces === true;

    let expiredText = '';
    if (isPremium && user.premium.expiredAt !== Number.MAX_SAFE_INTEGER) {
      const remaining = user.premium.expiredAt - Date.now();
      if (remaining > 0) {
        const d = Math.floor(remaining / 86400000);
        const h = Math.floor((remaining % 86400000) / 3600000);
        expiredText = `\n⏳ Sisa Premium : ${d}h ${h}j`;
      }
    }

    await m.reply(
      `╭─〔 *INFO LIMIT* 〕─⬿\n` +
      `│\n` +
      `│ 👤 Nama   : ${user.name || 'User'}\n` +
      `│ 💳 Limit  : ${isOwner ? 'Unlimited (Owner)' : isPremium ? 'Unlimited (Premium)' : `${user.limit ?? 0} / ${global.bot?.defaultLimit || 20}`}\n` +
      `│ ⭐ Status : ${isOwner ? '👑 Owner' : isPremium ? '💎 Premium' : '🆓 Free'}${expiredText}\n` +
      `│\n` +
      `│ ℹ️ Limit reset setiap hari 00.00\n` +
      `╰─〔 ${global.bot?.name || 'Bot'} 〕─⬿`
    );
  } catch (e) {
    m.reply(`❌ Error: ${e.message}`);
  }
};

handler.help        = ['limit', 'ceklimit', 'checklimit'];
handler.tags        = ['main'];
handler.command     = /^(limit|ceklimit|checklimit)$/i;
handler.description = 'Cek sisa limit kamu';

export default handler;
