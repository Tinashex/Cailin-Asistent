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
    const cd = 24 * 60 * 60 * 1000;

    if (user.cooldown.daily && now - user.cooldown.daily < cd) {
      const sisa = cd - (now - user.cooldown.daily);
      const h = Math.floor(sisa / 3600000);
      const m = Math.floor((sisa % 3600000) / 60000);
      return ctx.reply(`⏳ Hadiah harian belum tersedia!\n🕐 Coba lagi dalam *${h}j ${m}m*`);
    }

    const money = 5000 + Math.floor(Math.random() * 10000);
    const exp = 20 + Math.floor(Math.random() * 30);
    const bonus = [];

    const roll = Math.random();
    if (roll < 0.3) {
      user.inventory.drink.water += 2;
      bonus.push('💧 Air x2');
    } else if (roll < 0.55) {
      user.inventory.nature.bait += 3;
      bonus.push('🪱 Umpan x3');
    } else if (roll < 0.7) {
      user.inventory.drink.mana_potion += 1;
      bonus.push('🔵 Mana Potion x1');
    } else if (roll < 0.85) {
      user.inventory.crate.common += 1;
      bonus.push('📦 Common Crate x1');
    } else {
      user.inventory.crate.uncommon += 1;
      bonus.push('🎁 Uncommon Crate x1');
    }

    user.money += money;
    user.exp += exp;
    user.cooldown.daily = now;
    db.write(global.db);

    await ctx.reply(
      `╭─〔 *DAILY REWARD* 〕─⬿\n` +
      `│\n` +
      `│ 🎉 Selamat *${user.name}*!\n` +
      `│\n` +
      `│ 💰 Uang  : +${money.toLocaleString('id-ID')}\n` +
      `│ ✨ EXP   : +${exp}\n` +
      `│ 🎁 Bonus : ${bonus.join(', ')}\n` +
      `│\n` +
      `│ 💳 Total Uang : ${user.money.toLocaleString('id-ID')}\n` +
      `│ 📊 EXP Skrg  : ${user.exp}\n` +
      `╰─〔 ${global.bot?.name} RPG 〕─⬿`
    );
  
};

handler.help        = ["daily","hadiahHarian","claimdaily"];
handler.tags        = ["rpg"];
handler.command     = /^(daily|hadiahHarian|claimdaily)$/i;
handler.description = "Ambil hadiah harian kamu";
handler.register    = true;

export default handler;
