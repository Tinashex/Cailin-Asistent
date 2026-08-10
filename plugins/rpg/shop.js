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

const SHOP_ITEMS = {
  bait:             { name: 'Umpan',          category: 'nature',  emoji: '🪱', price: 200,   sell: 50   },
  water:            { name: 'Air',            category: 'drink',   emoji: '💧', price: 100,   sell: 30   },
  juice:            { name: 'Jus',            category: 'drink',   emoji: '🧃', price: 500,   sell: 150  },
  herbal_tea:       { name: 'Teh Herbal',     category: 'drink',   emoji: '🍵', price: 800,   sell: 250  },
  mana_potion:      { name: 'Mana Potion',    category: 'drink',   emoji: '🔵', price: 2000,  sell: 600  },
  elixir:           { name: 'Elixir',         category: 'drink',   emoji: '✨', price: 5000,  sell: 1500 },
  bread:            { name: 'Roti',           category: 'food',    emoji: '🍞', price: 300,   sell: 80   },
  rice:             { name: 'Nasi',           category: 'food',    emoji: '🍚', price: 400,   sell: 100  },
  pickaxe_iron:     { name: 'Pickaxe Besi',   category: 'tools',   emoji: '⛏️', price: 5000,  sell: 1500 },
  pickaxe_diamond:  { name: 'Pickaxe Berlian',category: 'tools',   emoji: '💎', price: 20000, sell: 6000 },
  rod_wood:         { name: 'Joran Kayu',     category: 'tools',   emoji: '🎣', price: 3000,  sell: 900  },
  rod_premium:      { name: 'Joran Premium',  category: 'tools',   emoji: '🌟', price: 15000, sell: 4500 },
  sword_stone:      { name: 'Pedang Batu',    category: 'weapon',  emoji: '🗡️', price: 3000,  sell: 800  },
  sword_iron:       { name: 'Pedang Besi',    category: 'weapon',  emoji: '⚔️', price: 8000,  sell: 2400 },
  sword_diamond:    { name: 'Pedang Berlian', category: 'weapon',  emoji: '💠', price: 25000, sell: 7500 },
  sword_light:      { name: 'Pedang Cahaya',  category: 'weapon',  emoji: '☀️', price: 60000, sell: 18000},
  sword_dark:       { name: 'Pedang Kegelapan',category:'weapon',  emoji: '🌑', price: 80000, sell: 24000},
  armor_leather:    { name: 'Armor Kulit',    category: 'armor',   emoji: '🟤', price: 4000,  sell: 1200 },
  armor_iron:       { name: 'Armor Besi',     category: 'armor',   emoji: '🔩', price: 12000, sell: 3600 },
  armor_crystal:    { name: 'Armor Kristal',  category: 'armor',   emoji: '💎', price: 35000, sell: 10500},
};

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
    const sender = m.sender || ctx.sender;
    db.ensureUser(sender, m.pushname || ctx.pushname);
    const user = global.db.user[sender];
    const cmd = command || ctx.cmd;

    if (cmd === 'jual') {
      const itemKey = args[0]?.toLowerCase();
      const qty = parseInt(args[1]) || 1;
      if (!itemKey || !SHOP_ITEMS[itemKey]) {
        return m.reply(`❌ Item tidak ditemukan!\nCek daftar dengan *.toko*`);
      }
      const item = SHOP_ITEMS[itemKey];
      const inv = user.inventory[item.category];
      if (!inv || (inv[itemKey] || 0) < qty) {
        return m.reply(`❌ ${item.name} kamu tidak cukup! Kamu punya: ${inv?.[itemKey] || 0}`);
      }
      inv[itemKey] -= qty;
      const total = item.sell * qty;
      user.money += total;
      db.write(global.db);
      return m.reply(
        `✅ Berhasil jual *${qty}x ${item.emoji} ${item.name}*\n` +
        `💰 +${total.toLocaleString('id-ID')} uang\n` +
        `💳 Saldo: ${user.money.toLocaleString('id-ID')}`
      );
    }

    if (cmd === 'beli') {
      const itemKey = args[0]?.toLowerCase();
      const qty = parseInt(args[1]) || 1;
      if (!itemKey || !SHOP_ITEMS[itemKey]) {
        return m.reply(`❌ Item tidak ditemukan!\nCek daftar dengan *.toko*`);
      }
      const item = SHOP_ITEMS[itemKey];
      const total = item.price * qty;
      if (user.money < total) {
        return m.reply(`❌ Uang tidak cukup!\n💰 Butuh: ${total.toLocaleString('id-ID')}\n💳 Punya: ${user.money.toLocaleString('id-ID')}`);
      }
      user.money -= total;
      user.inventory[item.category][itemKey] = (user.inventory[item.category][itemKey] || 0) + qty;
      db.write(global.db);
      return m.reply(
        `✅ Berhasil beli *${qty}x ${item.emoji} ${item.name}*\n` +
        `💰 -${total.toLocaleString('id-ID')} uang\n` +
        `💳 Saldo: ${user.money.toLocaleString('id-ID')}`
      );
    }

    const grouped = {};
    for (const [key, val] of Object.entries(SHOP_ITEMS)) {
      if (!grouped[val.category]) grouped[val.category] = [];
      grouped[val.category].push({ key, ...val });
    }

    const catLabel = {
      nature: '🌿 Alam', drink: '🧃 Minuman', food: '🍱 Makanan',
      tools: '🔧 Alat', weapon: '⚔️ Senjata', armor: '🛡️ Armor',
    };

    let shopText = `╭─〔 *TOKO RPG* 〕─⬿\n│\n│ 💰 Uangmu: ${user.money.toLocaleString('id-ID')}\n│\n`;
    for (const [cat, items] of Object.entries(grouped)) {
      shopText += `│ ${catLabel[cat] || cat}\n`;
      for (const item of items) {
        shopText += `│  • ${item.key} — ${item.emoji} ${item.name}\n│    Beli: ${item.price.toLocaleString('id-ID')} | Jual: ${item.sell.toLocaleString('id-ID')}\n`;
      }
      shopText += `│\n`;
    }
    shopText += `│ Cara beli: *.beli [item] [qty]*\n│ Cara jual: *.jual [item] [qty]*\n╰─〔 ${global.bot?.name} RPG 〕─⬿`;

    await m.reply(shopText);
  
};

handler.help        = ["shop","toko","store","beli","jual"];
handler.tags        = ["rpg"];
handler.command     = /^(shop|toko|store|beli|jual)$/i;
handler.description = "Toko item RPG. Gunakan: .toko | .beli [item] [qty] | .jual [item] [qty]";
handler.register    = true;

export default handler;
