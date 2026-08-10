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

import axios from 'axios';
import { simpleQuoted } from '../../lib/fakeQuoted.js';

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
  if (!ctx.args.length) return ctx.reply('❌ Masukkan nama channel/username YouTube.\nContoh: *.ytstalk PewDiePie*');

  m.reply(global.msg?.wait || global.mess?.wait || '⏳ Sedang mencari channel YouTube...');
  try {
    const apiUrl = global.API ? global.API('kyzz', '/api/stalk/ytstalk', { username: ctx.query }, 'apikey')
      : `https://api.kyzzz.eu.cc/api/stalk/ytstalk?username=${encodeURIComponent(ctx.query)}&apikey=${global.kyzzKey || 'kyuujir'}`;

    const { data } = await axios.get(apiUrl).catch(() => ({ data: null }));
    const ch = data?.result || data?.data;

    if (!ch) return ctx.reply('❌ Channel YouTube tidak ditemukan.');

    const caption = `📺 *YouTube Stalker*\n\n` +
      `📌 Channel: ${ch.channelName || ch.name || '-'}\n` +
      `👥 Subscribers: ${ch.subscribers || ch.subscriberCount || '-'}\n` +
      `🎬 Total Videos: ${ch.videoCount || ch.videos || '-'}\n` +
      `👁️ Total Views: ${ch.views || ch.viewCount || '-'}\n` +
      `📝 Description: ${(ch.description || '-').slice(0, 200)}...`;

    const avatarUrl = ch.avatar || ch.profile || ch.thumbnail;

    if (avatarUrl) {
      await kyu.sendMessage(ctx.id, {
        image: { url: avatarUrl },
        caption: caption
      }, { quoted: simpleQuoted(ctx) });
    } else {
      await kyu.sendMessage(ctx.id, { text: caption }, { quoted: simpleQuoted(ctx) });
    }
  } catch (e) {
    ctx.reply(`❌ Gagal stalk YouTube: ${e.message}`);
  }
};

handler.help        = ["ytstalk", "youtubestalk"];
handler.tags        = ["stalker"];
handler.command     = /^(ytstalk|youtubestalk)$/i;
handler.description = "Stalk channel YouTube via Kyzz API";

export default handler;
