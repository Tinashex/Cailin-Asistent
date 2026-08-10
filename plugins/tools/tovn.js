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
import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import { simpleQuoted } from '../../lib/fakeQuoted.js';

const execAsync = promisify(exec);

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
  const media = ctx.media || ctx.quoted?.media;
  const type = ctx.mediaType || ctx.quoted?.mediaType;

  if (!media || (type !== 'audio' && type !== 'video')) {
    return ctx.reply('❌ Reply atau kirim media audio/video untuk diubah menjadi voice note (vn).');
  }

  m.reply(global.msg?.wait || global.mess?.wait || '⏳ Mengkonversi ke Voice Note...');
  try {
    const stream = await downloadContentFromMessage(media, type);
    let chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    const inputBuf = Buffer.concat(chunks);

    const tmpDir = './tmp/audio';
    fs.mkdirSync(tmpDir, { recursive: true });
    const time = Date.now();
    const inputPath = path.join(tmpDir, `in_${time}.${type === 'video' ? 'mp4' : 'mp3'}`);
    const outputPath = path.join(tmpDir, `out_${time}.ogg`);

    fs.writeFileSync(inputPath, inputBuf);

    await execAsync(`ffmpeg -i "${inputPath}" -avoid_negative_ts make_zero -ac 1 -c:a libopus "${outputPath}"`);

    const opusBuf = fs.readFileSync(outputPath);

    await kyu.sendMessage(ctx.id, {
      audio: opusBuf,
      mimetype: 'audio/ogg; codecs=opus',
      ptt: true
    }, { quoted: simpleQuoted(ctx) });

    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
  } catch (e) {
    ctx.reply(`❌ Gagal konversi ke VN: ${e.message}`);
  }
};

handler.help        = ["tovn", "toaudio", "toptt"];
handler.tags        = ["tools"];
handler.command     = /^(tovn|toaudio|toptt)$/i;
handler.description = "Mengkonversi media audio/video menjadi Voice Note (PTT)";

export default handler;
