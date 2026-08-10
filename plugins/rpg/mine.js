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

const ORE_TABLE = [
  { key: 'coal',     name: 'Batu Bara',  emoji: '🪨', chance: 0.40, expMin: 5,  expMax: 10  },
  { key: 'stone',    name: 'Batu',       emoji: '⬜', chance: 0.70, expMin: 3,  expMax: 7   },
  { key: 'iron',     name: 'Besi',       emoji: '🔩', chance: 0.50, expMin: 8,  expMax: 15  },
  { key: 'gold',     name: 'Emas',       emoji: '🪙', chance: 0.25, expMin: 15, expMax: 25  },
  { key: 'diamond',  name: 'Berlian',    emoji: '💎', chance: 0.08, expMin: 30, expMax: 50  },
  { key: 'platinum', name: 'Platinum',   emoji: '🔷', chance: 0.03, expMin: 50, expMax: 80  },
];

const TOOL_BONUS = {
  pickaxe_iron:    { chanceMult: 1.3, label: 'Pickaxe Besi' },
  pickaxe_diamond: { chanceMult: 1.8, label: 'Pickaxe Berlian' },
};

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
    db.ensureUser(ctx.sender, ctx.pushname);
    const user = global.db.user[ctx.sender];
    const now = Date.now();
    const cd = 30 * 60 * 1000;

    if (user.cooldown.mine && now - user.cooldown.mine < cd) {
      const sisa = cd - (now - user.cooldown.mine);
      const m = Math.floor(sisa / 60000);
      const s = Math.floor((sisa % 60000) / 1000);
      return ctx.reply(`⏳ Kamu masih kelelahan menambang!\n🕐 Cooldown: *${m}m ${s}d*`);
    }

    const equippedTool = user.equipped?.weapon;
    let bonus = null;
    let chanceMult = 1.0;

    if (user.inventory.tools.pickaxe_diamond > 0) {
      bonus = TOOL_BONUS.pickaxe_diamond;
      chanceMult = bonus.chanceMult;
    } else if (user.inventory.tools.pickaxe_iron > 0) {
      bonus = TOOL_BONUS.pickaxe_iron;
      chanceMult = bonus.chanceMult;
    }

    const hasil = [];
    let totalExp = 0;

    for (const ore of ORE_TABLE) {
      if (Math.random() < ore.chance * chanceMult) {
        const qty = 1 + Math.floor(Math.random() * 3);
        user.inventory.ores[ore.key] += qty;
        const exp = ore.expMin + Math.floor(Math.random() * (ore.expMax - ore.expMin));
        totalExp += exp;
        hasil.push(`${ore.emoji} ${ore.name} x${qty}`);
      }
    }

    if (hasil.length === 0) {
      user.inventory.ores.stone += 1;
      hasil.push('⬜ Batu x1 (tidak beruntung..)');
      totalExp = 2;
    }

    user.exp += totalExp;
    user.cooldown.mine = now;
    db.write(global.db);

    await ctx.reply(
      `╭─〔 *TAMBANG* 〕─⬿\n` +
      `│\n` +
      `│ ⛏️ ${bonus ? `Menggunakan ${bonus.label}` : 'Tanpa alat (tangan kosong)'}\n` +
      `│\n` +
      `│ Hasil tambang:\n` +
      hasil.map(h => `│  • ${h}`).join('\n') + '\n' +
      `│\n` +
      `│ ✨ EXP +${totalExp}\n` +
      `╰─〔 ${global.bot?.name} RPG 〕─⬿`
    );
  
};

handler.help        = ["mine","tambang","mining"];
handler.tags        = ["rpg"];
handler.command     = /^(mine|tambang|mining)$/i;
handler.description = "Tambang batu dan mineral";
handler.register    = true;

export default handler;
