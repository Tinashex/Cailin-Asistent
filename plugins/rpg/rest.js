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
    db.ensureUser(ctx.sender, ctx.pushname);
    const user = global.db.user[ctx.sender];
    const now = Date.now();
    const cd = 60 * 60 * 1000;

    if (user.hp >= user.hpMax && user.mana >= user.manaMax) {
      return ctx.reply(`💚 HP dan Mana kamu sudah penuh! Tidak perlu istirahat.`);
    }

    if (user.cooldown.rest && now - user.cooldown.rest < cd) {
      const sisa = cd - (now - user.cooldown.rest);
      const m = Math.floor(sisa / 60000);
      const s = Math.floor((sisa % 60000) / 1000);
      return ctx.reply(`⏳ Kamu masih mengantuk!\n🕐 Cooldown: *${m}m ${s}d*`);
    }

    const hpRestore = Math.floor(user.hpMax * 0.6);
    const manaRestore = Math.floor(user.manaMax * 0.6);

    const hpBefore = user.hp;
    const manaBefore = user.mana;

    user.hp = Math.min(user.hpMax, user.hp + hpRestore);
    user.mana = Math.min(user.manaMax, user.mana + manaRestore);
    user.cooldown.rest = now;
    db.write(global.db);

    await ctx.reply(
      `╭─〔 *ISTIRAHAT* 〕─⬿\n` +
      `│\n` +
      `│ 😴 ${user.name} beristirahat sejenak...\n` +
      `│\n` +
      `│ ❤️ HP   : ${hpBefore} → ${user.hp}/${user.hpMax}\n` +
      `│ 💧 Mana : ${manaBefore} → ${user.mana}/${user.manaMax}\n` +
      `│\n` +
      `│ 💡 Pulihkan lebih cepat dengan minum potion!\n` +
      `╰─〔 ${global.bot?.name} RPG 〕─⬿`
    );
  
};

handler.help        = ["rest","istirahat","tidur","heal"];
handler.tags        = ["rpg"];
handler.command     = /^(rest|istirahat|tidur|heal)$/i;
handler.description = "Istirahat untuk memulihkan HP dan Mana";
handler.register    = true;

export default handler;
