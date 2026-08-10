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

const USABLE = {
  water:        { name: 'Air',         emoji: '💧', hp: 15,  mana: 0,  category: 'drink' },
  juice:        { name: 'Jus',         emoji: '🧃', hp: 30,  mana: 10, category: 'drink' },
  herbal_tea:   { name: 'Teh Herbal',  emoji: '🍵', hp: 50,  mana: 25, category: 'drink' },
  mana_potion:  { name: 'Mana Potion', emoji: '🔵', hp: 0,   mana: 80, category: 'drink' },
  elixir:       { name: 'Elixir',      emoji: '✨', hp: 200, mana: 100,category: 'drink' },
  bread:        { name: 'Roti',        emoji: '🍞', hp: 20,  mana: 0,  category: 'food'  },
  rice:         { name: 'Nasi',        emoji: '🍚', hp: 40,  mana: 5,  category: 'food'  },
  grilled_fish: { name: 'Ikan Bakar',  emoji: '🐟', hp: 60,  mana: 10, category: 'food'  },
  steak:        { name: 'Steak',       emoji: '🥩', hp: 100, mana: 20, category: 'food'  },
  fruit_salad:  { name: 'Salad Buah',  emoji: '🥗', hp: 45,  mana: 30, category: 'food'  },
  roast_chicken:{ name: 'Ayam Bakar',  emoji: '🍗', hp: 80,  mana: 15, category: 'food'  },
};

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
    db.ensureUser(ctx.sender, ctx.pushname);
    const user = global.db.user[ctx.sender];
    const itemKey = ctx.args[0]?.toLowerCase().replace(/ /g, '_');

    if (!itemKey) {
      const list = Object.entries(USABLE)
        .map(([k, v]) => `${v.emoji} ${k} → +${v.hp} HP, +${v.mana} Mana`)
        .join('\n');
      return ctx.reply(`📋 *Item yang bisa dipakai:*\n${list}\n\nCara pakai: *.use [item]*`);
    }

    const item = USABLE[itemKey];
    if (!item) return ctx.reply(`❌ Item *${itemKey}* tidak bisa dipakai atau tidak ada!`);

    const inv = user.inventory[item.category];
    if (!inv || (inv[itemKey] || 0) <= 0) {
      return ctx.reply(`❌ Kamu tidak punya *${item.emoji} ${item.name}*!`);
    }

    if (user.hp >= user.hpMax && user.mana >= user.manaMax) {
      return ctx.reply(`💚 HP dan Mana kamu sudah penuh!`);
    }

    const hpBefore = user.hp;
    const manaBefore = user.mana;
    inv[itemKey] -= 1;
    user.hp = Math.min(user.hpMax, user.hp + item.hp);
    user.mana = Math.min(user.manaMax, user.mana + item.mana);
    db.write(global.db);

    await ctx.reply(
      `╭─〔 *GUNAKAN ITEM* 〕─⬿\n` +
      `│\n` +
      `│ ${item.emoji} Menggunakan *${item.name}*\n` +
      `│\n` +
      (item.hp > 0 ? `│ ❤️ HP  : ${hpBefore} → ${user.hp}/${user.hpMax} (+${Math.min(item.hp, user.hpMax - hpBefore)})\n` : '') +
      (item.mana > 0 ? `│ 💧 Mana: ${manaBefore} → ${user.mana}/${user.manaMax} (+${Math.min(item.mana, user.manaMax - manaBefore)})\n` : '') +
      `│ Sisa: ${inv[itemKey]}x\n` +
      `╰─〔 ${global.bot?.name} RPG 〕─⬿`
    );
  
};

handler.help        = ["use","pakai","consume","makan","minum"];
handler.tags        = ["rpg"];
handler.command     = /^(use|pakai|consume|makan|minum)$/i;
handler.description = "Gunakan item (potion/makanan). Contoh: .use elixir";
handler.register    = true;

export default handler;
