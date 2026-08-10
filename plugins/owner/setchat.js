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
    try {
      if (!ctx.args.length) return ctx.reply(`⚡ Format: ${ctx.prefix}setchat [ban/unban/list] [jid]`);
      const action = ctx.args[0].toLowerCase();
      if (action === 'list') {
        const banned = Object.entries(global.db.group || {}).filter(([, d]) => d.bans === true).map(([jid]) => jid.split('@')[0]);
        if (!banned.length) return ctx.reply('📋 Tidak ada yang diban.');
        return ctx.reply('🚫 *Terban:*\n' + banned.map(j => `• ${j}`).join('\n'));
      }
      if (ctx.args.length < 2) return ctx.reply(`📌 Format: ${ctx.prefix}setchat ban 1234567890@g.us`);
      let chatId = ctx.args[1];
      if (!chatId.endsWith('@g.us')) chatId += '@g.us';
      if (!global.db.group[chatId]) global.db.group[chatId] = { from: chatId, config: {}, bans: false };
      const id = chatId.split('@')[0];
      if (action === 'ban') { global.db.group[chatId].bans = true; ctx.reply(`🚫 ${id} dibanned`); }
      else if (action === 'unban') { global.db.group[chatId].bans = false; ctx.reply(`✅ ${id} diunban`); }
      db.write(global.db);
    } catch (e) { ctx.reply(`❌ Error: ${e.message}`); }
  
};

handler.help        = ["setchat","setgroup","groupban"];
handler.tags        = ["owner"];
handler.command     = /^(setchat|setgroup|groupban)$/i;
handler.description = "Set status chat/grup (ban/unban)";
handler.owner       = true;

export default handler;
