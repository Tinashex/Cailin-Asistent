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
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'database.json');

const DEFAULT_USER = (name = 'User') => ({
  name,
  ownerAcces: false,
  premium: { status: false, expiredAt: null },
  limit: 20,
  level: 1, exp: 0,
  hp: 100, hpMax: 100,
  mana: 50, manaMax: 50,
  atk: 10, def: 5,
  money: 100000, mcoin: 0,
  equipped: { weapon: null, armor: null },
  inventory: {
    ores:      { coal: 0, stone: 0, iron: 0, gold: 0, diamond: 0, platinum: 0 },
    nature:    { wood: 0, leather: 0, spice: 0, water_jug: 0, bait: 0 },
    fruit:     { strawberry: 0, banana: 0, grape: 0, apple: 0, orange: 0 },
    vegetable: { carrot: 0, potato: 0, cabbage: 0, onion: 0, tomato: 0, corn: 0 },
    fish:      { anchovy: 0, catfish: 0, carp: 0, tuna: 0, salmon: 0, swordfish: 0, pufferfish: 0, squid: 0, shrimp: 0, clownfish: 0 },
    food:      { bread: 0, rice: 0, grilled_fish: 0, steak: 0, fruit_salad: 0, roast_chicken: 0 },
    drink:     { water: 0, juice: 0, herbal_tea: 0, mana_potion: 0, elixir: 0 },
    tools:     { pickaxe_iron: 0, pickaxe_diamond: 0, rod_wood: 0, rod_premium: 0 },
    weapon:    { sword_stone: 0, sword_iron: 0, sword_diamond: 0, sword_light: 0, sword_dark: 0 },
    armor:     { armor_leather: 0, armor_iron: 0, armor_crystal: 0 },
    crate:     { common: 0, uncommon: 0, legendary: 0, mythic: 0, secret: 0 },
  },
  cooldown: { daily: 0, adventure: 0, mine: 0, fish: 0, rest: 0 },
  createdAt: Date.now(),
});

const DEFAULT_GROUP = (jid = '') => ({
  from: jid,
  config: {},
  bans: false,
  welcome: false,
  antilink: false,
});

const db = {
  read() {
    try {
      const raw = fs.readFileSync(DB_PATH, 'utf8');
      const parsed = JSON.parse(raw);
      return {
        user: parsed.user || {},
        group: parsed.group || {},
        cmd: parsed.cmd || {},
      };
    } catch {
      return { user: {}, group: {}, cmd: {} };
    }
  },

  write(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  },

  ensureUser(jid, name = 'User') {
    if (!global.db) return;
    if (!global.db.user[jid]) {
      global.db.user[jid] = DEFAULT_USER(name);
    }
    const u = global.db.user[jid];
    if (!u.premium) u.premium = { status: false, expiredAt: null };
    if (u.limit === undefined) u.limit = 20;
    if (!u.cooldown) u.cooldown = { daily: 0, adventure: 0, mine: 0, fish: 0, rest: 0 };
  },

  ensureGroup(jid) {
    if (!global.db) return;
    if (!global.db.group[jid]) {
      global.db.group[jid] = DEFAULT_GROUP(jid);
    }
  },

  resetAllLimits(defaultLimit = 20) {
    if (!global.db) return 0;
    let count = 0;
    for (const jid in global.db.user) {
      const u = global.db.user[jid];
      if (!u.ownerAcces && !u.premium?.status) {
        u.limit = defaultLimit;
        count++;
      }
    }
    db.write(global.db);
    return count;
  },

  checkPremiumExpiry() {
    if (!global.db) return 0;
    const now = Date.now();
    let count = 0;
    for (const jid in global.db.user) {
      const u = global.db.user[jid];
      if (u.premium?.status && u.premium.expiredAt !== Number.MAX_SAFE_INTEGER && u.premium.expiredAt <= now) {
        u.premium.status = false;
        u.premium.expiredAt = null;
        count++;
      }
    }
    if (count > 0) db.write(global.db);
    return count;
  },

  DEFAULT_USER,
  DEFAULT_GROUP,
};

export default db;
