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

const CRATE_POOLS = {
  common: [
    { type: 'money', min: 500,  max: 2000  },
    { type: 'item',  cat: 'drink',  key: 'water',       qty: [2,5] },
    { type: 'item',  cat: 'nature', key: 'bait',         qty: [3,8] },
    { type: 'item',  cat: 'ores',   key: 'stone',        qty: [5,15] },
    { type: 'item',  cat: 'ores',   key: 'coal',         qty: [2,6] },
  ],
  uncommon: [
    { type: 'money', min: 2000,  max: 8000  },
    { type: 'item',  cat: 'drink',  key: 'juice',        qty: [1,3] },
    { type: 'item',  cat: 'drink',  key: 'herbal_tea',   qty: [1,2] },
    { type: 'item',  cat: 'ores',   key: 'iron',         qty: [3,8] },
    { type: 'item',  cat: 'tools',  key: 'rod_wood',     qty: [1,1] },
    { type: 'item',  cat: 'weapon', key: 'sword_stone',  qty: [1,1] },
  ],
  legendary: [
    { type: 'money', min: 10000, max: 40000 },
    { type: 'item',  cat: 'drink',  key: 'mana_potion',  qty: [2,5] },
    { type: 'item',  cat: 'drink',  key: 'elixir',       qty: [1,2] },
    { type: 'item',  cat: 'ores',   key: 'diamond',      qty: [1,4] },
    { type: 'item',  cat: 'weapon', key: 'sword_diamond',qty: [1,1] },
    { type: 'item',  cat: 'armor',  key: 'armor_iron',   qty: [1,1] },
  ],
  mythic: [
    { type: 'money', min: 40000, max: 120000 },
    { type: 'item',  cat: 'ores',   key: 'platinum',     qty: [3,8]  },
    { type: 'item',  cat: 'weapon', key: 'sword_light',  qty: [1,1]  },
    { type: 'item',  cat: 'weapon', key: 'sword_dark',   qty: [1,1]  },
    { type: 'item',  cat: 'armor',  key: 'armor_crystal',qty: [1,1]  },
    { type: 'item',  cat: 'drink',  key: 'elixir',       qty: [3,8]  },
  ],
  secret: [
    { type: 'money', min: 100000, max: 500000 },
    { type: 'item',  cat: 'ores',   key: 'platinum',     qty: [10,20] },
    { type: 'item',  cat: 'weapon', key: 'sword_dark',   qty: [1,1]   },
    { type: 'item',  cat: 'armor',  key: 'armor_crystal',qty: [2,3]   },
    { type: 'item',  cat: 'drink',  key: 'elixir',       qty: [5,15]  },
  ],
};

const CRATE_LABEL = {
  common: '📦 Common',  uncommon: '🎁 Uncommon',
  legendary: '🏆 Legendary', mythic: '🌟 Mythic', secret: '🔮 Secret',
};

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
    db.ensureUser(ctx.sender, ctx.pushname);
    const user = global.db.user[ctx.sender];
    const crateKey = ctx.args[0]?.toLowerCase();

    if (!crateKey || !CRATE_POOLS[crateKey]) {
      const owned = Object.entries(user.inventory.crate)
        .filter(([, v]) => v > 0)
        .map(([k, v]) => `${CRATE_LABEL[k]}: ${v}`)
        .join('\n');
      return ctx.reply(
        `📦 *Crate kamu:*\n${owned || 'Tidak ada crate'}\n\n` +
        `Cara buka: *.opencrate [common/uncommon/legendary/mythic/secret]*`
      );
    }

    if ((user.inventory.crate[crateKey] || 0) <= 0) {
      return ctx.reply(`❌ Kamu tidak punya *${CRATE_LABEL[crateKey]}*!`);
    }

    user.inventory.crate[crateKey] -= 1;
    const pool = CRATE_POOLS[crateKey];
    const numDrops = 2 + Math.floor(Math.random() * 3);
    const picked = [];

    for (let i = 0; i < numDrops; i++) {
      const drop = pool[Math.floor(Math.random() * pool.length)];
      if (drop.type === 'money') {
        const amount = drop.min + Math.floor(Math.random() * (drop.max - drop.min));
        user.money += amount;
        picked.push(`💰 ${amount.toLocaleString('id-ID')} uang`);
      } else {
        const qty = drop.qty[0] + Math.floor(Math.random() * (drop.qty[1] - drop.qty[0] + 1));
        user.inventory[drop.cat][drop.key] = (user.inventory[drop.cat][drop.key] || 0) + qty;
        picked.push(`• ${drop.key.replace(/_/g,' ')} x${qty}`);
      }
    }

    db.write(global.db);

    await ctx.reply(
      `╭─〔 *BUKA CRATE* 〕─⬿\n` +
      `│\n` +
      `│ ${CRATE_LABEL[crateKey]} dibuka!\n` +
      `│\n` +
      picked.map(p => `│ ${p}`).join('\n') + '\n' +
      `│\n` +
      `│ Sisa ${CRATE_LABEL[crateKey]}: ${user.inventory.crate[crateKey]}\n` +
      `╰─〔 ${global.bot?.name} RPG 〕─⬿`
    );
  
};

handler.help        = ["opencrate","buka","openboks","openbox"];
handler.tags        = ["rpg"];
handler.command     = /^(opencrate|buka|openboks|openbox)$/i;
handler.description = "Buka crate. Contoh: .opencrate common";
handler.register    = true;

export default handler;
