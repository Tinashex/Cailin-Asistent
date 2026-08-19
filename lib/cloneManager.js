import pino from 'pino';
import {
  makeWASocket,
  fetchLatestBaileysVersion,
  Browsers,
  DisconnectReason,
  useMultiFileAuthState
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import path from 'path';
import fs from 'fs';
import os from 'os';
import chalk from 'chalk';
import makeHelper from './makeHelper.js';
import { SerializeMessage } from '../core/serialize.js';
import { UpsertMsgHandle } from '../core/handler.js';
import { addBotLog } from './logger.js';

const isVercel = !!process.env.VERCEL;

// Vercel cannot keep persistent bot sockets — disable clone manager on Vercel
if (isVercel) {
  console.log(chalk.yellow('[CLONE] Clone manager disabled on Vercel (serverless). Use VPS for multi-bot.'));
}

const activeCloneSessions = new Map();

const CLONES_DB = isVercel
  ? path.join(os.tmpdir(), 'clones.json')
  : path.join(process.cwd(), 'data', 'clones.json');

function getSavedClonesDB() {
  if (isVercel) return []; // No persistence on Vercel
  try {
    if (fs.existsSync(CLONES_DB)) {
      return JSON.parse(fs.readFileSync(CLONES_DB, 'utf-8'));
    }
  } catch (_) {}
  return [];
}

function saveCloneToDB(phoneNumber) {
  if (isVercel) return;
  const clones = getSavedClonesDB();
  if (!clones.includes(phoneNumber)) {
    clones.push(phoneNumber);
    try {
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
      fs.writeFileSync(CLONES_DB, JSON.stringify(clones, null, 2));
    } catch (_) {}
  }
}

function removeCloneFromDB(phoneNumber) {
  if (isVercel) return;
  let clones = getSavedClonesDB();
  clones = clones.filter(c => c !== phoneNumber);
  try {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(CLONES_DB, JSON.stringify(clones, null, 2));
  } catch (_) {}
}

export async function loadAllSavedCloneSessions() {
  if (isVercel) return; // Skip on Vercel
  
  const clones = getSavedClonesDB();
  const sessionClonesDir = path.join(process.cwd(), 'session_clones');
  
  if (fs.existsSync(sessionClonesDir)) {
    try {
      const items = fs.readdirSync(sessionClonesDir, { withFileTypes: true });
      for (const item of items) {
        if (item.isDirectory() && item.name.startsWith('clone_')) {
          const num = item.name.replace('clone_', '');
          if (!clones.includes(num)) clones.push(num);
        }
      }
    } catch (_) {}
  }

  for (const num of clones) {
    if (num && num.length >= 9) {
      try {
        console.log(chalk.cyan(`[CLONE AUTO-LOAD] Loading Clone Session: +${num}`));
        await createCloneSession(num);
      } catch (e) {
        console.error(chalk.red(`[CLONE AUTO-LOAD ERROR] +${num}:`), e.message);
      }
    }
  }
}

export async function createCloneSession(phoneNumber, forceFresh = false) {
  if (isVercel) {
    throw new Error('Multi-clone sessions are not supported on Vercel. Use VPS/Docker for clone bots. Use /api/account for pairing codes only.');
  }

  let cleanNum = phoneNumber.replace(/[^0-9]/g, '');
  if (cleanNum.startsWith('0')) {
    cleanNum = '263' + cleanNum.slice(1);
  }
  if (!cleanNum || cleanNum.length < 9) {
    throw new Error('Phone number minimum 9 digits!');
  }

  const cloneSessionDir = path.join(process.cwd(), 'session_clones', `clone_${cleanNum}`);

  if (activeCloneSessions.has(cleanNum)) {
    const existingSock = activeCloneSessions.get(cleanNum);
    if (!existingSock.authState?.creds?.registered || forceFresh) {
      try {
        existingSock.ws?.close();
        existingSock.end?.();
      } catch (_) {}
      activeCloneSessions.delete(cleanNum);
    }
  }

  if (!fs.existsSync(cloneSessionDir)) {
    fs.mkdirSync(cloneSessionDir, { recursive: true });
  }

  try {
    const credsFile = path.join(cloneSessionDir, 'creds.json');
    if (fs.existsSync(credsFile)) {
      try {
        const credsData = JSON.parse(fs.readFileSync(credsFile, 'utf-8'));
        if (!credsData || !credsData.registered || !credsData.me || forceFresh) {
          fs.rmSync(cloneSessionDir, { recursive: true, force: true });
          fs.mkdirSync(cloneSessionDir, { recursive: true });
        }
      } catch (e) {
        fs.rmSync(cloneSessionDir, { recursive: true, force: true });
        fs.mkdirSync(cloneSessionDir, { recursive: true });
      }
    }

    const { state, saveCreds } = await useMultiFileAuthState(cloneSessionDir);
    let version;
    try {
      const vData = await fetchLatestBaileysVersion();
      version = vData.version;
    } catch (_) {
      version = [2, 3000, 1043857760];
    }

    const cloneSock = makeWASocket({
      printQRInTerminal: false,
      auth: state,
      version,
      browser: Browsers.ubuntu('Chrome'),
      syncFullHistory: false,
      logger: pino({ level: 'silent' })
    });

    makeHelper(cloneSock);
    cloneSock.ev.on('creds.update', saveCreds);

    cloneSock.ev.on('messages.upsert', async ({ messages, type }) => {
      if (type && type !== 'notify') return;
      const msg = messages[0];
      if (!msg || !msg.message) return;
      try {
        if (!global.loader || !global.loader.commandMap || global.loader.commandMap.size === 0) {
          const { CommandLoader } = await import('../core/loader.js');
          if (!global.loader) {
            global.loader = new CommandLoader({
              dir: path.join(process.cwd(), './plugins'),
              logger: { log: console.log, info: console.log, error: console.error, warn: console.warn }
            });
          }
          await global.loader.loadAll();
        }
        const ctx = await SerializeMessage(cloneSock, msg);
        if (!ctx) return;
        await UpsertMsgHandle(cloneSock, msg, ctx, { cmd: global.loader });
      } catch (e) {
        console.error(chalk.red('[CLONE HANDLER ERROR]'), e);
      }
    });

    cloneSock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update;
      if (connection === 'open') {
        const botName = cloneSock.user?.name || cloneSock.user?.id || cleanNum;
        console.log(chalk.bgGreen.black(' CLONE ONLINE ') + chalk.greenBright(` Clone connected: +${cleanNum} (${botName})\n`));
        addBotLog('CLONE', `WhatsApp Clone connected: +${cleanNum}`);
        saveCloneToDB(cleanNum);
      } else if (connection === 'close') {
        const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode;
        console.log(chalk.yellow(`[CLONE] Connection closed (+${cleanNum}) [Status: ${statusCode || 'unknown'}]`));

        if (statusCode === DisconnectReason.loggedOut) {
          console.log(chalk.yellow(`[CLONE LOGGED OUT] Cleaning session for +${cleanNum}...`));
          activeCloneSessions.delete(cleanNum);
          removeCloneFromDB(cleanNum);
          try {
            if (fs.existsSync(cloneSessionDir)) {
              fs.rmSync(cloneSessionDir, { recursive: true, force: true });
            }
          } catch (_) {}
        } else if (statusCode === 440) {
          console.log(chalk.yellow(`[CLONE 440 CONFLICT] Session +${cleanNum} conflict. Stopping reconnect.`));
          activeCloneSessions.delete(cleanNum);
        } else {
          console.log(chalk.cyan(`[CLONE RECONNECT] Keeping socket alive for +${cleanNum}...`));
          setTimeout(() => {
            createCloneSession(cleanNum).catch(() => {});
          }, 10000);
        }
      }
    });

    activeCloneSessions.set(cleanNum, cloneSock);

    if (!cloneSock.authState.creds.registered) {
      await new Promise(r => setTimeout(r, 3000));
      let rawCode;
      try {
        rawCode = await cloneSock.requestPairingCode(cleanNum);
      } catch (e) {
        const fullErr = e.stack || e.message || String(e);
        console.error(chalk.red('[PAIRING ERROR FULL]'), fullErr);
        addBotLog('PAIRING_ERROR', `Failed pairing (+${cleanNum}): ${e.message}`);
        try {
          if (fs.existsSync(cloneSessionDir)) {
            fs.rmSync(cloneSessionDir, { recursive: true, force: true });
          }
        } catch (_) {}
        throw new Error(`Failed to request code from WhatsApp: ${e.message}`);
      }

      const pair = rawCode && rawCode.length === 8 
        ? `${rawCode.slice(0, 4)}-${rawCode.slice(4, 8)}`
        : rawCode;

      addBotLog('PAIRING', `Pairing Code: ${pair.toUpperCase()} | Number: +${cleanNum}`);
      console.log(chalk.bgCyan.black(' REAL PAIRING CODE ') + ' : ' + chalk.green.bold(pair.toUpperCase()) + ' | Phone: +' + cleanNum);
      return pair.toUpperCase();
    }

    return 'CONNECTED';
  } catch (err) {
    console.error(chalk.red('[CLONE ERROR] Failed creating clone session:'), err.message);
    addBotLog('PAIRING_ERROR', `Clone Error (+${phoneNumber}): ${err.message}`);
    throw new Error(`Failed to create clone session: ${err.message}`);
  }
      }
