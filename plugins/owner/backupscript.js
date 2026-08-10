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
import { exec } from 'child_process';
import util from 'util';
import { createReadStream } from 'fs';
import { simpleQuoted } from '../../lib/fakeQuoted.js';
const execAsync = util.promisify(exec);

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
    try {
      const root = process.cwd();
      const timestamp = Date.now();
      const backupDir = path.join(root, 'tmp');
      fs.mkdirSync(backupDir, { recursive: true });
      const zipPath = path.join(backupDir, `script-${timestamp}.zip`);
      await ctx.reply(global.msg?.wait || global.mess?.wait || '⏳ Sedang diproses, mohon tunggu...');
      await execAsync(`cd "${root}" && zip -r "${zipPath}" . -x "node_modules/*" "session/*" ".git/*" "tmp/*" "*.log"`);
      if (!fs.existsSync(zipPath)) return ctx.reply('❌ Backup gagal dibuat.');
      const chunks = [];
      for await (const chunk of createReadStream(zipPath)) chunks.push(chunk);
      await kyu.sendMessage(ctx.id, {
        document: Buffer.concat(chunks),
        fileName: `script-${timestamp}.zip`,
        mimetype: 'application/zip',
        caption: `📦 *Script Backup*\n⏰ ${new Date(timestamp).toLocaleString('id-ID')}` }, { quoted: simpleQuoted(ctx) });
      ctx.react('✅');
      fs.unlinkSync(zipPath);
    } catch (e) { ctx.reply(`❌ Error: ${e.message}`); }
  
};

handler.help        = ["backupscript","backup","scriptbackup"];
handler.tags        = ["owner"];
handler.command     = /^(backupscript|backup|scriptbackup)$/i;
handler.description = "Backup semua file script bot";
handler.owner       = true;

export default handler;
