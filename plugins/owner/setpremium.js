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

import { makeJid, ensureUser } from '../../core/tools.js';
import db from '../../data/db.js';

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
    try {
      if (ctx.args.length < 3) return ctx.reply(`⚡ *Format:* ${ctx.prefix}setpremium [nomor] [durasi] [add/min]\n📦 *Durasi:* 1jam, 1hari, 1minggu, 1bulan, permanen`);
      const jid = makeJid(ctx.args[0]);
      ensureUser(jid, jid.split('@')[0]);
      const duration = ctx.args[1].toLowerCase();
      const action = ctx.args[2].toLowerCase();
      const now = Date.now();
      const user = global.db.user[jid];
      if (!user.premium) user.premium = { status: false, expiredAt: null };
      let addTime = 0;
      if (duration === 'permanen') {
        addTime = Number.MAX_SAFE_INTEGER;
      } else {
        const match = duration.match(/^(\d+)(jam|hari|minggu|bulan)$/);
        if (!match) return ctx.reply('❌ Durasi tidak valid.');
        const mul = { jam: 3600000, hari: 86400000, minggu: 604800000, bulan: 2592000000 };
        addTime = parseInt(match[1]) * (mul[match[2]] || 0);
      }
      if (action === 'add') {
        user.premium.expiredAt = user.premium.status && user.premium.expiredAt > now ? user.premium.expiredAt + addTime : now + addTime;
        user.premium.status = true;
        ctx.reply(`🎉 *Premium Aktif*\n👤 ${jid.split('@')[0]}\n⏳ ${duration}`);
      } else if (['min', 'remove', 'del'].includes(action)) {
        user.premium = { status: false, expiredAt: 0 };
        ctx.reply(`🗑️ *Premium Dinonaktifkan*\n👤 ${jid.split('@')[0]}`);
      }
      db.write(global.db);
    } catch (e) { ctx.reply(`❌ Error: ${e.message}`); }
  
};

handler.help        = ["setpremium","premiumset","premium"];
handler.tags        = ["owner"];
handler.command     = /^(setpremium|premiumset|premium)$/i;
handler.description = "Atur status premium user";
handler.owner       = true;

export default handler;
