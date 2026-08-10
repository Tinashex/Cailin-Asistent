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
import { promisify } from 'util';
import axios from 'axios';
import { simpleQuoted } from '../../lib/fakeQuoted.js';

const execAsync = promisify(exec);

function extractYtId(input) {
  const match = input.match(/(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/live\/)([\w-]{6,})/);
  return match ? `https://www.youtube.com/watch?v=${match[2]}` : input;
}

async function dlBuffer(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return Buffer.from(await r.arrayBuffer());
}

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
  if (!ctx.args.length) return ctx.reply('❌ Masukkan link YouTube.');
  const isVoice = ctx.args[0]?.toLowerCase() === 'voice';
  const ytUrl = extractYtId(ctx.args[isVoice ? 1 : 0] || '');
  if (!ytUrl.includes('youtube.com/')) return ctx.reply('❌ Link YouTube tidak valid.');

  m.reply(global.msg?.wait || global.mess?.wait || '⏳ Memulai download audio...');
  try {
    const apiUrl = global.API ? global.API('kyzz', '/api/download/ytmp3', { url: ytUrl }, 'apikey')
      : `https://api.kyzzz.eu.cc/api/download/ytmp3?url=${encodeURIComponent(ytUrl)}&apikey=${global.kyzzKey || 'kyuujir'}`;

    const { data } = await axios.get(apiUrl).catch(() => ({ data: null }));
    let audioUrl = data?.result?.downloadUrl || data?.result?.url || data?.downloadUrl;
    let title = data?.result?.title || 'YouTube Audio';

    if (!audioUrl) {
      
      const pollRes = await fetch(`https://youtubedl.siputzx.my.id/download?type=audio&url=${encodeURIComponent(ytUrl)}`);
      const pollData = await pollRes.json();
      audioUrl = pollData.fileUrl || pollData.file_url;
      title = pollData.title || title;
      if (!audioUrl?.startsWith('http')) audioUrl = `https://youtubedl.siputzx.my.id${audioUrl}`;
    }

    const mp3Buf = await dlBuffer(audioUrl);
    const time = Date.now();
    const tmpDir = './tmp/audio';
    fs.mkdirSync(tmpDir, { recursive: true });
    const mp3Path = path.join(tmpDir, `${time}.mp3`);
    fs.writeFileSync(mp3Path, mp3Buf);

    if (isVoice) {
      const oggPath = path.join(tmpDir, `${time}.ogg`);
      await execAsync(`ffmpeg -i "${mp3Path}" -avoid_negative_ts make_zero -ac 1 -c:a libopus "${oggPath}"`);
      await kyu.sendMessage(ctx.id, { audio: fs.readFileSync(oggPath), mimetype: 'audio/ogg; codecs=opus', ptt: true }, { quoted: simpleQuoted(ctx) });
      if (fs.existsSync(oggPath)) fs.unlinkSync(oggPath);
    } else {
      await kyu.sendMessage(ctx.id, {
        document: mp3Buf,
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`,
        caption: `🎵 *YouTube Audio*\n\n📌 Title: ${title}\n🔗 Link: ${ytUrl}`
      }, { quoted: simpleQuoted(ctx) });
    }

    if (fs.existsSync(mp3Path)) fs.unlinkSync(mp3Path);
  } catch (e) {
    ctx.reply(`❌ Gagal download ytmp3: ${e.message}`);
  }
};

handler.help        = ["ytmp3", "ytm3", "ytaudio"];
handler.tags        = ["downloader"];
handler.command     = /^(ytmp3|ytm3|ytaudio)$/i;
handler.description = "Download audio dari YouTube (MP3)";

export default handler;
