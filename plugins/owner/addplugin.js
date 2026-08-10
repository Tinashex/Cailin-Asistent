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

let handler = async (m, { kyu, ctx, args, text, prefix }) => {
  try {
    const code = (m.quoted?.text || ctx.quoted?.text || '').trim();
    if (!code) return m.reply('❌ Balas pesan yang berisi kode plugin.');

    
    if (!code.includes('export default handler')) {
      return m.reply(
        '❌ *Format plugin tidak sesuai!*\n\n' +
        'Plugin wajib menggunakan format `handler` function:\n\n' +
        '```js\n' +
        'let handler = async (m, { kyu, db, args, text }) => {\n' +
        '  // logic\n' +
        '};\n\n' +
        'handler.help        = [\'nama\'];\n' +
        'handler.tags        = [\'tools\'];\n' +
        'handler.command     = /^nama$/i;\n' +
        'handler.description = \'Deskripsi\';\n\n' +
        'export default handler;\n' +
        '```'
      );
    }

    if (!/handler\.command\s*=/.test(code)) {
      return m.reply('❌ *Format plugin tidak sesuai!* Wajib menyertakan `handler.command = /^cmd$/i`.');
    }

    const inputName = (text || args[0] || '').trim();
    if (!inputName) return m.reply(`⚡ *Format:* ${prefix}addplugin [nama_file/folder_file]\n*Contoh:* ${prefix}addplugin tools/myplugin.js`);

    let filename = inputName.endsWith('.js') ? inputName : `${inputName.toLowerCase()}.js`;
    const pluginsDir = path.resolve(process.cwd(), 'plugins');
    const targetPath = path.resolve(pluginsDir, filename);

    
    if (!targetPath.startsWith(pluginsDir)) {
      return m.reply('❌ Path file tidak valid!');
    }

    const parentDir = path.dirname(targetPath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }

    const isOverwrite = fs.existsSync(targetPath);
    fs.writeFileSync(targetPath, code, 'utf8');

    const relativePath = path.relative(pluginsDir, targetPath);
    m.reply(
      `✅ Plugin *${relativePath}* berhasil ${isOverwrite ? 'diperbarui (ditimpa)' : 'ditambahkan'}!\n` +
      `🔥 Hot-reload aktif, plugin langsung siap digunakan.`
    );
  } catch (e) {
    m.reply(`❌ Gagal menyimpan plugin: ${e.message}`);
  }
};

handler.help        = ["addplugin", "addcommand", "tambahplugin", "saveplugin", "sp"];
handler.tags        = ["owner"];
handler.command     = /^(addplugin|addcommand|tambahplugin|saveplugin|sp)$/i;
handler.description = "Menambahkan atau menimpa file plugin (wajib format handler)";
handler.owner       = true;

export default handler;
