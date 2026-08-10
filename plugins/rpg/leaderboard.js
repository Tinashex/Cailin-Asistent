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
    const users = Object.entries(global.db?.user || {})
      .filter(([, u]) => u.level && u.name)
      .sort((a, b) => b[1].level - a[1].level || b[1].exp - a[1].exp)
      .slice(0, 10);

    if (users.length === 0) return ctx.reply('Belum ada pemain RPG terdaftar!');

    const medals = ['🥇', '🥈', '🥉'];
    let lbText = `╭─〔 *TOP PLAYER RPG* 〕─⬿\n│\n`;

    users.forEach(([jid, u], i) => {
      const medal = medals[i] || `${i + 1}.`;
      lbText += `│ ${medal} *${u.name}*\n│    Lv ${u.level} | EXP ${u.exp} | 💰 ${u.money.toLocaleString('id-ID')}\n│\n`;
    });

    lbText += `╰─〔 ${global.bot?.name} RPG 〕─⬿`;
    await m.reply(lbText);
  
};

handler.help        = ["leaderboard","lb","top","ranking","topplayer"];
handler.tags        = ["rpg"];
handler.command     = /^(leaderboard|lb|top|ranking|topplayer)$/i;
handler.description = "Lihat papan peringkat RPG";

export default handler;
