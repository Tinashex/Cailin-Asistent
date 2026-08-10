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

import readline from 'readline';
import pino from 'pino';
import qrcode from 'qrcode-terminal';
import {
  makeWASocket,
  makeCacheableSignalKeyStore,
  fetchLatestBaileysVersion,
  Browsers,
  DisconnectReason,
  useMultiFileAuthState,
} from '@whiskeysockets/baileys';
import { alyaai } from 'alyaai';
import { Boom } from '@hapi/boom';
import path from 'path';
import chalk from 'chalk';
import fs from 'fs';
import './core/config.js';
import makeHelper from './lib/makeHelper.js';
import { SerializeMessage } from './core/serialize.js';
import { CommandLoader } from './core/loader.js';
import { UpsertMsgHandle } from './core/handler.js';
import { checkGitHubUpdate } from './core/updater.js';
import db from './data/db.js';
import { addBotLog } from './lib/logger.js';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));


global.activeSessions = global.activeSessions || new Map();

(async () => {
  const loader = new CommandLoader({
    dir: path.join(process.cwd(), './plugins'),
    logger: { log: console.log, info: console.log, error: console.error, warn: console.warn },
  });

  global.loader = loader;
  await loader.loadAll();
  loader.watch();

  
  await checkGitHubUpdate();

  const total = Object.values(loader.getCommandsByCategory()).flat().length;

  console.clear();
  console.log(chalk.cyan(`
⣿⠛⠛⠛⠛⠻⡆                                        
⠛⢛⣿⠋⢀⡾⠃    ⢀⣤⣤⠤⠤⣤⣤⣀⣀⣀⣠⠶⡶⣤⣀⣠⠾⡷⣦⣀⣤⣤⡤⠤⠦⢤⣤⣄⡀ ⢠⡶⢶⡄  
⢠⡟⠁⣴⣿⢤⡄⣴⢶⠶⡆⠈⢷⡀    ⢀⣭⣫⠵⠥⠽⣄⣝⠵⢍⣘⣄⠳⣤⣀  ⢀⡤⠊⣽⠁ ⠸⣇ ⢿  
⠸⢷⣴⣤⡤⠾⠇⣽⠋⠼⣷ ⠈⢷⡄⢀⣤⡶⠋ ⣀⡄⠤ ⡲⡆  ⠈⠙⡄⠘⢮⢳⡴⠯⣀⢠⡏   ⢻ ⢸⠇ 
       ⠙⠛⠋⠉⢀⣴⠟⠉⢯⡞⡠⢲⠉⣼  ⡰⠁⡇⢀⢷ ⣄⢵ ⠈⡟⢄  ⠙⢷⣤⣤⣤⡿⢢⡿  
          ⣠⠟⠑⠊⠁⡼⣌⢠⢿⢸⢸⡀⢰⠁⡸⡇⡸⣸⢰⢈⠘⡄ ⢸ ⢣⡀ ⠈⢮⢢⣏⣤⡾⠃  
         ⢰⣯⣴⠞⡠⣼⠁⡘⣾⠏⣿⢇⣳⣸⣞⣀⢱⣧⣋⣞⡜⢳⡇ ⢸ ⢆⢧ ⠰⣄⢏⢧⣾⠁   
         ⠈⢹⡏⢰⠁⡻ ⡟⡏⠉ ⣀    ⣀⠁ ⠉⠛⢽⠇ ⣼⡆⠈⡆⠃ ⡏⠻⣾⣽⣇⡀  
          ⢸⠁⡇ ⡇⡄⣿⠷⠿⠿⠛    ⠛⠻⠿⠿⠿⡜⢀⡴⡟⢸⣸⡼  ⡇ ⡞⡆⢻⠙⢦ 
          ⢸⡶⢀⣼⣿⣬⣽⠧⠬⠇      ⢞⣯⣭⢺⣔⣪⣾⣤⠺⡇⢳ ⢠⣧⡾⠛⠛⠻⠶⠞⠁
          ⠘⠷⢿⠟⠉⡀⠈⢦⡀  ⣠⠖⠒⠒⢤⡀ ⢀⡼⠿⢇⡣⢬⣶⠷⢿⣤⡾⠁       
            ⠘⠷⠾⠷⠖⠛⠛⠲⠶⠿⠤⣤⠤⠤⢷⣶⠋   ⣱⠞⠁ ⠈⠉         
                           ⠉⠛⠓⠒⠚⠋              `));

  console.log(chalk.whiteBright(' ╭──────────────────────────────────────────────────╮'));
  console.log(chalk.whiteBright(' │ ') + chalk.cyanBright('Developer  : ') + chalk.yellow('Mommy Kyu'));
  console.log(chalk.whiteBright(' │ ') + chalk.cyanBright('Telegram   : ') + chalk.blueBright('t.me/kyuugperawan'));
  console.log(chalk.whiteBright(' │ ') + chalk.cyanBright('Website    : ') + chalk.magenta('https://api.kyzzz.eu.cc'));
  console.log(chalk.whiteBright(' │ ') + chalk.cyanBright('WhatsApp   : ') + chalk.greenBright('https://whatsapp.com/channel/0029Vb7gcbuLdQelWzrTzD3D'));
  console.log(chalk.whiteBright(' ╰──────────────────────────────────────────────────╯\n'));
  console.log(chalk.bgGreen.black(' DONE ') + chalk.green(` ${total} commands loaded successfully.\n`));

  const saved = db.read();
  global.db = {
    user: saved.user || {},
    group: saved.group || {},
    cmd: saved.cmd || {},
  };

  
  const startSession = async (sessionName = 'session', targetPhone = null) => {
    const sessionDir = path.join(process.cwd(), 'session', sessionName);
    if (!fs.existsSync(sessionDir)) {
      fs.mkdirSync(sessionDir, { recursive: true });
    }

    const credsFile = path.join(sessionDir, 'creds.json');
    if (fs.existsSync(credsFile)) {
      try {
        const credsData = JSON.parse(fs.readFileSync(credsFile, 'utf-8'));
        if (!credsData || !credsData.registered) {
          fs.rmSync(sessionDir, { recursive: true, force: true });
          fs.mkdirSync(sessionDir, { recursive: true });
        }
      } catch (_) {
        fs.rmSync(sessionDir, { recursive: true, force: true });
        fs.mkdirSync(sessionDir, { recursive: true });
      }
    }

    let version;
    try {
      const vData = await fetchLatestBaileysVersion();
      version = vData.version;
    } catch (_) {
      version = [2, 3000, 1043857760];
    }

    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

    const kyu = makeWASocket({
      printQRInTerminal: false,
      auth: state,
      version,
      browser: Browsers.ubuntu('Chrome'),
      syncFullHistory: false,
      logger: pino({ level: 'silent' }),
    });


    kyu.conn = kyu;
    kyu.sock = kyu;
    kyu.sessionName = sessionName;

    
    if (sessionName === 'session') {
      global.conn = kyu;
      global.sock = kyu;
      global.mainSock = kyu;
    }
    
    global.activeSessions.set(sessionName, kyu);
    makeHelper(kyu);

    
    if (!kyu.authState.creds.registered) {
      const rawNum = targetPhone || (global.botNumber && global.botNumber.replace(/[^0-9]/g, '').length >= 9 ? global.botNumber : null);
      if (rawNum) {
        let phoneNumber = rawNum.replace(/[^0-9]/g, '');
        if (phoneNumber.startsWith('0')) {
          phoneNumber = '62' + phoneNumber.slice(1);
        }
        await new Promise(r => setTimeout(r, 3000));

        let rawCode;
        try {
          rawCode = await kyu.requestPairingCode(phoneNumber);
        } catch (err) {
          const fullErr = err.stack || err.message || String(err);
          console.error(chalk.redBright(`[!] - Pairing Error Full Sesi [${sessionName}]:`), fullErr);
          addBotLog('PAIRING_ERROR', `Pairing error sesi [${sessionName}] (+${phoneNumber}): ${err.message || String(err)} | Stack: ${err.stack || 'No stack'}`);
        }

        const pair = rawCode && rawCode.length === 8 
          ? `${rawCode.slice(0, 4)}-${rawCode.slice(4, 8)}`
          : rawCode;

        if (pair) {
          console.log(chalk.white.bold(`[✓] - Code [${sessionName}]`) + ' : ' + chalk.green.bold(pair.toUpperCase()) + ' | Phone: +' + phoneNumber);
          addBotLog('PAIRING', `Kode Pairing Sesi [${sessionName}]: ${pair.toUpperCase()} | Nomor: +${phoneNumber}`);
          kyu.pairingCodeResult = pair.toUpperCase();
        }
      }
    }



    kyu.ev.on('creds.update', saveCreds);

    kyu.ev.on('messages.upsert', async ({ messages, type }) => {
      if (type && type !== 'notify') return;
      const msg = messages[0];
      if (!msg || !msg.message) return;

      try {
        const ctx = await SerializeMessage(kyu, msg);
        if (!ctx) return;
        await UpsertMsgHandle(kyu, msg, ctx, { cmd: global.loader });
      } catch (e) {
        console.error(chalk.red('[HANDLER ERROR]'), e);
      }
    });

    kyu.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
      if (!connection) return;
      if (connection === 'close') {
        const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
        console.error(`[SYSTEM] Disconnect Sesi [${sessionName}]:`, lastDisconnect?.error);
        addBotLog('CONNECT', `Sesi [${sessionName}] terputus status: ${reason || 'unknown'}`);

        switch (reason) {
          case DisconnectReason.badSession:
            console.log(`[SYSTEM] Bad Session [${sessionName}]! Cleaning sync files & reconnecting...`);
            try {
              if (fs.existsSync(sessionDir)) {
                const files = fs.readdirSync(sessionDir);
                for (const f of files) {
                  if (f.startsWith('app-state-sync-') || f.includes('pre-key-') || f.includes('sender-key-')) {
                    try { fs.unlinkSync(path.join(sessionDir, f)); } catch (_) {}
                  }
                }
              }
            } catch (_) {}
            await sleep(3000);
            await startSession(sessionName, targetPhone);
            break;
          case DisconnectReason.connectionClosed:
          case DisconnectReason.connectionLost:
          case DisconnectReason.restartRequired:
          case DisconnectReason.timedOut:
            console.log(`[SYSTEM] Reconnecting Sesi [${sessionName}]...`);
            await startSession(sessionName, targetPhone);
            break;
          case DisconnectReason.connectionReplaced:
            console.log(`[SYSTEM] Connection replaced for [${sessionName}].`);
            break;
          case DisconnectReason.loggedOut:
            console.log(`[SYSTEM] Sesi [${sessionName}] Logged Out.`);
            global.activeSessions.delete(sessionName);
            break;
          default:
            await startSession(sessionName, targetPhone);
        }
      } else if (connection === 'open') {
        const botName = kyu.user?.name || kyu.user?.id || 'Bot';
        console.log(chalk.bgGreen.black(' ONLINE ') + chalk.greenBright(` Sesi [${sessionName}] terhubung sebagai: ${botName}\n`));
        addBotLog('ONLINE', `Sesi [${sessionName}] terhubung sebagai: ${botName}`);
      }
    });

    return kyu;
  };

  
  await startSession('session');

  
  const baseSessionPath = path.join(process.cwd(), 'session');
  if (fs.existsSync(baseSessionPath)) {
    const items = fs.readdirSync(baseSessionPath, { withFileTypes: true });
    for (const item of items) {
      if (item.isDirectory() && item.name !== 'session') {
        const credsFile = path.join(baseSessionPath, item.name, 'creds.json');
        if (fs.existsSync(credsFile)) {
          console.log(chalk.cyan(`[MULTI-SESSION] Memuat Sesi Tambahan: ${item.name}`));
          await startSession(item.name);
        }
      }
    }
  }

  const { loadAllSavedCloneSessions } = await import('./lib/cloneManager.js');
  await loadAllSavedCloneSessions();

  global.startNewWebSession = startSession;
})();