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

const WEAPONS = ['sword_stone', 'sword_iron', 'sword_diamond', 'sword_light', 'sword_dark'];
const ARMORS  = ['armor_leather', 'armor_iron', 'armor_crystal'];

const WEAPON_BONUS = {
  sword_stone:   5,  sword_iron:    12, sword_diamond: 22,
  sword_light:   35, sword_dark:    40,
};
const ARMOR_BONUS = {
  armor_leather: 3,  armor_iron:    8,  armor_crystal: 18,
};

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
    db.ensureUser(ctx.sender, ctx.pushname);
    const user = global.db.user[ctx.sender];
    const cmd = ctx.cmd;
    const itemKey = ctx.args[0]?.toLowerCase().replace(/ /g, '_');

    if (!user.equipped) user.equipped = { weapon: null, armor: null };

    if (cmd === 'unequip' || cmd === 'lepas') {
      const slot = ctx.args[0]?.toLowerCase();
      if (slot === 'weapon' || slot === 'senjata') {
        user.equipped.weapon = null;
        db.write(global.db);
        return ctx.reply(`✅ Senjata dilepas.`);
      }
      if (slot === 'armor' || slot === 'zirah') {
        user.equipped.armor = null;
        db.write(global.db);
        return ctx.reply(`✅ Armor dilepas.`);
      }
      return ctx.reply(`Gunakan: *.lepas weapon* atau *.lepas armor*`);
    }

    if (!itemKey) {
      const wpn = user.equipped.weapon;
      const arm = user.equipped.armor;
      return ctx.reply(
        `╭─〔 *EQUIPMENT* 〕─⬿\n` +
        `│\n` +
        `│ ⚔️ Senjata : ${wpn ? `${wpn.replace(/_/g,'  ')} (+${WEAPON_BONUS[wpn] || 0} ATK)` : 'Kosong'}\n` +
        `│ 🛡️ Armor   : ${arm ? `${arm.replace(/_/g,'  ')} (+${ARMOR_BONUS[arm] || 0} DEF)` : 'Kosong'}\n` +
        `│\n` +
        `│ Cara pasang: *.equip [item]*\n` +
        `│ Cara lepas : *.lepas weapon/armor*\n` +
        `╰─〔 ${global.bot?.name} RPG 〕─⬿`
      );
    }

    if (WEAPONS.includes(itemKey)) {
      if ((user.inventory.weapon[itemKey] || 0) <= 0) {
        return ctx.reply(`❌ Kamu tidak punya *${itemKey.replace(/_/g, ' ')}*!`);
      }
      user.equipped.weapon = itemKey;
      db.write(global.db);
      return ctx.reply(`⚔️ Senjata *${itemKey.replace(/_/g, ' ')}* dipasang! (+${WEAPON_BONUS[itemKey]} ATK)`);
    }

    if (ARMORS.includes(itemKey)) {
      if ((user.inventory.armor[itemKey] || 0) <= 0) {
        return ctx.reply(`❌ Kamu tidak punya *${itemKey.replace(/_/g, ' ')}*!`);
      }
      user.equipped.armor = itemKey;
      db.write(global.db);
      return ctx.reply(`🛡️ Armor *${itemKey.replace(/_/g, ' ')}* dipasang! (+${ARMOR_BONUS[itemKey]} DEF)`);
    }

    ctx.reply(`❌ Item *${itemKey}* bukan senjata atau armor yang valid!`);
  
};

handler.help        = ["equip","pasang","unequip","lepas"];
handler.tags        = ["rpg"];
handler.command     = /^(equip|pasang|unequip|lepas)$/i;
handler.description = "Pasang/lepas senjata atau armor. Contoh: .equip sword_iron";
handler.register    = true;

export default handler;
