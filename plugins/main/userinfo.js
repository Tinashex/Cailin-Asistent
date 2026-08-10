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
      let targetJid = ctx.sender;

      
      if (ctx.args[0]) {
        const isOwner =
          global.bot?.owner?.includes(ctx.sender.split('@')[0]) ||
          global.bot?.owner?.includes(ctx.sender) ||
          global.db?.user?.[ctx.sender]?.ownerAcces === true;

        if (!isOwner) return ctx.reply('❌ Kamu tidak bisa melihat info user lain!');
        targetJid = ctx.mentionedJid?.[0] || makeJid(ctx.args[0]);
      }

      db.ensureUser(targetJid, targetJid.split('@')[0]);
      const user = global.db.user[targetJid];

      const isPremium = user.premium?.status === true;
      const isOwner = user.ownerAcces === true;
      const now = Date.now();

      let premiumText = 'Tidak aktif';
      if (isPremium) {
        if (user.premium.expiredAt === Number.MAX_SAFE_INTEGER) {
          premiumText = 'Permanen ♾️';
        } else {
          const remaining = user.premium.expiredAt - now;
          if (remaining > 0) {
            const d = Math.floor(remaining / 86400000);
            const h = Math.floor((remaining % 86400000) / 3600000);
            premiumText = `Aktif (${d}h ${h}j lagi)`;
          } else {
            premiumText = 'Expired';
          }
        }
      }

      const createdDate = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        : 'Unknown';

      await ctx.reply(
        `╭─〔 *USER INFO* 〕─⬿\n` +
        `│\n` +
        `│ 👤 Nama    : ${user.name || 'Belum daftar'}\n` +
        `│ 📱 No      : ${targetJid.split('@')[0]}\n` +
        `│ 👑 Role    : ${isOwner ? 'Owner' : isPremium ? 'Premium' : 'Free'}\n` +
        `│ 💳 Limit   : ${isOwner || isPremium ? 'Unlimited' : `${user.limit ?? 0}`}\n` +
        `│ 💎 Premium : ${premiumText}\n` +
        `│\n` +
        `│ 📊 Level   : ${user.level || 1}\n` +
        `│ ✨ EXP     : ${user.exp || 0}\n` +
        `│ ❤️ HP      : ${user.hp || 100}/${user.hpMax || 100}\n` +
        `│ 💧 Mana    : ${user.mana || 50}/${user.manaMax || 50}\n` +
        `│ ⚔️ ATK     : ${user.atk || 10}\n` +
        `│ 🛡️ DEF     : ${user.def || 5}\n` +
        `│ 💰 Uang    : ${(user.money || 0).toLocaleString('id-ID')}\n` +
        `│\n` +
        `│ 📅 Daftar  : ${createdDate}\n` +
        `╰─〔 ${global.bot?.name || 'Bot'} 〕─⬿`
      );
    } catch (e) {
      ctx.reply(`❌ Error: ${e.message}`);
    }
  
};

handler.help        = ["userinfo","profil","profile","info"];
handler.tags        = ["main"];
handler.command     = /^(userinfo|profil|profile|info)$/i;
handler.description = "Lihat informasi profil user";

export default handler;
