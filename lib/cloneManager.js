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
import chalk from 'chalk';
import makeHelper from './makeHelper.js';
import { SerializeMessage } from '../core/serialize.js';
import { UpsertMsgHandle } from '../core/handler.js';
import { addBotLog } from './logger.js';

const isVercel = !!process.env.VERCEL;

if (isVercel) {
  console.log(
    chalk.yellow(
      '[CLONE] Clone manager disabled on Vercel (serverless). Use VPS/Docker for multi-bot sessions.'
    )
  );
}

const activeCloneSessions = new Map();
const reconnectTimers = new Map();

const CLONES_DB = path.join(
  process.cwd(),
  'data',
  'clones.json'
);

function normalizePhoneNumber(phoneNumber) {
  let cleanNum = String(phoneNumber || '').replace(/[^0-9]/g, '');

  if (cleanNum.startsWith('0')) {
    cleanNum = '263' + cleanNum.slice(1);
  }

  return cleanNum;
}

function isValidPhoneNumber(phoneNumber) {
  return /^\d{9,}$/.test(phoneNumber);
}

function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data');

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  return dataDir;
}

function getSavedClonesDB() {
  if (isVercel) return [];

  try {
    ensureDataDirectory();

    if (!fs.existsSync(CLONES_DB)) {
      return [];
    }

    const data = JSON.parse(
      fs.readFileSync(CLONES_DB, 'utf-8')
    );

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(
      chalk.red('[CLONE DB] Failed reading clones database:'),
      error.message
    );

    return [];
  }
}

function saveCloneToDB(phoneNumber) {
  if (isVercel) return;

  const cleanNum = normalizePhoneNumber(phoneNumber);

  if (!cleanNum) return;

  const clones = getSavedClonesDB();

  if (!clones.includes(cleanNum)) {
    clones.push(cleanNum);

    try {
      ensureDataDirectory();

      fs.writeFileSync(
        CLONES_DB,
        JSON.stringify(clones, null, 2),
        'utf-8'
      );
    } catch (error) {
      console.error(
        chalk.red('[CLONE DB] Failed saving clone:'),
        error.message
      );
    }
  }
}

function removeCloneFromDB(phoneNumber) {
  if (isVercel) return;

  const cleanNum = normalizePhoneNumber(phoneNumber);

  if (!cleanNum) return;

  let clones = getSavedClonesDB();

  clones = clones.filter(
    number => number !== cleanNum
  );

  try {
    ensureDataDirectory();

    fs.writeFileSync(
      CLONES_DB,
      JSON.stringify(clones, null, 2),
      'utf-8'
    );
  } catch (error) {
    console.error(
      chalk.red('[CLONE DB] Failed removing clone:'),
      error.message
    );
  }
}

function clearReconnectTimer(phoneNumber) {
  const cleanNum = normalizePhoneNumber(phoneNumber);

  const timer = reconnectTimers.get(cleanNum);

  if (timer) {
    clearTimeout(timer);
    reconnectTimers.delete(cleanNum);
  }
}

function closeSocket(socket) {
  if (!socket) return;

  try {
    socket.ws?.close();
  } catch (_) {}

  try {
    socket.end?.();
  } catch (_) {}
}

function removeSessionFiles(sessionDir) {
  try {
    if (fs.existsSync(sessionDir)) {
      fs.rmSync(sessionDir, {
        recursive: true,
        force: true
      });
    }
  } catch (error) {
    console.error(
      chalk.red('[CLONE] Failed removing session files:'),
      error.message
    );
  }
}

