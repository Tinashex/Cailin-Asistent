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

import fs from 'fs';
import path from 'path';
import { createReadStream } from 'fs';
import { simpleQuoted } from '../../lib/fakeQuoted.js';

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
    try {
      const dbPath = path.join(process.cwd(), 'data/database.json');
      if (!fs.existsSync(dbPath)) return ctx.reply('❌ Database tidak ditemukan.');
      const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      const users = Object.keys(dbData.user || {}).length;
      const groups = Object.keys(dbData.group || {}).length;
      const timestamp = Date.now();
      const backupDir = path.join(process.cwd(), 'tmp/other');
      fs.mkdirSync(backupDir, { recursive: true });
      const backupPath = path.join(backupDir, `db-${timestamp}.json`);
      fs.writeFileSync(backupPath, JSON.stringify(dbData, null, 2));
      const chunks = [];
      for await (const chunk of createReadStream(backupPath)) chunks.push(chunk);
      await kyu.sendMessage(ctx.id, {
        document: Buffer.concat(chunks),
        fileName: `database-${timestamp}.json`,
        mimetype: 'application/json',
        caption: `📊 *Database Backup*\n👤 Users: ${users}\n🏠 Groups: ${groups}` }, { quoted: simpleQuoted(ctx) });
      ctx.react('✅');
      fs.unlinkSync(backupPath);
    } catch (e) { ctx.reply(`❌ Error: ${e.message}`); }
  
};

handler.help        = ["backupdb","backupdatabase","dbbackup"];
handler.tags        = ["owner"];
handler.command     = /^(backupdb|backupdatabase|dbbackup)$/i;
handler.description = "Backup database bot";
handler.owner       = true;

export default handler;
