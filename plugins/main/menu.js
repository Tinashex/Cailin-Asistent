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
import os from 'os';
import { runtime, fetchBuffer } from '../../core/tools.js';
import { contactQuoted } from '../../lib/fakeQuoted.js';
import { prepareWAMessageMedia } from '@whiskeysockets/baileys';

const categoryEmojis = {
  ai: '🤖',
  cecan: '👧',
  downloader: '📥',
  ephoto: '🎨',
  main: '📌',
  maker: '🛠️',
  owner: '👑',
  random: '🎲',
  rpg: '🎮',
  search: '🔍',
  stalker: '🕵️',
  tools: '🔧'
};

const getEmoji = (cat) => categoryEmojis[cat.toLowerCase()] || '📌';

const formatUptime = (seconds) => {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(' ');
};

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
  try {
    const categories = global.loader?.getCommandsByCategory?.() || {};
    const totalFitur = Object.values(categories).flat().length;
    const sender = m.sender || ctx.sender || '';
    const no = sender.split('@')[0] || 'User';
    const userData = global.db?.user?.[sender];
    const botName = global.botname || global.bot?.name || 'Cailin Assistant';
    const prfx = `[ ${prefix || '.'} ]`;
    const sub = (args[0] || text || '').toLowerCase().trim();

    const isOwner = ctx.isOwner;
    const isPremium = userData?.premium?.status === true;
    const statusStr = isOwner ? 'ᴏᴡɴᴇʀ' : isPremium ? 'ᴘʀᴇᴍɪᴜᴍ' : 'ғʀᴇᴇ ᴜsᴇʀ';
    const modeStr = 'ᴘᴜʙʟɪᴄ';

    const botUptime = process.uptime();
    const serverUptime = os.uptime();
    const uptimeStr = formatUptime(botUptime);
    const serverUptimeStr = formatUptime(serverUptime);

    const formatSection = (catName, cmds) => {
      if (!cmds?.length) return '';
      const emoji = getEmoji(catName);
      const sortedCmds = [...cmds].sort((a, b) => a.name.localeCompare(b.name));
      const lines = sortedCmds.map((cmd, i) => {
        if (sortedCmds.length === 1) return `  ╰─ ${prefix}${cmd.name}`;
        if (i === 0) return `  ╭─ ${prefix}${cmd.name}`;
        if (i === sortedCmds.length - 1) return `  ╰─ ${prefix}${cmd.name}`;
        return `  ├─ ${prefix}${cmd.name}`;
      });
      return `┌─「 ${emoji} *${catName.toUpperCase()}* 」\n${lines.join('\n')}\n└──────────────⊹`;
    };

    let menuText = '';

    if (sub === 'all') {
      menuText = `ʜᴀɪ @${no}, ɪɴɪ sᴇᴍᴜᴀ ғɪᴛᴜʀ *${botName}* 👋\n\n` +
        `◦ sᴛᴀᴛᴜs       : *${statusStr}*\n` +
        `◦ ᴜᴘᴛɪᴍᴇ       : ${uptimeStr}\n` +
        `◦ sᴇʀᴠᴇʀ ᴜᴘᴛɪᴍᴇ : ${serverUptimeStr}\n` +
        `◦ ᴍᴏᴅᴇ         : ${modeStr}\n` +
        `◦ ᴘʀᴇғɪx       : ${prfx}\n\n`;

      for (const cat of Object.keys(categories).sort()) {
        menuText += formatSection(cat, categories[cat]) + '\n\n';
      }
      menuText += `*Total:* ${totalFitur} Commands`;
    } else if (sub && categories[sub]) {
      menuText = `ʜᴀɪ @${no}\n\n` +
        `◦ sᴛᴀᴛᴜs       : *${statusStr}*\n` +
        `◦ ᴜᴘᴛɪᴍᴇ       : ${uptimeStr}\n` +
        `◦ sᴇʀᴠᴇʀ ᴜᴘᴛɪᴍᴇ : ${serverUptimeStr}\n` +
        `◦ ᴍᴏᴅᴇ         : ${modeStr}\n` +
        `◦ ᴘʀᴇғɪx       : ${prfx}\n\n` +
        `${formatSection(sub, categories[sub])}`;
    } else {
      
      const catList = Object.keys(categories).sort().map(cat => `  ${getEmoji(cat)} *${cat.toUpperCase()}*`).join('\n');

      menuText = `ʜᴀɪ @${no}, ᴡᴇʟᴄᴏᴍᴇ ᴛᴏ *${botName}* 👋\n\n` +
        `◦ sᴛᴀᴛᴜs       : *${statusStr}*\n` +
        `◦ ᴜᴘᴛɪᴍᴇ       : ${uptimeStr}\n` +
        `◦ sᴇʀᴠᴇʀ ᴜᴘᴛɪᴍᴇ : ${serverUptimeStr}\n` +
        `◦ ᴍᴏᴅᴇ         : ${modeStr}\n` +
        `◦ ᴘʀᴇғɪx       : ${prfx}\n\n` +
        `📋 *DAFTAR KATEGORI*\n${catList}\n\n` +
        `ᴘɪʟɪʜ ᴋᴀᴛᴇɢᴏʀɪ ᴅɪ ᴛᴏᴍʙᴏʟ ʙᴀᴡᴀʜ, ᴀᴛᴀᴜ ᴋᴇᴛɪᴋ:\n${prefix}menu <kategori>\n${prefix}menu all`;
    }

    
    if (!global._menuMediaCache) {
      let videoMediaInput;
      if (fs.existsSync('./media/menu.mp4')) {
        videoMediaInput = { video: fs.readFileSync('./media/menu.mp4'), gifPlayback: true };
      } else if (fs.existsSync('./media/menu.gif')) {
        videoMediaInput = { video: fs.readFileSync('./media/menu.gif'), gifPlayback: true };
      } else {
        videoMediaInput = {
          video: {
            url: 'https://mmg.whatsapp.net/v/t62.7161-24/560749001_977920488576019_1319326753655037576_n.enc?ccb=11-4&oh=01_Q5Aa5AFON-YAkwu2UJjeydjt0G5PSy3_DmuWivIXsjZGJm2k2A&oe=6A92C3B4&_nc_sid=5e03e0&mms3=true'
          },
          gifPlayback: true
        };
      }
      global._menuMediaCache = await prepareWAMessageMedia(videoMediaInput, { upload: kyu.waUploadToServer });
    }

    const RFz = global._menuMediaCache;

    const categoryRows = Object.keys(categories).sort().map(cat => ({
      header: `${getEmoji(cat)} ${cat.toUpperCase()}`,
      title: `Menu ${cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}`,
      description: `Lihat daftar perintah kategori ${cat}`,
      id: `${prefix}menu ${cat.toLowerCase()}`
    }));

    categoryRows.unshift({
      header: '🌐 ALL COMMANDS',
      title: 'Semua Menu',
      description: `Tampilkan seluruh ${totalFitur} perintah bot`,
      id: `${prefix}menu all`
    });

    const listMessage = {
      title: '📋 DAFTAR KATEGORI',
      sections: [{
        title: 'Pilih Kategori Menu',
        rows: categoryRows
      }]
    };

    const nativeButtons = [
      {
        name: "single_select",
        buttonParamsJson: JSON.stringify(listMessage)
      },
      {
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
          display_text: "Creator",
          url: "https://tiktok.com/@mommykyuu",
          merchant_url: "https://tiktok.com/@mommykyuu"
        })
      }
    ];

    const chatJid = m.chat || ctx.id;

    await kyu.relayMessage(
      chatJid, {
        interactiveMessage: {
          header: {
            title: `${botName} in here`,
            hasMediaAttachment: true,
            videoMessage: {
              ...RFz.videoMessage,
              gifPlayback: true
            }
          },
          body: { text: '' },
          footer: { text: menuText },
          contextInfo: {
            mentionedJid: [sender],
            forwardingScore: 999,
            isForwarded: true,
            ...(global.saluran || global.newsletterJid ? {
              forwardedNewsletterMessageInfo: {
                newsletterJid: global.saluran || global.newsletterJid,
                newsletterName: global.namaSaluran || global.botName || global.newsletterName,
                serverMessageId: 1
              }
            } : {})
          },
          nativeFlowMessage: {
            buttons: nativeButtons,
            messageParamsJson: JSON.stringify({
              limited_time_offer: {
                text: "momm? Yes, that's me.",
                url: "https://tiktok.com/@mommykyuu",
                copy_code: "mommykyuu",
                expiration_time: 4102444800
              }
            })
          }
        }
      }, {
        additionalNodes: [{
          tag: "biz",
          attrs: {},
          content: [{
            tag: "interactive",
            attrs: { type: "native_flow", v: "1" },
            content: [{
              tag: "native_flow",
              attrs: { v: "9", name: "mixed" }
            }]
          }]
        }]
      }
    );

    
    try {
      const audioPath = './media/menu.mp3';
      if (fs.existsSync(audioPath)) {
        await kyu.sendMessage(chatJid, {
          audio: { url: audioPath },
          mimetype: 'audio/mpeg',
          ptt: true
        }, { quoted: m });
      }
    } catch (_) {}

  } catch (e) {
    m.reply(`System Error: ${e.message}`);
  }
};

handler.help        = ["menu", "main", "help", "list"];
handler.tags        = ["main"];
handler.command     = /^(menu|main|help|list)$/i;
handler.description = "Menampilkan menu utama bot";

export default handler;