function prepareSessionDirectory(sessionDir, forceFresh = false) {
  if (forceFresh) {
    removeSessionFiles(sessionDir);
  }

  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, {
      recursive: true
    });

    return;
  }

  const credsFile = path.join(
    sessionDir,
    'creds.json'
  );

  if (!fs.existsSync(credsFile)) {
    return;
  }

  try {
    const credsData = JSON.parse(
      fs.readFileSync(credsFile, 'utf-8')
    );

    if (
      !credsData ||
      typeof credsData !== 'object'
    ) {
      removeSessionFiles(sessionDir);

      fs.mkdirSync(sessionDir, {
        recursive: true
      });

      return;
    }

    if (
      credsData.registered === false ||
      !credsData.me
    ) {
      removeSessionFiles(sessionDir);

      fs.mkdirSync(sessionDir, {
        recursive: true
      });
    }
  } catch (_) {
    removeSessionFiles(sessionDir);

    fs.mkdirSync(sessionDir, {
      recursive: true
    });
  }
}

async function getBaileysVersion() {
  try {
    const versionData =
      await fetchLatestBaileysVersion();

    if (
      versionData?.version &&
      Array.isArray(versionData.version)
    ) {
      return versionData.version;
    }
  } catch (error) {
    console.warn(
      chalk.yellow(
        '[BAILEYS] Failed to fetch latest version, using fallback.'
      )
    );
  }

  return [2, 3000, 1043857760];
}

export async function loadAllSavedCloneSessions() {
  if (isVercel) {
    return;
  }

  const clones = getSavedClonesDB();

  const sessionClonesDir = path.join(
    process.cwd(),
    'session_clones'
  );

  if (fs.existsSync(sessionClonesDir)) {
    try {
      const items = fs.readdirSync(
        sessionClonesDir,
        { withFileTypes: true }
      );

      for (const item of items) {
        if (
          item.isDirectory() &&
          item.name.startsWith('clone_')
        ) {
          const number =
            item.name.slice('clone_'.length);

          if (
            number &&
            !clones.includes(number)
          ) {
            clones.push(number);
          }
        }
      }
    } catch (error) {
      console.error(
        chalk.red('[CLONE AUTO-LOAD] Failed scanning sessions:'),
        error.message
      );
    }
  }

  for (const number of clones) {
    if (!isValidPhoneNumber(number)) {
      continue;
    }

    try {
      console.log(
        chalk.cyan(
          `[CLONE AUTO-LOAD] Loading Clone Session: +${number}`
        )
      );

      await createCloneSession(number);
    } catch (error) {
      console.error(
        chalk.red(
          `[CLONE AUTO-LOAD ERROR] +${number}:`
        ),
        error.message
      );
    }
  }
}

