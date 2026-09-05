/**
 * WatsonX-Bot
 * WhatsApp Bot using Baileys (@whiskeysockets/baileys)
 * Type: Plugins | Modules: ESM
 * Creator: Watson Fourpence
 * Location: Harare, Zimbabwe
 * Version: 2.0.1
 */

import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();

// ============================================================
// BOT IDENTITY
// ============================================================

const BOT_OWNER_NUMBER =
  String(
    process.env.BOT_OWNER_NUMBER ||
    '263781330745'
  ).replace(/[^0-9]/g, '');

const BOT_NUMBER =
  String(
    process.env.BOT_NUMBER ||
    BOT_OWNER_NUMBER
  ).replace(/[^0-9]/g, '');

global.owner = [BOT_OWNER_NUMBER];
global.botNumber = BOT_NUMBER;

global.botname =
  process.env.BOT_NAME ||
  'WatsonX-Bot';

global.author =
  process.env.BOT_AUTHOR ||
  'Watson Fourpence';

global.version =
  process.env.BOT_VERSION ||
  '2.0.1';

global.body =
  process.env.BOT_DESCRIPTION ||
  'Simple WhatsApp Bot.';

global.creator = {
  name: 'Watson Fourpence',
  age: 22,
  location: 'Harare, Zimbabwe',
  description: 'Loves coding.'
};

// ============================================================
// MEDIA PATHS
// ============================================================

const MEDIA_DIR =
  path.join(
    ROOT_DIR,
    'media'
  );

global.vidmenu =
  path.join(
    MEDIA_DIR,
    'menu.mp4'
  );

global.banner1 =
  path.join(
    MEDIA_DIR,
    'menu.jpg'
  );

global.banner2 =
  path.join(
    MEDIA_DIR,
    'menu2.jpg'
  );

global.icon1 =
  path.join(
    MEDIA_DIR,
    'menu3.jpg'
  );

global.icon2 =
  path.join(
    MEDIA_DIR,
    'menu.jpg'
  );

// ============================================================
// LINKS & BOT INFORMATION
// ============================================================

global.website =
  process.env.BOT_WEBSITE ||
  'https://api.kyzzz.eu.cc';

global.sourceUrl =
  process.env.BOT_SOURCE_URL ||
  global.website;

global.newsletterJid =
  process.env.NEWSLETTER_JID ||
  '120363407145383686@newsletter';

global.newsletterName =
  process.env.NEWSLETTER_NAME ||
  'WatsonX-Bot';

global.defaultLimit =
  Number(
    process.env.DEFAULT_LIMIT ||
    20
  );

// ============================================================
// CONFIG OVERRIDES
// ============================================================

let configOverrides = {};

const configPath =
  path.join(
    ROOT_DIR,
    'data',
    'config_overrides.json'
  );

try {
  if (fs.existsSync(configPath)) {
    const raw =
      fs.readFileSync(
        configPath,
        'utf8'
      );

    const parsed =
      JSON.parse(raw);

    if (
      parsed &&
      typeof parsed === 'object' &&
      !Array.isArray(parsed)
    ) {
      configOverrides = parsed;
    }
  }
} catch (error) {
  console.warn(
    '[CONFIG] Unable to load config_overrides.json:',
    error.message
  );

  configOverrides = {};
}

// ============================================================
// PAIRING CONFIGURATION
// ============================================================

/*
 * IMPORTANT:
 *
 * This is NOT a WhatsApp pairing code.
 * Baileys generates the real 8-character pairing code.
 *
 * Keep this value only if another part of the project uses
 * PAIRING_CODE as a configuration/token value.
 */

global.pairingCode =
  process.env.PAIRING_CODE ||
  configOverrides.pairingCode ||
  '';

// ============================================================
// CLOUDFLARE
// ============================================================

global.cloudflaredToken =
  process.env.CLOUDFLARED_TOKEN ||
  configOverrides.cloudflaredToken ||
  '';

// ============================================================
// ENVIRONMENT
// ============================================================

global.isVercel =
  process.env.VERCEL === '1' ||
  process.env.VERCEL === 'true';

global.isProduction =
  process.env.NODE_ENV === 'production';

global.isDevelopment =
  !global.isProduction;

global.isServerless =
  global.isVercel;

global.isPersistentServer =
  !global.isServerless;

// ============================================================
// SESSION DIRECTORIES
// ============================================================

global.sessionDir =
  path.join(
    ROOT_DIR,
    'session'
  );

global.cloneSessionDir =
  path.join(
    ROOT_DIR,
    'session_clones'
  );

global.dataDir =
  path.join(
    ROOT_DIR,
    'data'
  );

// ============================================================
// LINK PREVIEW
// ============================================================

