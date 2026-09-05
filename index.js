/**
 * WhatsApp bot Cailin Assistant using Baileys
 * Type plugins | Modules ESM
 * Creator Mommy Kyu
 * Follow https://whatsapp.com/channel/0029Vb7gcbuLdQelWzrTzD3D
 * Follow https://whatsapp.com/channel/0029VbCsmdMC1Fu6NbIaaY2T
 *
 * Dilarang menjual script ini.
 *
 * [ID] - Baca file README.md untuk melihat panduan!
 * [ENG] - Read the README.md file to see the guide!
 *
 * Copyright (©) Mommy Kyu 2026
 */

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

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

global.activeSessions = global.activeSessions || new Map();
global.sessionStarting = global.sessionStarting || new Map();
global.sessionReconnectTimers = global.sessionReconnectTimers || new Map();

function normalizePhoneNumber(number) {
  if (!number) return null;

  let phoneNumber = String(number).replace(/[^0-9]/g, '');

  if (phoneNumber.startsWith('0')) {
    phoneNumber = '263' + phoneNumber.slice(1);
  }

  if (phoneNumber.length < 9) {
    return null;
  }

  return phoneNumber;
}

function getDisconnectReason(lastDisconnect) {
  try {
    return new Boom(lastDisconnect?.error)?.output?.statusCode;
  } catch {
    return undefined;
  }
}

function clearReconnectTimer(sessionName) {
  const timer = global.sessionReconnectTimers.get(sessionName);

  if (timer) {
    clearTimeout(timer);
    global.sessionReconnectTimers.delete(sessionName);
  }
}

function scheduleReconnect(sessionName, targetPhone, delay = 3000) {
  clearReconnectTimer(sessionName);

  const timer = setTimeout(async () => {
    global.sessionReconnectTimers.delete(sessionName);

    try {
      await startSession(sessionName, targetPhone);
    } catch (error) {
      console.error(
        chalk.red(`[SYSTEM] Failed to reconnect [${sessionName}]:`),
        error?.message || error
      );

      addBotLog(
        'CONNECT_ERROR',
        `Reconnect failed [${sessionName}]: ${error?.message || error}`
      );

      scheduleReconnect(sessionName, targetPhone, 5000);
    }
  }, delay);

  global.sessionReconnectTimers.set(sessionName, timer);
}

let startSession;

