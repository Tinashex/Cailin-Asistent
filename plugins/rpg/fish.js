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

const FISH_TABLE = [
  { key: 'anchovy',    name: 'Ikan Teri',   emoji: '🐟', chance: 0.50, expMin: 5,  expMax: 10 },
  { key: 'catfish',    name: 'Lele',         emoji: '🐟', chance: 0.45, expMin: 6,  expMax: 12 },
  { key: 'carp',       name: 'Mas',          emoji: '🐡', chance: 0.35, expMin: 8,  expMax: 15 },
  { key: 'tuna',       name: 'Tuna',         emoji: '🐠', chance: 0.20, expMin: 15, expMax: 25 },
  { key: 'salmon',     name: 'Salmon',       emoji: '🐟', chance: 0.18, expMin: 15, expMax: 28 },
  { key: 'swordfish',  name: 'Ikan Pedang',  emoji: '🗡️', chance: 0.10, expMin: 25, expMax: 40 },
  { key: 'squid',      name: 'Cumi',         emoji: '🦑', chance: 0.15, expMin: 12, expMax: 20 },
  { key: 'shrimp',     name: 'Udang',        emoji: '🦐', chance: 0.30, expMin: 8,  expMax: 15 },
  { key: 'clownfish',  name: 'Ikan Badut',   emoji: '🐠', chance: 0.08, expMin: 20, expMax: 35 },
  { key: 'pufferfish', name: 'Ikan Buntal',  emoji: '🐡', chance: 0.05, expMin: 30, expMax: 50 },
];

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
    db.ensureUser(ctx.sender, ctx.pushname);
    const user = global.db.user[ctx.sender];
    const now = Date.now();
    const cd = 20 * 60 * 1000;

    if (user.cooldown.fish && now - user.cooldown.fish < cd) {
      const sisa = cd - (now - user.cooldown.fish);
      const m = Math.floor(sisa / 60000);
      const s = Math.floor((sisa % 60000) / 1000);
      return ctx.reply(`⏳ Umpan kamu belum siap lagi!\n🕐 Cooldown: *${m}m ${s}d*`);
    }

    if (user.inventory.nature.bait <= 0) {
      return ctx.reply(`🪱 Kamu tidak punya *umpan*!\nBeli umpan di toko dengan *.toko*`);
    }

    const premRod = user.inventory.tools.rod_premium > 0;
    const woodRod = user.inventory.tools.rod_wood > 0;
    const chanceMult = premRod ? 1.7 : woodRod ? 1.3 : 1.0;
    const rodLabel = premRod ? 'Joran Premium' : woodRod ? 'Joran Kayu' : 'Tangan kosong';

    user.inventory.nature.bait -= 1;

    const hasil = [];
    let totalExp = 0;

    for (const fish of FISH_TABLE) {
      if (Math.random() < fish.chance * chanceMult) {
        user.inventory.fish[fish.key] += 1;
        const exp = fish.expMin + Math.floor(Math.random() * (fish.expMax - fish.expMin));
        totalExp += exp;
        hasil.push(`${fish.emoji} ${fish.name}`);
      }
    }

    if (hasil.length === 0) {
      return ctx.reply(`🎣 Tidak ada yang makan umpan kamu...\n✨ EXP +1\n🪱 Umpan sisa: ${user.inventory.nature.bait}`);
    }

    user.exp += totalExp;
    user.cooldown.fish = now;
    db.write(global.db);

    await ctx.reply(
      `╭─〔 *MANCING* 〕─⬿\n` +
      `│\n` +
      `│ 🎣 ${rodLabel}\n` +
      `│\n` +
      `│ Hasil tangkapan:\n` +
      hasil.map(h => `│  • ${h}`).join('\n') + '\n' +
      `│\n` +
      `│ ✨ EXP +${totalExp}\n` +
      `│ 🪱 Umpan sisa: ${user.inventory.nature.bait}\n` +
      `╰─〔 ${global.bot?.name} RPG 〕─⬿`
    );
  
};

handler.help        = ["fish","mancing","fishing","pancing"];
handler.tags        = ["rpg"];
handler.command     = /^(fish|mancing|fishing|pancing)$/i;
handler.description = "Mancing ikan di sungai atau laut";
handler.register    = true;

export default handler;
