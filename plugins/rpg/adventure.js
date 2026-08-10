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

const MONSTERS = [
  { name: 'Goblin',        emoji: '👺', minLv: 1,  hp: 30,  atk: 8,  def: 2,  expMin: 15, expMax: 25, moneyMin: 200,  moneyMax: 500  },
  { name: 'Serigala',      emoji: '🐺', minLv: 2,  hp: 50,  atk: 12, def: 4,  expMin: 25, expMax: 40, moneyMin: 400,  moneyMax: 800  },
  { name: 'Orc',           emoji: '👹', minLv: 5,  hp: 100, atk: 20, def: 8,  expMin: 50, expMax: 80, moneyMin: 800,  moneyMax: 1500 },
  { name: 'Troll',         emoji: '🧌', minLv: 8,  hp: 150, atk: 28, def: 12, expMin: 80, expMax: 120, moneyMin: 1200, moneyMax: 2500 },
  { name: 'Vampire',       emoji: '🧛', minLv: 12, hp: 200, atk: 35, def: 15, expMin: 120, expMax: 180, moneyMin: 2000, moneyMax: 4000 },
  { name: 'Naga Merah',    emoji: '🐉', minLv: 18, hp: 350, atk: 55, def: 25, expMin: 200, expMax: 300, moneyMin: 4000, moneyMax: 8000 },
  { name: 'Iblis Purba',   emoji: '😈', minLv: 25, hp: 500, atk: 80, def: 35, expMin: 350, expMax: 500, moneyMin: 8000, moneyMax: 15000 },
];

const LOOT_TABLE = [
  { key: 'nature.leather',    name: 'Kulit',         emoji: '🟤', chance: 0.45 },
  { key: 'nature.spice',      name: 'Rempah',        emoji: '🌶️', chance: 0.20 },
  { key: 'crate.common',      name: 'Common Crate',  emoji: '📦', chance: 0.20 },
  { key: 'crate.uncommon',    name: 'Uncommon Crate',emoji: '🎁', chance: 0.08 },
  { key: 'crate.legendary',   name: 'Legendary Crate',emoji: '🏆',chance: 0.02 },
];

function addInventoryNested(inv, dotKey, qty) {
  const [cat, item] = dotKey.split('.');
  if (inv[cat]) inv[cat][item] = (inv[cat][item] || 0) + qty;
}

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
    db.ensureUser(ctx.sender, ctx.pushname);
    const user = global.db.user[ctx.sender];
    const now = Date.now();
    const cd = 45 * 60 * 1000;

    if (user.cooldown.adventure && now - user.cooldown.adventure < cd) {
      const sisa = cd - (now - user.cooldown.adventure);
      const m = Math.floor(sisa / 60000);
      const s = Math.floor((sisa % 60000) / 1000);
      return ctx.reply(`⏳ Kamu masih butuh istirahat dari petualangan!\n🕐 Cooldown: *${m}m ${s}d*`);
    }

    if (user.hp <= 0) {
      return ctx.reply(`💀 HP kamu 0! Gunakan *.rest* atau minum potion dulu!`);
    }

    const eligible = MONSTERS.filter(m => m.minLv <= user.level);
    const monster = eligible[Math.floor(Math.random() * eligible.length)];

    let playerHp = user.hp;
    let monsterHp = monster.hp;
    const log = [];
    let round = 0;

    const weaponBonus = {
      sword_stone:   5,
      sword_iron:    12,
      sword_diamond: 22,
      sword_light:   35,
      sword_dark:    40,
    };
    const armorBonus = {
      armor_leather: 3,
      armor_iron:    8,
      armor_crystal: 18,
    };

    let playerAtk = user.atk + (weaponBonus[user.equipped?.weapon] || 0);
    let playerDef = user.def + (armorBonus[user.equipped?.armor] || 0);

    while (playerHp > 0 && monsterHp > 0 && round < 10) {
      round++;
      const dmgToMonster = Math.max(1, playerAtk - monster.def + Math.floor(Math.random() * 5));
      const dmgToPlayer = Math.max(1, monster.atk - playerDef + Math.floor(Math.random() * 5));

      monsterHp -= dmgToMonster;
      if (monsterHp > 0) playerHp -= dmgToPlayer;

      log.push(`R${round}: ⚔️-${dmgToMonster} | ${monster.emoji}-${dmgToPlayer <= 0 || monsterHp <= 0 ? 0 : dmgToPlayer}`);
    }

    const menang = monsterHp <= 0;
    user.hp = Math.max(0, playerHp);

    if (menang) {
      const exp = monster.expMin + Math.floor(Math.random() * (monster.expMax - monster.expMin));
      const money = monster.moneyMin + Math.floor(Math.random() * (monster.moneyMax - monster.moneyMin));
      user.exp += exp;
      user.money += money;

      const loot = [];
      for (const item of LOOT_TABLE) {
        if (Math.random() < item.chance) {
          addInventoryNested(user.inventory, item.key, 1);
          loot.push(`${item.emoji} ${item.name}`);
        }
      }

      user.cooldown.adventure = now;
      db.write(global.db);

      await ctx.reply(
        `╭─〔 *PETUALANGAN* 〕─⬿\n` +
        `│\n` +
        `│ ⚔️ Melawan ${monster.emoji} ${monster.name}\n` +
        `│\n` +
        `│ ${log.slice(0, 5).join('\n│ ')}\n` +
        `│\n` +
        `│ 🏆 MENANG!\n` +
        `│ ✨ EXP   : +${exp}\n` +
        `│ 💰 Uang  : +${money.toLocaleString('id-ID')}\n` +
        (loot.length ? `│ 🎁 Loot  : ${loot.join(', ')}\n` : '') +
        `│\n` +
        `│ ❤️ HP sisa: ${user.hp}/${user.hpMax}\n` +
        `╰─〔 ${global.bot?.name} RPG 〕─⬿`
      );
    } else {
      db.write(global.db);
      await ctx.reply(
        `╭─〔 *PETUALANGAN* 〕─⬿\n` +
        `│\n` +
        `│ ⚔️ Melawan ${monster.emoji} ${monster.name}\n` +
        `│\n` +
        `│ ${log.slice(0, 5).join('\n│ ')}\n` +
        `│\n` +
        `│ 💀 KALAH! HP kamu habis.\n` +
        `│ ❤️ HP  : ${user.hp}/${user.hpMax}\n` +
        `│ 💡 Tip : Gunakan *.rest* atau minum potion\n` +
        `╰─〔 ${global.bot?.name} RPG 〕─⬿`
      );
    }
  
};

handler.help        = ["adventure","adv","hunt","buruan","petualangan"];
handler.tags        = ["rpg"];
handler.command     = /^(adventure|adv|hunt|buruan|petualangan)$/i;
handler.description = "Berpetualang dan melawan monster";
handler.register    = true;

export default handler;
