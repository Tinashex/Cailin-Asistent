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

global.owner = ['62*****'];
global.botNumber = '62****';
global.botname = 'Cailin Assistant';
global.author = '@mommykyuu';
global.version = '2.0.0';
global.body = 'Simple WhatsApp Bot.';
global.vidmenu = './media/menu.mp4';
global.banner1 = './media/menu.jpg';
global.banner2 = './media/menu2.jpg';
global.icon1 = './media/menu3.jpg';
global.icon2 = './media/menu.jpg';
global.website = 'https://api.kyzzz.eu.cc';
global.sourceUrl = 'https://api.kyzzz.eu.cc';
global.newsletterJid = '120363407145383686@newsletter';
global.newsletterName = 'Kyu Multi Device';
global.kyzzKey = 'ambil_sendiri';
global.termaiKey = 'ambil_sendiri';
global.defaultLimit = 20;
let configOverrides = {};
if (fs.existsSync('./data/config_overrides.json')) {
  try {
    configOverrides = JSON.parse(fs.readFileSync('./data/config_overrides.json', 'utf-8'));
  } catch (_) {}
}

global.pairingCode = process.env.PAIRING_CODE || configOverrides.pairingCode || 'KYUU2026';
global.cloudflaredToken = process.env.CLOUDFLARED_TOKEN || configOverrides.cloudflaredToken || '';



global.linkTitle = 'mommy kyu';
global.linkDesc = '© momm? yeah son';
global.linkUrl = 'https://api.kyzzz.eu.cc';
global.linkThumb = fs.existsSync('./media/menu.jpg') ? fs.readFileSync('./media/menu.jpg') : './media/menu.jpg';


global.APIs = {
  kyzz: 'https://api.kyzzz.eu.cc',
  termai: 'https://api.termai.cc'
};
global.api = global.APIs;
global.apis = global.APIs;

global.APIKeys = {
  'https://api.kyzzz.eu.cc': global.kyzzKey || '',
  'https://api.termai.cc': global.termaiKey || ''
};

global.API = (name, path = '/', params = {}, apiKeyLabel = '') => {
  const base = global.APIs[name];
  if (!base) throw new Error(`[API] Base URL untuk "${name}" tidak ditemukan di global.APIs`);
  const url = new URL(path, base);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
  }
  if (apiKeyLabel) {
    const key = global.APIKeys[base];
    if (key) url.searchParams.set(apiKeyLabel === true ? 'apikey' : apiKeyLabel, key);
  }
  return url.toString();
};


global.msg = {
  owner: '❌ Perintah ini khusus untuk Owner Bot!',
  premium: '❌ Perintah ini khusus untuk Pengguna Premium!',
  group: '❌ Perintah ini hanya bisa digunakan di dalam Grup!',
  private: '❌ Perintah ini hanya bisa digunakan di Chat Pribadi!',
  register: '❌ Kamu belum terdaftar!\nGunakan perintah *.register [nama]* terlebih dahulu.',
  limit: '❌ *Limit harian kamu telah habis!*\n\n📌 Limit direset setiap hari pukul 00.00 WIB.\n💎 Upgrade ke *Premium* untuk akses tanpa limit.',
  wait: '⏳ Sedang diproses, mohon tunggu...',
  error: '❌ Terjadi kesalahan pada sistem.',
  admin: '❌ Perintah ini hanya bisa digunakan oleh Admin Grup!',
  botAdmin: '❌ Bot harus menjadi Admin Grup terlebih dahulu!'
};

global.mess = global.msg;

global.bot = {
  name: global.botname,
  versions: global.version,
  owner: global.owner,
  author: {
    name: global.author,
    number: global.botNumber,
  },
  media: {
    banner1: global.banner1,
    banner2: global.banner2,
    icon1: global.icon1,
    icon2: global.icon2,
  },
  utils: {
    source_urls: global.sourceUrl,
    title: global.linkTitle,
    body: global.linkDesc,
    newsletterJid: global.newsletterJid,
    newsletterName: global.newsletterName,
  },
  key: {
    kyzz_api: global.kyzzKey,
    termai_api: global.termaiKey,
  },
  defaultLimit: global.defaultLimit,
};
