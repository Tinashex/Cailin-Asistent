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

import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import { simpleQuoted } from '../../lib/fakeQuoted.js';

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
  const q = ctx.quoted;
  if (!q) return ctx.reply('❌ Reply pesan view-once (foto / video / audio / dokumen).');

  const msg = q.message || q;
  const media = msg.imageMessage || msg.videoMessage || msg.audioMessage || msg.documentMessage || msg.viewOnceMessage?.message?.imageMessage || msg.viewOnceMessage?.message?.videoMessage;

  if (!media) return ctx.reply('❌ Media view-once tidak ditemukan pada pesan yang di-reply.');

  m.reply(global.msg?.wait || global.mess?.wait || '⏳ Sedang membuka view-once...');
  try {
    const mime = media.mimetype || 'image/jpeg';
    let type = 'image';
    if (mime.startsWith('video/')) type = 'video';
    else if (mime.startsWith('audio/')) type = 'audio';
    else if (mime.startsWith('document/')) type = 'document';

    const stream = await downloadContentFromMessage(media, type);
    let chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);

    const caption = media.caption || '🔓 *View-once Berhasil Dibuka*';

    await kyu.sendMessage(ctx.id, {
      [type]: buffer,
      mimetype: mime,
      caption: caption
    }, { quoted: simpleQuoted(ctx) });
  } catch (e) {
    ctx.reply(`❌ Gagal membuka ViewOnce: ${e.message}`);
  }
};

handler.help        = ["rvo", "readviewonce", "rv"];
handler.tags        = ["tools"];
handler.command     = /^(rvo|readviewonce|rv)$/i;
handler.description = "Membuka dan menyimpan media ViewOnce yang di-reply";

export default handler;