(async () => {
  const loader = new CommandLoader({
    dir: path.join(process.cwd(), './plugins'),
    logger: {
      log: console.log,
      info: console.log,
      error: console.error,
      warn: console.warn
    }
  });

  global.loader = loader;

  await loader.loadAll();
  loader.watch();

  await checkGitHubUpdate();

  const total = Object.values(loader.getCommandsByCategory())
    .flat()
    .length;

  console.clear();

  console.log(chalk.cyan(`
⣿⠛⠛⠛⠛⠻⡆                                        
⠛⢛⣿⠋⢀⡾⠃    ⢀⣤⣤⠤⠤⣤⣤⣀⣀⣀⣠⠶⡶⣤⣀⣠⠾⡷⣦⣀⣤⣤⡤⠤⠦⢤⣤⣄⡀ ⢠⡶⢶⡄  
⢠⡟⠁⣴⣿⢤⡄⣴⢶⠶⡆⠈⢷⡀    ⢀⣭⣫⠵⠥⠽⣄⣝⠵⢍⣘⣄⠳⤤⣀  ⢀⡤⠊⣽⠁ ⠸⣇ ⢿  
⠸⢷⣴⣤⡤⠾⠇⣽⠋⠼⣷ ⠈⢷⡄⢀⣤⡶⠋ ⣀⡄⠤ ⡲⡆  ⠈⠙⡄⠘⢮⢳⡴⠯⣀⢠⡏   ⢻ ⢸⠇ 
       ⠙⠛⠋⠉⢀⣴⠟⠉⢯⡞⡠⢲⠉⣼  ⡰⠁⡇⢀⢷ ⣄⢵ ⠈⡟⢄  ⠙⢷⣤⣤⣤⡿⢢⡿  
          ⣠⠟⠑⠊⠁⡼⣌⢠⢿⢸⢸⡀⢰⠁⡸⡇⡸⣸⢰⢈⠘⡄ ⢸ ⢣⡀ ⠈⢮⢢⣏⣤⡾⠃  
         ⢰⣯⣴⠞⡠⣼⠁⡘⣾⠏⣿⢇⣳⣸⣞⣀⢱⣧⣋⣞⡜⢳⡇ ⢸ ⢆⢧ ⠰⣄⢏⢧⣾⠁   
         ⠈⢹⡏⢰⠁⡻ ⡟⡏⠉ ⣀    ⣀⠁ ⠉⠛⢽⠇ ⣼⡆⠈⡆⠃ ⡏⠻⣾⣽⣇⡀  
          ⢸⠁⡇ ⡇⡄⣿⠷⠿⠛    ⠛⠻⠿⠿⠿⡜⢀⡴⡟⢸⣸⡼  ⡇ ⡞⡆⢻⠙⢦ 
          ⢸⡶⢀⣼⣿⣬⣽⠧⠬⠇      ⢞⣯⣭⢺⣔⣪⣾⣤⠺⡇⢳ ⢠⣧⡾⠛⠛⠻⠶⠞⠁
          ⠘⠷⢿⠟⠉⡀⠈⢦⡀  ⣠⠖⠒⠒⢤⡀ ⢀⡼⠿⢇⡣⢬⣶⠷⢿⣤⡾⠁       
            ⠘⠷⠾⠷⠖⠛⠛⠲⠶⠿⠤⣤⠤⠤⢷⣶⠋   ⣱⠞⠁ ⠈⠉         
                           ⠉⠛⠓⠒⠚⠋
  `));

  console.log(chalk.whiteBright(' ╭──────────────────────────────────────────────────╮'));
  console.log(chalk.whiteBright(' │ ') + chalk.cyanBright('Developer  : ') + chalk.yellow('Mommy Kyu'));
  console.log(chalk.whiteBright(' │ ') + chalk.cyanBright('Telegram   : ') + chalk.blueBright('t.me/kyuugperawan'));
  console.log(chalk.whiteBright(' │ ') + chalk.cyanBright('Website    : ') + chalk.magenta('https://api.kyzzz.eu.cc'));
  console.log(chalk.whiteBright(' │ ') + chalk.cyanBright('WhatsApp   : ') + chalk.greenBright('https://whatsapp.com/channel/0029Vb7gcbuLdQelWzrTzD3D'));
  console.log(chalk.whiteBright(' ╰──────────────────────────────────────────────────╯\n'));

  console.log(
    chalk.bgGreen.black(' DONE ') +
    chalk.green(` ${total} commands loaded successfully.\n`)
  );

  const saved = db.read();

  global.db = {
    user: saved.user || {},
    group: saved.group || {},
    cmd: saved.cmd || {}
  };

  startSession = async (sessionName = 'session', targetPhone = null) => {
    if (!sessionName) sessionName = 'session';

    const existingStart = global.sessionStarting.get(sessionName);

    if (existingStart) {
      return existingStart;
    }

    const existingSocket = global.activeSessions.get(sessionName);

    if (existingSocket) {
      try {
        if (
          existingSocket.user &&
          existingSocket.ws &&
          !existingSocket.ws.isClosed
        ) {
          return existingSocket;
        }
      } catch {}

      global.activeSessions.delete(sessionName);
    }

    const startPromise = (async () => {
      const sessionDir = path.join(
        process.cwd(),
        'session',
        sessionName
      );

      fs.mkdirSync(sessionDir, {
        recursive: true
      });

      const credsFile = path.join(
        sessionDir,
        'creds.json'
      );

      /*
       * Only remove a clearly invalid/corrupt credentials file.
       * Never delete an active authentication session just because
       * `registered` is temporarily unavailable.
       */
      if (fs.existsSync(credsFile)) {
        try {
          const credsData = JSON.parse(
            fs.readFileSync(credsFile, 'utf8')
          );

          if (
            !credsData ||
            typeof credsData !== 'object'
          ) {
            throw new Error('Invalid credentials file');
          }
        } catch {
          console.log(
            chalk.yellow(
              `[SYSTEM] Invalid credentials for [${sessionName}], resetting session...`
            )
          );

          try {
            fs.rmSync(sessionDir, {
              recursive: true,
              force: true
            });
          } catch {}

          fs.mkdirSync(sessionDir, {
            recursive: true
          });
        }
      }

      let version;

      try {
        const versionData =
          await fetchLatestBaileysVersion();

        version = versionData?.version;

        if (!version) {
          throw new Error(
            'Baileys version unavailable'
          );
        }
      } catch (error) {
        console.log(
          chalk.yellow(
            `[SYSTEM] Using fallback Baileys version for [${sessionName}]`
          )
        );

        version = [
          2,
          3000,
          1043857760
        ];
      }

      const {
        state,
        saveCreds
      } = await useMultiFileAuthState(
        sessionDir
      );

      const kyu = makeWASocket({
        printQRInTerminal: false,
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(
            state.keys,
            pino({
              level: 'silent'
            })
          )
        },
        version,
        browser: Browsers.ubuntu('Chrome'),
        syncFullHistory: false,
        markOnlineOnConnect: false,
        generateHighQualityLinkPreview: false,
        logger: pino({
          level: 'silent'
        })
      });

      kyu.conn = kyu;
      kyu.sock = kyu;
      kyu.sessionName = sessionName;
      kyu.pairingCodeResult = null;

      if (sessionName === 'session') {
        global.conn = kyu;
        global.sock = kyu;
        global.mainSock = kyu;
      }

      global.activeSessions.set(
        sessionName,
        kyu
      );

      makeHelper(kyu);

      kyu.ev.on(
        'creds.update',
        async () => {
          try {
            await saveCreds();
          } catch (error) {
            console.error(
              chalk.red(
                `[CREDS ERROR] [${sessionName}]`
              ),
              error?.message || error
            );
          }
        }
      );

      /*
       * Pairing is performed directly on the persistent
       * session socket.
       */
      if (!state.creds.registered) {
        const rawNum =
          targetPhone ||
          global.botNumber ||
          process.env.BOT_NUMBER ||
          null;

        const phoneNumber =
          normalizePhoneNumber(rawNum);

        if (phoneNumber) {
          try {
            console.log(
              chalk.cyan(
                `[PAIRING] Requesting WhatsApp pairing code for +${phoneNumber}...`
              )
            );

            await sleep(3000);

            const rawCode =
              await kyu.requestPairingCode(
                phoneNumber
              );

            const cleanCode =
              rawCode
                ? String(rawCode).replace(
                    /[^a-zA-Z0-9]/g,
                    ''
                  )
                : '';

            const pair =
              cleanCode.length === 8
                ? `${cleanCode.slice(0, 4)}-${cleanCode.slice(4, 8)}`
                : cleanCode;

            if (pair) {
              kyu.pairingCodeResult =
                pair.toUpperCase();

              console.log(
                chalk.white.bold(
                  `[✓] - Code [${sessionName}]`
                ) +
                ' : ' +
                chalk.green.bold(
                  kyu.pairingCodeResult
                ) +
                ' | Phone: +' +
                phoneNumber
              );

              addBotLog(
                'PAIRING',
                `Pairing code [${sessionName}]: ${kyu.pairingCodeResult} | Number: +${phoneNumber}`
              );
            }
          } catch (error) {
            console.error(
              chalk.redBright(
                `[PAIRING ERROR] [${sessionName}]`
              ),
              error?.stack ||
                error?.message ||
                error
            );

            addBotLog(
              'PAIRING_ERROR',
              `Pairing error [${sessionName}] (+${phoneNumber}): ${
                error?.message || error
              }`
            );
          }
        } else {
          console.log(
            chalk.yellow(
              `[PAIRING] No valid phone number configured for [${sessionName}].`
            )
          );
        }
      }

      kyu.ev.on(
        'messages.upsert',
        async ({ messages, type }) => {
          if (type && type !== 'notify') return;

          for (const msg of messages || []) {
            if (!msg?.message) continue;

            try {
              const ctx =
                await SerializeMessage(
                  kyu,
                  msg
                );

              if (!ctx) continue;

              await UpsertMsgHandle(
                kyu,
                msg,
                ctx,
                {
                  cmd: global.loader
                }
              );
            } catch (error) {
              console.error(
                chalk.red(
                  '[HANDLER ERROR]'
                ),
                error
              );
            }
          }
        }
      );

      kyu.ev.on(
        'connection.update',
        async ({
          connection,
          lastDisconnect
        }) => {
          if (!connection) return;

          if (connection === 'connecting') {
            console.log(
              chalk.yellow(
                `[SYSTEM] Connecting session [${sessionName}]...`
              )
            );

            return;
          }

          if (connection === 'open') {
            clearReconnectTimer(
              sessionName
            );

            const botName =
              kyu.user?.name ||
              kyu.user?.id ||
              'Bot';

            console.log(
              chalk.bgGreen.black(
                ' ONLINE '
              ) +
              chalk.greenBright(
                ` Session [${sessionName}] connected as: ${botName}\n`
              )
            );

            addBotLog(
              'ONLINE',
              `Session [${sessionName}] connected as: ${botName}`
            );

            /*
             * Once WhatsApp is connected, credentials have been
             * written by creds.update and the persistent session
             * is now usable by the bot.
             */
            return;
          }

          if (connection !== 'close') {
            return;
          }

          const reason =
            getDisconnectReason(
              lastDisconnect
            );

          console.error(
            chalk.red(
              `[SYSTEM] Session [${sessionName}] disconnected:`
            ),
            lastDisconnect?.error ||
              'unknown'
          );

          addBotLog(
            'CONNECT',
            `Session [${sessionName}] disconnected: ${
              reason || 'unknown'
            }`
          );

          /*
           * Do not reconnect this exact socket more than once.
           */
          const current =
            global.activeSessions.get(
              sessionName
            );

          if (current === kyu) {
            global.activeSessions.delete(
              sessionName
            );
          }

          if (
            sessionName === 'session' &&
            global.conn === kyu
          ) {
            global.conn = null;
            global.sock = null;
            global.mainSock = null;
          }

          switch (reason) {
            case DisconnectReason.badSession: {
              console.log(
                chalk.yellow(
                  `[SYSTEM] Bad session [${sessionName}], clearing corrupted state...`
                )
              );

              try {
                if (fs.existsSync(sessionDir)) {
                  const files =
                    fs.readdirSync(
                      sessionDir
                    );

                  for (
                    const file of files
                  ) {
                    if (
                      file.startsWith(
                        'app-state-sync-'
                      ) ||
                      file.includes(
                        'pre-key-'
                      ) ||
                      file.includes(
                        'sender-key-'
                      )
                    ) {
                      try {
                        fs.unlinkSync(
                          path.join(
                            sessionDir,
                            file
                          )
                        );
                      } catch {}
                    }
                  }
                }
              } catch {}

              scheduleReconnect(
                sessionName,
                targetPhone,
                3000
              );

              break;
            }

            case DisconnectReason.connectionClosed:
            case DisconnectReason.connectionLost:
            case DisconnectReason.restartRequired:
            case DisconnectReason.timedOut: {
              console.log(
                chalk.yellow(
                  `[SYSTEM] Reconnecting session [${sessionName}]...`
                )
              );

              scheduleReconnect(
                sessionName,
                targetPhone,
                3000
              );

              break;
            }

            case DisconnectReason.connectionReplaced: {
              console.log(
                chalk.red(
                  `[SYSTEM] Connection replaced for [${sessionName}].`
                )
              );

              break;
            }

            case DisconnectReason.loggedOut: {
              console.log(
                chalk.red(
                  `[SYSTEM] Session [${sessionName}] logged out.`
                )
              );

              global.activeSessions.delete(
                sessionName
              );

              if (
                sessionName === 'session'
              ) {
                global.conn = null;
                global.sock = null;
                global.mainSock = null;
              }

              break;
            }

            default: {
              console.log(
                chalk.yellow(
                  `[SYSTEM] Unknown disconnect for [${sessionName}], reconnecting...`
                )
              );

              scheduleReconnect(
                sessionName,
                targetPhone,
                5000
              );

              break;
            }
          }
        }
      );

      return kyu;
    })();

    global.sessionStarting.set(
      sessionName,
      startPromise
    );

    try {
      return await startPromise;
    } finally {
      global.sessionStarting.delete(
        sessionName
      );
    }
  };

  global.startNewWebSession =
    startSession;

  /*
   * Start the main persistent session.
   *
   * If there is no existing credentials file and
   * global.botNumber is configured, the bot will print
   * a pairing code in the terminal.
   */
  await startSession(
    'session'
  );

  /*
   * Load additional persistent sessions.
   */
  const baseSessionPath =
    path.join(
      process.cwd(),
      'session'
    );

  if (
    fs.existsSync(
      baseSessionPath
    )
  ) {
    const items =
      fs.readdirSync(
        baseSessionPath,
        {
          withFileTypes: true
        }
      );

    for (
      const item of items
    ) {
      if (
        !item.isDirectory() ||
        item.name === 'session' ||
        item.name === 'pairings'
      ) {
        continue;
      }

      const credsFile =
        path.join(
          baseSessionPath,
          item.name,
          'creds.json'
        );

      if (
        fs.existsSync(
          credsFile
        )
      ) {
        console.log(
          chalk.cyan(
            `[MULTI-SESSION] Loading additional session: ${item.name}`
          )
        );

        try {
          await startSession(
            item.name
          );
        } catch (error) {
          console.error(
            chalk.red(
              `[MULTI-SESSION] Failed to load ${item.name}:`
            ),
            error?.message ||
              error
          );
        }
      }
    }
  }

  /*
   * Load saved clone sessions.
   */
  try {
    const {
      loadAllSavedCloneSessions
    } = await import(
      './lib/cloneManager.js'
    );

    await loadAllSavedCloneSessions();
  } catch (error) {
    console.error(
      chalk.red(
        '[CLONE MANAGER ERROR]'
      ),
      error?.message ||
        error
    );
  }

  console.log(
    chalk.green(
      '✓ WhatsApp session manager started successfully.'
    )
  );
})();
