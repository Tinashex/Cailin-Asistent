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

const formatTime = (timestamp) => {
  const d = new Date(timestamp);
  return `${String(d.getHours()).padStart(2, '0')}.${String(d.getMinutes()).padStart(2, '0')}`;
};

const formatPhone = (jid = '') => {
  const num = jid.split('@')[0];
  if (!num.startsWith('62')) return `+${num}`;
  const rest = num.slice(2);
  return rest.length >= 9
    ? `+62 ${rest.slice(0, 3)}-${rest.slice(3, 7)}-${rest.slice(7)}`
    : `+62 ${rest}`;
};

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
  const q = ctx.quoted;
  if (!q) return ctx.reply(`❌ Reply pesan yang ingin dijadikan QWA.\nContoh: Reply pesan lalu ketik *.qwa*`);

  m.reply(global.msg?.wait || global.mess?.wait || '⏳ Sedang diproses, mohon tunggu...');
  try {
    let senderAvatar = '';
    try {
      senderAvatar = await kyu.profilePictureUrl(q.sender, 'image');
    } catch (_) {}

    let displayName = q.pushname || q.name || q.sender?.split('@')[0] || 'User';
    if (!displayName.startsWith('~')) displayName = `~ ${displayName}`;

    let senderImage = '';
    let messageText = q.text || q.caption || '';

    if (q.media) {
      const stream = await downloadContentFromMessage(q.media, 'image');
      let buffer = Buffer.alloc(0);
      for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
      senderImage = `data:image/jpeg;base64,${buffer.toString('base64')}`;
      messageText = q.caption || '';
    }

    const res = await fetch('https://qwa.eeq.my.id/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender_name: displayName,
        sender_number: formatPhone(q.sender),
        sender_avatar: senderAvatar,
        sender_image: senderImage,
        message: messageText,
        time: formatTime(Date.now()),
        background: true
      })
    });

    if (!res.ok) throw new Error(await res.text());

    const imageBuffer = Buffer.from(await res.arrayBuffer());

    await kyu.sendMessage(ctx.id, {
      image: imageBuffer,
      caption: "✅ *WhatsApp Chat Quote*\nBerhasil dibuat!"
    }, { quoted: simpleQuoted(ctx) });
  } catch (error) {
    ctx.reply(`❌ Gagal membuat QWA: ${error.message}`);
  }
};

handler.help        = ["qwa", "waquote"];
handler.tags        = ["maker"];
handler.command     = /^(qwa|waquote)$/i;
handler.description = "Membuat WhatsApp chat bubble quote dari pesan yang di-reply";

export default handler;
