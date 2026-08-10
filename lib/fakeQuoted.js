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

import '../core/config.js';


export const contactQuoted = (ctx) => {
  return {
    key: {
      participant: '0@s.whatsapp.net',
      remoteJid: 'status@broadcast',
    },
    message: {
      contactMessage: {
        displayName: '─ ' + (global.bot?.name || 'Bot'),
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;${global.bot?.name || 'Bot'};;;\nFN:${global.bot?.name || 'Bot'}\nitem1.TEL;waid=${global.bot?.author?.number || '628000000000'}:+${global.bot?.author?.number || '628000000000'}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
        sendEphemeral: true,
      },
    },
  };
};

export const locationQuoted = (ctx) => {
  return {
    key: {
      participant: '0@s.whatsapp.net',
      remoteJid: 'status@broadcast',
    },
    message: {
      locationMessage: {
        name: `Hai ${ctx?.pushname || ctx?.getName?.() || 'User'}`,
        jpegThumbnail: '',
      },
    },
  };
};

export const simpleQuoted = (ctx) => {
  return {
    key: {
      participant: '0@s.whatsapp.net',
      remoteJid: 'status@broadcast',
    },
    message: {
      conversation: global.bot?.name || 'Bot',
    },
  };
};
