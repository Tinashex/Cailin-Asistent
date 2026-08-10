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
  const sock = kyu || ctx?.conn;
  const targetUrl = (ctx.query || text || '').trim();

  if (!targetUrl) {
    return ctx.reply(`❌ Masukkan URL yang valid!\n*Contoh:* ${prefix}${command} https://api.kyzzz.eu.cc`);
  }

  if (!/^https?:\/\//i.test(targetUrl)) {
    return ctx.reply(`❌ Awali URL dengan http:// atau https://`);
  }

  try {
    const res = await axios.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0 Safari/537.36',
      },
      responseType: 'arraybuffer',
      maxRedirects: 5,
      timeout: 30000,
    });

    const contentType = (res.headers['content-type'] || res.headers['Content-Type'] || '').toString();
    const dataBuffer = Buffer.from(res.data);

    
    if (/json/i.test(contentType)) {
      try {
        const jsonData = JSON.parse(dataBuffer.toString('utf8'));
        const formattedJson = JSON.stringify(jsonData, null, 2);
        return ctx.reply(`\`\`\`json\n${formattedJson.slice(0, 3900)}\n\`\`\``);
      } catch (_) {
        return ctx.reply(dataBuffer.toString('utf8').slice(0, 4000));
      }
    }

    
    if (/text/i.test(contentType)) {
      return ctx.reply(dataBuffer.toString('utf8').slice(0, 4000));
    }

    
    if (/image/i.test(contentType) || /\.(png|jpe?g|gif|webp)$/i.test(targetUrl)) {
      return sock.sendMessage(m.chat || ctx.id, {
        image: dataBuffer,
        caption: `🖼️ *GET Image Result*\n• Content-Type: ${contentType || 'image'}\n• Size: ${(dataBuffer.length / 1024).toFixed(2)} KB`
      }, { quoted: simpleQuoted(ctx) });
    }

    
    if (/video/i.test(contentType) || /\.(mp4|mkv|mov|avi)$/i.test(targetUrl)) {
      return sock.sendMessage(m.chat || ctx.id, {
        video: dataBuffer,
        caption: `🎥 *GET Video Result*\n• Content-Type: ${contentType || 'video'}\n• Size: ${(dataBuffer.length / 1024).toFixed(2)} KB`
      }, { quoted: simpleQuoted(ctx) });
    }

    
    if (/audio/i.test(contentType) || /\.(mp3|wav|ogg|m4a)$/i.test(targetUrl)) {
      return sock.sendMessage(m.chat || ctx.id, {
        audio: dataBuffer,
        mimetype: contentType || 'audio/mp4',
        ptt: false
      }, { quoted: simpleQuoted(ctx) });
    }

    
    const fileName = targetUrl.split('/').pop()?.split('?')[0] || `file_${Date.now()}`;
    return sock.sendMessage(m.chat || ctx.id, {
      document: dataBuffer,
      fileName,
      mimetype: contentType || 'application/octet-stream',
      caption: `📁 *GET Document Result*\n• File Name: ${fileName}\n• Content-Type: ${contentType || 'octet-stream'}\n• Size: ${(dataBuffer.length / 1024).toFixed(2)} KB`
    }, { quoted: simpleQuoted(ctx) });

  } catch (error) {
    const errMsg = error.response ? `HTTP ${error.response.status} ${error.response.statusText}` : error.message;
    return ctx.reply(`❌ Terjadi kesalahan saat mengakses URL:\n${errMsg}`);
  }
};

handler.help        = ["axiosget", "get", "fetchget", "fetch"];
handler.tags        = ["tools"];
handler.command     = /^(axiosget|get|fetchget|fetch)$/i;
handler.description = "Mengambil data atau file dari URL (GET Request)";

export default handler;
