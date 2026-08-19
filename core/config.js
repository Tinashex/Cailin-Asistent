/**
 * WhatsApp bot WatsonX-Bot using baileys (@whiskeysockets/baileys)
 * Type: plugins | Modules: ESM
 * Creator: Mommy Kyu
 * Follow https://whatsapp.com/channel/0029Vb7gcbuLdQelWzrTzD3D

 * Not allowed to sell this script.
 * Read README.md for guide!
 * Copyright (©) Mommy Kyu 2026
**/

import fs from 'fs';
import path from 'path';

// --- Bot Identity ---
global.owner = ['263781330745'];
global.botNumber = '263781330745';
global.botname = 'WatsonX-Bot';
global.author = '@mommykyuu';
global.version = '2.0.1';
global.body = 'Simple WhatsApp Bot.';

// --- Media Paths (Vercel-safe check) ---
global.vidmenu = './media/menu.mp4';
global.banner1 = './media/menu.jpg';
global.banner2 = './media/menu2.jpg';
global.icon1 = './media/menu3.jpg';
global.icon2 = './media/menu.jpg';

// --- Links & Info ---
global.website = 'https://api.kyzzz.eu.cc';
global.sourceUrl = 'https://api.kyzzz.eu.cc';
global.newsletterJid = '120363407145383686@newsletter';
global.newsletterName = 'Kyu Multi Device';
global.kyzzKey = 'ambil_sendiri';
global.termaiKey = 'ambil_sendiri';
global.defaultLimit = 20;

// --- Config Overrides (Fixed for Vercel read-only filesystem) ---
let configOverrides = {};
const configPath = path.join(process.cwd(), 'data', 'config_overrides.json');
try {
  if (fs.existsSync(configPath)) {
    configOverrides = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }
} catch (e) {
  // On Vercel, data folder is read-only, so we ignore errors
  console.log('[CONFIG] No overrides found, using defaults');
  configOverrides = {};
}

global.pairingCode = process.env.PAIRING_CODE || configOverrides.pairingCode || 'KYUU2026';
global.cloudflaredToken = process.env.CLOUDFLARED_TOKEN || configOverrides.cloudflaredToken || '';

// --- Link Preview ---
global.linkTitle = 'mommy kyu';
global.linkDesc = '© mommy kyu';
global.linkUrl = 'https://api.kyzzz.eu.cc';

// Fixed: safe thumbnail read for Vercel
let thumbData;
try {
  thumbData = fs.existsSync('./media/menu.jpg')? fs.readFileSync('./media/menu.jpg') : './media/menu.jpg';
} catch {
  thumbData = './media/menu.jpg';
}
global.linkThumb = thumbData;

// --- API Endpoints ---
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

global.API = (name, pathUrl = '/', params = {}, apiKeyLabel = '') => {
  const base = global.APIs[name];
  if (!base) throw new Error(`[API] Base URL for "${name}" not found`);
  const url = new URL(pathUrl, base);
  for (const [k, v] of Object.entries(params)) {
    if (v!== undefined && v!== null && v!== '') url.searchParams.set(k, v);
  }
  if (apiKeyLabel) {
    const key = global.APIKeys[base];
    if (key) url.searchParams.set(apiKeyLabel === true? 'apikey' : apiKeyLabel, key);
  }
  return url.toString();
};

// --- Messages ---
global.msg = {
  owner: '❌ This command is for Bot Owner only!',
  premium: '❌ This command is for Premium Users only!',
  group: '❌ This command can only be used in Groups!',
  private: '❌ This command can only be used in Private Chat!',
  register: '❌ You are not registered yet!\nUse *.register [name]* first.',
  limit: '❌ *Your daily limit has been used up!*\nLimit resets at 00:00 WIB.\nUpgrade to Premium for unlimited.',
  wait: '⏳ Processing, please wait...',
  error: '❌ A system error occurred.',
  admin: '❌ This command can only be used by Group Admins!',
  botAdmin: '❌ Bot must be a Group Admin first!'
};
global.mess = global.msg;

// --- Bot Object ---
global.bot = {
  name: global.botname,
  version: global.version,
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
