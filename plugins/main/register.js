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

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
    try {
      const user = global.db?.user?.[ctx.sender];

      
      if (user?.name && user.name !== ctx.sender.split('@')[0]) {
        return ctx.reply(
          `✅ *Kamu sudah terdaftar!*\n\n` +
          `👤 Nama   : ${user.name}\n` +
          `⭐ Status : ${user.premium?.status ? 'Premium' : 'Free'}\n` +
          `📊 Level  : ${user.level || 1}\n` +
          `💳 Limit  : ${user.ownerAcces ? 'Unlimited' : (user.limit ?? 20)}`
        );
      }

      const name = ctx.query?.trim();
      if (!name) {
        return ctx.reply(
          `📝 *Register*\n\n` +
          `Format: *${ctx.prefix || '.'}register [nama]*\n` +
          `Contoh: *${ctx.prefix || '.'}register Kyu*`
        );
      }

      if (name.length < 3 || name.length > 20) {
        return ctx.reply('❌ Nama harus antara 3-20 karakter!');
      }

      if (!/^[a-zA-Z0-9_ ]+$/.test(name)) {
        return ctx.reply('❌ Nama hanya boleh mengandung huruf, angka, spasi, dan underscore!');
      }

      
      db.ensureUser(ctx.sender, name);
      global.db.user[ctx.sender].name = name;
      db.write(global.db);

      await ctx.reply(
        `╭─〔 *REGISTER BERHASIL* 〕─⬿\n` +
        `│\n` +
        `│ 👤 Nama   : ${name}\n` +
        `│ 📱 No     : ${ctx.sender.split('@')[0]}\n` +
        `│ ⭐ Status : Free\n` +
        `│ 📊 Level  : 1\n` +
        `│ 💳 Limit  : ${global.bot?.defaultLimit || 20}\n` +
        `│\n` +
        `╰─〔 ${global.bot?.name || 'Bot'} 〕─⬿`
      );
    } catch (e) {
      ctx.reply(`❌ Error: ${e.message}`);
    }
  
};

handler.help        = ["register","daftar","reg"];
handler.tags        = ['main'];
handler.command     = /^(register|daftar|reg)$/i;
handler.description = "Daftar sebagai pengguna bot";

export default handler;
