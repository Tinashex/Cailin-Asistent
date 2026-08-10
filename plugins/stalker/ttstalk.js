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
  if (!ctx.args.length) return ctx.reply('❌ Masukkan username TikTok.\nContoh: *.ttstalk khaby.lame*');

  const username = ctx.args[0].replace(/^@/, '');
  m.reply(global.msg?.wait || global.mess?.wait || '⏳ Sedang mencari profil TikTok...');
  try {
    const apiUrl = global.API ? global.API('kyzz', '/api/stalk/tiktok', { username }, 'apikey')
      : `https://api.kyzzz.eu.cc/api/stalk/tiktok?username=${encodeURIComponent(username)}&apikey=${global.kyzzKey || 'kyuujir'}`;

    const { data } = await axios.get(apiUrl).catch(() => ({ data: null }));
    const user = data?.result || data?.data;

    if (!user) return ctx.reply('❌ Username TikTok tidak ditemukan.');

    const caption = `👤 *TikTok Stalker*\n\n` +
      `🏷️ Name: ${user.nickname || user.name || '-'}\n` +
      `📌 Username: @${user.uniqueId || user.username || username}\n` +
      `👥 Followers: ${(user.followers || user.followerCount || 0).toLocaleString('id-ID')}\n` +
      `👣 Following: ${(user.following || user.followingCount || 0).toLocaleString('id-ID')}\n` +
      `❤️ Likes: ${(user.likes || user.heartCount || 0).toLocaleString('id-ID')}\n` +
      `🎬 Videos: ${(user.videoCount || 0).toLocaleString('id-ID')}\n` +
      `📝 Bio: ${user.signature || user.bio || '-'}`;

    const avatarUrl = user.avatarLarger || user.avatarMedium || user.avatar || user.pp;

    if (avatarUrl) {
      await kyu.sendMessage(ctx.id, {
        image: { url: avatarUrl },
        caption: caption
      }, { quoted: simpleQuoted(ctx) });
    } else {
      await kyu.sendMessage(ctx.id, { text: caption }, { quoted: simpleQuoted(ctx) });
    }
  } catch (e) {
    ctx.reply(`❌ Gagal stalk TikTok: ${e.message}`);
  }
};

handler.help        = ["ttstalk", "tiktokstalk"];
handler.tags        = ["stalker"];
handler.command     = /^(ttstalk|tiktokstalk)$/i;
handler.description = "Stalk profil pengguna TikTok via Kyzz API";

export default handler;
