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

import { simpleQuoted } from '../../lib/fakeQuoted.js';

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
    if (!ctx.args.length) return ctx.reply('❌ Masukkan link MediaFire.');
    m.reply(global.msg?.wait || global.mess?.wait || '⏳ Sedang diproses, mohon tunggu...');
    try {
      const { default: mediafireDl } = await import('../../lib/mediafire.js');
      const result = await mediafireDl(ctx.args[0]);
      await kyu.sendMessage(ctx.id, {
        document: { url: result.downloadUrl }, fileName: result.filename, mimetype: 'application/octet-stream',
        caption: `⬢ *MediaFire Downloader*\n\n⟡ File: ${result.filename}\n⟡ Size: ${result.filesize}` }, { quoted: simpleQuoted(ctx) });
    } catch (e) { ctx.reply(`❌ Gagal: ${e.message}`); }
  
};

handler.help        = ["mediafire","mf","mediafiredl","mfdown"];
handler.tags        = ["downloader"];
handler.command     = /^(mediafire|mf|mediafiredl|mfdown)$/i;
handler.description = "Download file dari MediaFire";

export default handler;