global.linkTitle =
  process.env.LINK_TITLE ||
  global.botname;

global.linkDesc =
  process.env.LINK_DESCRIPTION ||
  'WhatsApp Multi Device Bot';

global.linkUrl =
  process.env.LINK_URL ||
  global.website;

// ============================================================
// THUMBNAIL
// ============================================================

let thumbData = null;

const thumbnailPath =
  path.join(
    MEDIA_DIR,
    'menu.jpg'
  );

try {
  if (fs.existsSync(thumbnailPath)) {
    thumbData =
      fs.readFileSync(
        thumbnailPath
      );
  }
} catch (error) {
  console.warn(
    '[CONFIG] Unable to load thumbnail:',
    error.message
  );
}

global.linkThumb =
  thumbData || thumbnailPath;

// ============================================================
// API ENDPOINTS
// ============================================================

global.APIs = {
  kyzz:
    process.env.KYZZ_API ||
    'https://api.kyzzz.eu.cc',

  termai:
    process.env.TERMAI_API ||
    'https://api.termai.cc'
};

global.api =
  global.APIs;

global.apis =
  global.APIs;

// ============================================================
// API KEYS
// ============================================================

global.kyzzKey =
  process.env.KYZZ_API_KEY ||
  configOverrides.kyzzKey ||
  '';

global.termaiKey =
  process.env.TERMAI_API_KEY ||
  configOverrides.termaiKey ||
  '';

global.APIKeys = {
  [global.APIs.kyzz]:
    global.kyzzKey,

  [global.APIs.termai]:
    global.termaiKey
};

// ============================================================
// API URL BUILDER
// ============================================================

global.API = (
  name,
  pathUrl = '/',
  params = {},
  apiKeyLabel = ''
) => {
  const base =
    global.APIs[name];

  if (!base) {
    throw new Error(
      `[API] Base URL for "${name}" not found`
    );
  }

  let url;

  try {
    url =
      new URL(
        pathUrl,
        base
      );
  } catch (error) {
    throw new Error(
      `[API] Invalid URL for "${name}": ${error.message}`
    );
  }

  if (
    params &&
    typeof params === 'object'
  ) {
    for (
      const [key, value]
      of Object.entries(params)
    ) {
      if (
        value !== undefined &&
        value !== null &&
        value !== ''
      ) {
        url.searchParams.set(
          key,
          String(value)
        );
      }
    }
  }

  if (apiKeyLabel) {
    const key =
      global.APIKeys[base];

    if (key) {
      const parameterName =
        apiKeyLabel === true
          ? 'apikey'
          : String(apiKeyLabel);

      url.searchParams.set(
        parameterName,
        key
      );
    }
  }

  return url.toString();
};

// ============================================================
// BOT MESSAGES
// ============================================================

global.msg = {
  owner:
    '❌ This command is for Bot Owner only!',

  premium:
    '❌ This command is for Premium Users only!',

  group:
    '❌ This command can only be used in Groups!',

  private:
    '❌ This command can only be used in Private Chat!',

  register:
    '❌ You are not registered yet!\nUse *.register [name]* first.',

  limit:
    '❌ *Your daily limit has been used up!*\nLimit resets at 00:00.\nUpgrade to Premium for unlimited access.',

  wait:
    '⏳ Processing, please wait...',

  error:
    '❌ A system error occurred.',

  admin:
    '❌ This command can only be used by Group Admins!',

  botAdmin:
    '❌ Bot must be a Group Admin first!'
};

global.mess =
  global.msg;

// ============================================================
// BOT OBJECT
// ============================================================

global.bot = {
  name:
    global.botname,

  version:
    global.version,

  owner:
    global.owner,

  author: {
    name:
      global.author,

    number:
      global.botNumber
  },

  creator:
    global.creator,

  media: {
    banner1:
      global.banner1,

    banner2:
      global.banner2,

    icon1:
      global.icon1,

    icon2:
      global.icon2,

    video:
      global.vidmenu
  },

  utils: {
    source_urls:
      global.sourceUrl,

    title:
      global.linkTitle,

    body:
      global.linkDesc,

    url:
      global.linkUrl,

    newsletterJid:
      global.newsletterJid,

    newsletterName:
      global.newsletterName
  },

  key: {
    kyzz_api:
      global.kyzzKey,

    termai_api:
      global.termaiKey
  },

  defaultLimit:
    global.defaultLimit
};

// ============================================================
// STARTUP INFORMATION
// ============================================================

console.log(
  `[CONFIG] ${global.botname} v${global.version} loaded.`
);

console.log(
  `[CONFIG] Mode: ${
    global.isVercel
      ? 'Vercel/Serverless'
      : 'Persistent Server'
  }`
);

export default global.bot;
