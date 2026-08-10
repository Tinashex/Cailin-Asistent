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

const CATEGORIES = {
  ores:      { label: 'Ore / Mineral', emoji: '⛏️' },
  nature:    { label: 'Alam',          emoji: '🌿' },
  fruit:     { label: 'Buah',          emoji: '🍓' },
  vegetable: { label: 'Sayuran',       emoji: '🥕' },
  fish:      { label: 'Ikan',          emoji: '🐟' },
  food:      { label: 'Makanan',       emoji: '🍱' },
  drink:     { label: 'Minuman',       emoji: '🧃' },
  tools:     { label: 'Alat',          emoji: '🔧' },
  weapon:    { label: 'Senjata',       emoji: '⚔️' },
  armor:     { label: 'Armor',         emoji: '🛡️' },
  crate:     { label: 'Crate',         emoji: '📦' },
};

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
    db.ensureUser(ctx.sender, ctx.pushname);
    const user = global.db.user[ctx.sender];
    const inv = user.inventory;

    const arg = ctx.args[0]?.toLowerCase();

    let lines = [
      `╭─〔 *INVENTARIS* 〕─⬿`,
      `│`,
      `│ 👤 ${user.name}  |  Lv ${user.level}`,
      `│ 💰 ${user.money.toLocaleString('id-ID')} uang`,
      `│`,
    ];

    const showCat = (catKey) => {
      const meta = CATEGORIES[catKey];
      const items = Object.entries(inv[catKey] || {}).filter(([, v]) => v > 0);
      if (items.length === 0) return;
      lines.push(`│ ${meta.emoji} *${meta.label}*`);
      for (const [k, v] of items) {
        lines.push(`│   • ${k.replace(/_/g, ' ')}: ${v}`);
      }
      lines.push(`│`);
    };

    if (arg && CATEGORIES[arg]) {
      showCat(arg);
    } else {
      for (const cat of Object.keys(CATEGORIES)) showCat(cat);
    }

    const equipped = user.equipped || {};
    lines.push(`│ 🗡️ Equipped: ${equipped.weapon?.replace(/_/g, ' ') || 'kosong'} | ${equipped.armor?.replace(/_/g, ' ') || 'kosong'}`);
    lines.push(`╰─〔 ${global.bot?.name} RPG 〕─⬿`);

    await ctx.reply(lines.join('\n'));
  
};

handler.help        = ["inventory","inv","tas","bag"];
handler.tags        = ["rpg"];
handler.command     = /^(inventory|inv|tas|bag)$/i;
handler.description = "Lihat inventaris kamu";
handler.register    = true;

export default handler;