export async function createCloneSession(
  phoneNumber,
  forceFresh = false
) {
  if (isVercel) {
    throw new Error(
      'Multi-clone sessions are not supported on Vercel. Use VPS/Docker for clone bots.'
    );
  }

  const cleanNum =
    normalizePhoneNumber(phoneNumber);

  if (!isValidPhoneNumber(cleanNum)) {
    throw new Error(
      'Phone number minimum 9 digits!'
    );
  }

  clearReconnectTimer(cleanNum);

  const existingSocket =
    activeCloneSessions.get(cleanNum);

  if (existingSocket) {
    if (!forceFresh) {
      const registered =
        existingSocket.authState?.creds?.registered;

      if (registered) {
        return existingSocket;
      }

      closeSocket(existingSocket);
      activeCloneSessions.delete(cleanNum);
    } else {
      closeSocket(existingSocket);
      activeCloneSessions.delete(cleanNum);
    }
  }

  const cloneSessionDir = path.join(
    process.cwd(),
    'session_clones',
    `clone_${cleanNum}`
  );

  prepareSessionDirectory(
    cloneSessionDir,
    forceFresh
  );

  let cloneSock;

  try {
    const {
      state,
      saveCreds
    } = await useMultiFileAuthState(
      cloneSessionDir
    );

    const version =
      await getBaileysVersion();

    cloneSock = makeWASocket({
      printQRInTerminal: false,
      auth: state,
      version,
      browser: Browsers.ubuntu('Chrome'),
      syncFullHistory: false,
      logger: pino({
        level: 'silent'
      })
    });

    cloneSock.conn = cloneSock;
    cloneSock.sock = cloneSock;
    cloneSock.sessionName =
      `clone_${cleanNum}`;
    cloneSock.phoneNumber =
      cleanNum;
    cloneSock.isClone = true;

    makeHelper(cloneSock);

    cloneSock.ev.on(
      'creds.update',
      saveCreds
    );

    activeCloneSessions.set(
      cleanNum,
      cloneSock
    );

    cloneSock.ev.on(
      'messages.upsert',
      async ({ messages, type }) => {
        if (
          type &&
          type !== 'notify'
        ) {
          return;
        }

        const msg = messages?.[0];

        if (
          !msg ||
          !msg.message
        ) {
          return;
        }

        try {
          if (
            !global.loader ||
            !global.loader.commandMap ||
            global.loader.commandMap.size === 0
          ) {
            console.warn(
              chalk.yellow(
                '[CLONE] Global command loader is not ready.'
              )
            );

            return;
          }

          const ctx =
            await SerializeMessage(
              cloneSock,
              msg
            );

          if (!ctx) return;

          await UpsertMsgHandle(
            cloneSock,
            msg,
            ctx,
            {
              cmd: global.loader
            }
          );
        } catch (error) {
          console.error(
            chalk.red(
              '[CLONE HANDLER ERROR]'
            ),
            error
          );
        }
      }
    );

    cloneSock.ev.on(
      'connection.update',
      async update => {
        const {
          connection,
          lastDisconnect
        } = update;

        if (connection === 'open') {
          const botName =
            cloneSock.user?.name ||
            cloneSock.user?.id ||
            cleanNum;

          console.log(
            chalk.bgGreen.black(
              ' CLONE ONLINE '
            ) +
            chalk.greenBright(
              ` Clone connected: +${cleanNum} (${botName})\n`
            )
          );

          addBotLog(
            'CLONE',
            `WhatsApp Clone connected: +${cleanNum}`
          );

          saveCloneToDB(cleanNum);

          return;
        }

        if (connection !== 'close') {
          return;
        }

        const statusCode =
          new Boom(
            lastDisconnect?.error
          )?.output?.statusCode;

        console.log(
          chalk.yellow(
            `[CLONE] Connection closed (+${cleanNum}) [Status: ${statusCode || 'unknown'}]`
          )
        );

        const currentSocket =
          activeCloneSessions.get(cleanNum);

        if (
          currentSocket &&
          currentSocket !== cloneSock
        ) {
          return;
        }

        activeCloneSessions.delete(
          cleanNum
        );

        if (
          statusCode ===
          DisconnectReason.loggedOut
        ) {
          console.log(
            chalk.yellow(
              `[CLONE LOGGED OUT] Cleaning session for +${cleanNum}...`
            )
          );

          clearReconnectTimer(
            cleanNum
          );

          removeCloneFromDB(
            cleanNum
          );

          removeSessionFiles(
            cloneSessionDir
          );

          return;
        }

        if (statusCode === 440) {
          console.log(
            chalk.yellow(
              `[CLONE 440 CONFLICT] Session +${cleanNum} conflict. Reconnect stopped.`
            )
          );

          clearReconnectTimer(
            cleanNum
          );

          return;
        }

        if (
          statusCode ===
          DisconnectReason.connectionReplaced
        ) {
          console.log(
            chalk.yellow(
              `[CLONE] Connection replaced for +${cleanNum}.`
            )
          );

          clearReconnectTimer(
            cleanNum
          );

          return;
        }

        clearReconnectTimer(
          cleanNum
        );

        const timer = setTimeout(
          async () => {
            reconnectTimers.delete(
              cleanNum
            );

            if (
              activeCloneSessions.has(
                cleanNum
              )
            ) {
              return;
            }

            try {
              console.log(
                chalk.cyan(
                  `[CLONE RECONNECT] Reconnecting +${cleanNum}...`
                )
              );

              await createCloneSession(
                cleanNum
              );
            } catch (error) {
              console.error(
                chalk.red(
                  `[CLONE RECONNECT ERROR] +${cleanNum}:`
                ),
                error.message
              );
            }
          },
          10000
        );

        reconnectTimers.set(
          cleanNum,
          timer
        );
      }
    );

    if (
      !cloneSock.authState.creds.registered
    ) {
      await new Promise(
        resolve =>
          setTimeout(resolve, 3000)
      );

      let rawCode;

      try {
        rawCode =
          await cloneSock.requestPairingCode(
            cleanNum
          );
      } catch (error) {
        const fullError =
          error.stack ||
          error.message ||
          String(error);

        console.error(
          chalk.red(
            '[PAIRING ERROR FULL]'
          ),
          fullError
        );

        addBotLog(
          'PAIRING_ERROR',
          `Failed pairing (+${cleanNum}): ${error.message || String(error)}`
        );

        if (
          activeCloneSessions.get(
            cleanNum
          ) === cloneSock
        ) {
          activeCloneSessions.delete(
            cleanNum
          );
        }

        closeSocket(
          cloneSock
        );

        removeSessionFiles(
          cloneSessionDir
        );

        throw new Error(
          `Failed to request code from WhatsApp: ${error.message || String(error)}`
        );
      }

      const pair =
        rawCode &&
        rawCode.length === 8
          ? `${rawCode.slice(0, 4)}-${rawCode.slice(4, 8)}`
          : rawCode;

      if (!pair) {
        if (
          activeCloneSessions.get(
            cleanNum
          ) === cloneSock
        ) {
          activeCloneSessions.delete(
            cleanNum
          );
        }

        closeSocket(
          cloneSock
        );

        throw new Error(
          'WhatsApp returned an empty pairing code.'
        );
      }

      const formattedPair =
        pair.toUpperCase();

      addBotLog(
        'PAIRING',
        `Pairing Code: ${formattedPair} | Number: +${cleanNum}`
      );

      console.log(
        chalk.bgCyan.black(
          ' REAL PAIRING CODE '
        ) +
        ' : ' +
        chalk.green.bold(
          formattedPair
        ) +
        ' | Phone: +' +
        cleanNum
      );

      cloneSock.pairingCodeResult =
        formattedPair;

      return formattedPair;
    }

    return 'CONNECTED';
  } catch (error) {
    if (
      cloneSock &&
      activeCloneSessions.get(
        cleanNum
      ) === cloneSock
    ) {
      activeCloneSessions.delete(
        cleanNum
      );
    }

    if (
      error?.message?.startsWith(
        'Failed to request code from WhatsApp:'
      )
    ) {
      throw error;
    }

    console.error(
      chalk.red(
        '[CLONE ERROR] Failed creating clone session:'
      ),
      error.stack ||
      error.message ||
      error
    );

    addBotLog(
      'PAIRING_ERROR',
      `Clone Error (+${cleanNum}): ${error.message || String(error)}`
    );

    throw new Error(
      `Failed to create clone session: ${error.message || String(error)}`
    );
  }
}

export function getActiveCloneSession(
  phoneNumber
) {
  const cleanNum =
    normalizePhoneNumber(phoneNumber);

  return activeCloneSessions.get(
    cleanNum
  );
}

export function getActiveCloneSessions() {
  return activeCloneSessions;
}

export async function disconnectCloneSession(
  phoneNumber,
  removeFromDatabase = false
) {
  const cleanNum =
    normalizePhoneNumber(phoneNumber);

  clearReconnectTimer(
    cleanNum
  );

  const socket =
    activeCloneSessions.get(
      cleanNum
    );

  activeCloneSessions.delete(
    cleanNum
  );

  if (socket) {
    closeSocket(socket);
  }

  if (removeFromDatabase) {
    removeCloneFromDB(
      cleanNum
    );

    const sessionDir =
      path.join(
        process.cwd(),
        'session_clones',
        `clone_${cleanNum}`
      );

    removeSessionFiles(
      sessionDir
    );
  }
}
