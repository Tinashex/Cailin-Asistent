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

const RECIPES = {
  grilled_fish: {
    name: 'Ikan Bakar',    emoji: '🐟', category: 'food',
    ingredients: [
      { cat: 'fish',   key: 'anchovy', qty: 2 },
      { cat: 'nature', key: 'spice',   qty: 1 },
    ],
    expReward: 10,
  },
  steak: {
    name: 'Steak',         emoji: '🥩', category: 'food',
    ingredients: [
      { cat: 'nature', key: 'leather', qty: 1 },
      { cat: 'nature', key: 'spice',   qty: 2 },
    ],
    expReward: 20,
  },
  fruit_salad: {
    name: 'Salad Buah',    emoji: '🥗', category: 'food',
    ingredients: [
      { cat: 'fruit', key: 'strawberry', qty: 2 },
      { cat: 'fruit', key: 'apple',      qty: 1 },
      { cat: 'fruit', key: 'grape',      qty: 1 },
    ],
    expReward: 15,
  },
  roast_chicken: {
    name: 'Ayam Bakar',    emoji: '🍗', category: 'food',
    ingredients: [
      { cat: 'nature', key: 'leather', qty: 2 },
      { cat: 'nature', key: 'spice',   qty: 3 },
      { cat: 'vegetable', key: 'potato', qty: 2 },
    ],
    expReward: 30,
  },
  mana_potion: {
    name: 'Mana Potion',   emoji: '🔵', category: 'drink',
    ingredients: [
      { cat: 'drink',   key: 'water',      qty: 2 },
      { cat: 'nature',  key: 'spice',      qty: 3 },
      { cat: 'vegetable', key: 'carrot',   qty: 2 },
    ],
    expReward: 25,
  },
  sword_stone: {
    name: 'Pedang Batu',   emoji: '🗡️', category: 'weapon',
    ingredients: [
      { cat: 'ores', key: 'stone', qty: 10 },
      { cat: 'nature', key: 'wood', qty: 3 },
    ],
    expReward: 40,
  },
  sword_iron: {
    name: 'Pedang Besi',   emoji: '⚔️', category: 'weapon',
    ingredients: [
      { cat: 'ores', key: 'iron',  qty: 8 },
      { cat: 'ores', key: 'coal',  qty: 4 },
      { cat: 'nature', key: 'wood', qty: 2 },
    ],
    expReward: 80,
  },
  armor_leather: {
    name: 'Armor Kulit',   emoji: '🟤', category: 'armor',
    ingredients: [
      { cat: 'nature', key: 'leather', qty: 8 },
    ],
    expReward: 50,
  },
  armor_iron: {
    name: 'Armor Besi',    emoji: '🔩', category: 'armor',
    ingredients: [
      { cat: 'ores', key: 'iron',  qty: 12 },
      { cat: 'ores', key: 'coal',  qty: 5 },
    ],
    expReward: 100,
  },
  rod_wood: {
    name: 'Joran Kayu',    emoji: '🎣', category: 'tools',
    ingredients: [
      { cat: 'nature', key: 'wood',    qty: 5 },
      { cat: 'nature', key: 'leather', qty: 2 },
    ],
    expReward: 30,
  },
  pickaxe_iron: {
    name: 'Pickaxe Besi',  emoji: '⛏️', category: 'tools',
    ingredients: [
      { cat: 'ores',   key: 'iron',  qty: 6 },
      { cat: 'nature', key: 'wood',  qty: 4 },
    ],
    expReward: 60,
  },
};

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
    db.ensureUser(ctx.sender, ctx.pushname);
    const user = global.db.user[ctx.sender];
    const itemKey = ctx.args[0]?.toLowerCase().replace(/ /g, '_');

    if (!itemKey) {
      let text = `╭─〔 *CRAFTING* 〕─⬿\n│\n`;
      for (const [key, recipe] of Object.entries(RECIPES)) {
        const mats = recipe.ingredients.map(i => `${i.qty}x ${i.key.replace(/_/g,' ')}`).join(', ');
        text += `│ ${recipe.emoji} *${key}*\n│   Bahan: ${mats}\n│\n`;
      }
      text += `│ Cara craft: *.craft [item]*\n╰─〔 ${global.bot?.name} RPG 〕─⬿`;
      return ctx.reply(text);
    }

    const recipe = RECIPES[itemKey];
    if (!recipe) return ctx.reply(`❌ Resep *${itemKey}* tidak ditemukan!\nCek daftar dengan *.craft*`);

    for (const mat of recipe.ingredients) {
      const have = user.inventory[mat.cat]?.[mat.key] || 0;
      if (have < mat.qty) {
        return ctx.reply(
          `❌ Bahan tidak cukup!\n` +
          `• ${mat.key.replace(/_/g,' ')}: butuh ${mat.qty}, punya ${have}`
        );
      }
    }

    for (const mat of recipe.ingredients) {
      user.inventory[mat.cat][mat.key] -= mat.qty;
    }
    user.inventory[recipe.category][itemKey] = (user.inventory[recipe.category][itemKey] || 0) + 1;
    user.exp += recipe.expReward;
    db.write(global.db);

    await ctx.reply(
      `╭─〔 *CRAFT BERHASIL* 〕─⬿\n` +
      `│\n` +
      `│ ${recipe.emoji} *${recipe.name}* berhasil dibuat!\n` +
      `│ ✨ EXP +${recipe.expReward}\n` +
      `╰─〔 ${global.bot?.name} RPG 〕─⬿`
    );
  
};

handler.help        = ["craft","buat","crafting","forge"];
handler.tags        = ["rpg"];
handler.command     = /^(craft|buat|crafting|forge)$/i;
handler.description = "Buat item dari bahan. Contoh: .craft sword_iron";
handler.register    = true;

export default handler;
