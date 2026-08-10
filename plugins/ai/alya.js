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
  if (!ctx.query) return ctx.reply('❌ Masukkan pertanyaan untuk Alya AI.\nContoh: *.alya hai Alya*');

  m.reply(global.msg?.wait || global.mess?.wait || '⏳ Sedang diproses, mohon tunggu...');
  try {
    const apiUrl = global.API ? global.API('kyzz', '/api/ai/alya', {
      message: ctx.query,
      session: ctx.sender
    }, 'apikey') : `https://api.kyzzz.eu.cc/api/ai/alya?message=${encodeURIComponent(ctx.query)}&session=${encodeURIComponent(ctx.sender)}&apikey=${global.kyzzKey || 'kyuujir'}`;

    const { data } = await axios.get(apiUrl);
    if (!data.status) return ctx.reply(data.message || '❌ Terjadi kesalahan pada Alya AI.');

    await kyu.sendMessage(ctx.id, {
      text: data.reply || data.result || 'Alya tidak memberikan jawaban.'
    }, { quoted: simpleQuoted(ctx) });
  } catch (e) {
    ctx.reply(`❌ Gagal menghubungi Alya AI: ${e.message}`);
  }
};

handler.help        = ["alya", "alyaai"];
handler.tags        = ["ai"];
handler.command     = /^(alya|alyaai)$/i;
handler.description = "Bicara dengan Alya AI via Kyzz API";

export default handler;
