import pino from 'pino';
import {
  makeWASocket,
  fetchLatestBaileysVersion,
  Browsers,
  useMultiFileAuthState
} from '@whiskeysockets/baileys';
import path from 'path';
import fs from 'fs';
import os from 'os';

const activePairings = new Map();

function normalizePhoneNumber(phoneNumber) {
  let cleanNum = String(phoneNumber || '').replace(/[^0-9]/g, '');

  if (cleanNum.startsWith('0')) {
    cleanNum = '263' + cleanNum.slice(1);
  }

  return cleanNum;
}

function getPairingBaseDir() {
  if (process.env.VERCEL) {
    return path.join(os.tmpdir(), 'cailin-pairings');
  }

  return path.join(process.cwd(), 'session', 'pairings');
}

function closePairing(cleanNum, removeSession = false) {
  const pairing = activePairings.get(cleanNum);

  if (!pairing) {
    return;
  }

  activePairings.delete(cleanNum);

  try {
    pairing.conn?.ws?.close();
  } catch {}

  try {
    pairing.conn?.end?.();
  } catch {}

  if (removeSession) {
    try {
      fs.rmSync(pairing.sessionDir, {
        recursive: true,
        force: true
      });
    } catch {}
  }
}

export async function requestRealBaileysPairingCode(phoneNumber) {
  const cleanNum = normalizePhoneNumber(phoneNumber);

  if (!cleanNum || cleanNum.length < 9) {
    throw new Error('Phone number must be at least 9 digits!');
  }

  // Prevent multiple pairing sockets for the same number.
  if (activePairings.has(cleanNum)) {
    const existing = activePairings.get(cleanNum);

    if (existing?.pairingCode) {
      return existing.pairingCode;
    }

    closePairing(cleanNum, false);
  }

  const baseDir = getPairingBaseDir();

  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, {
      recursive: true
    });
  }

  const sessionDir = path.join(
    baseDir,
    `pairing_${cleanNum}`
  );

  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, {
      recursive: true
    });
  }

  const { state, saveCreds } =
    await useMultiFileAuthState(sessionDir);

  let version;

  try {
    const vData =
      await fetchLatestBaileysVersion();

    version = vData.version;
  } catch (error) {
    console.warn(
      '⚠️ Could not fetch latest Baileys version, using fallback version.'
    );

    version = [2, 3000, 1043857760];
  }

  const conn = makeWASocket({
    printQRInTerminal: false,
    auth: state,
    version,
    browser: Browsers.ubuntu('Chrome'),
    syncFullHistory: false,
    logger: pino({
      level: 'silent'
    }),
    markOnlineOnConnect: false
  });

  const pairingData = {
    conn,
    sessionDir,
    pairingCode: null,
    connected: false,
    createdAt: Date.now()
  };

  activePairings.set(
    cleanNum,
    pairingData
  );

  conn.ev.on(
    'creds.update',
    async () => {
      try {
        await saveCreds();
      } catch (error) {
        console.error(
          '❌ Failed to save pairing credentials:',
          error
        );
      }
    }
  );

  conn.ev.on(
    'connection.update',
    ({ connection, lastDisconnect }) => {
      if (connection === 'open') {
        pairingData.connected = true;

        console.log(
          `✅ WhatsApp connected successfully: ${cleanNum}`
        );

        /*
         * IMPORTANT:
         * Do NOT close the socket here.
         *
         * The socket must remain alive after pairing.
         */
      }

      if (connection === 'close') {
        const current =
          activePairings.get(cleanNum);

        if (current?.conn === conn) {
          activePairings.delete(cleanNum);
        }

        console.log(
          `⚠️ Pairing connection closed: ${cleanNum}`
        );

        /*
         * Do not immediately delete the session.
         * Baileys may have already saved valid credentials.
         */
      }
    }
  );

  // Give Baileys enough time to establish its connection
  // before requesting the pairing code.
  await new Promise(resolve =>
    setTimeout(resolve, 3000)
  );

  let rawCode;

  try {
    rawCode =
      await conn.requestPairingCode(cleanNum);
  } catch (error) {
    console.error(
      '❌ Pairing code request failed:',
      error?.stack || error?.message || error
    );

    closePairing(cleanNum, true);

    throw new Error(
      `Failed to request code from WhatsApp: ${
        error?.message || 'Unknown error'
      }`
    );
  }

  if (!rawCode) {
    closePairing(cleanNum, false);

    throw new Error(
      'WhatsApp did not return a pairing code!'
    );
  }

  const formattedCode =
    rawCode.length === 8
      ? `${rawCode.slice(0, 4)}-${rawCode.slice(4, 8)}`
      : rawCode;

  pairingData.pairingCode =
    formattedCode.toUpperCase();

  console.log(
    `📱 Pairing code generated for ${cleanNum}: ${pairingData.pairingCode}`
  );

  /*
   * Keep the socket alive for 5 minutes.
   *
   * This gives the user enough time to:
   * WhatsApp → Linked Devices →
   * Link a device → Link with phone number
   *
   * If the account connects, we still keep the
   * connection alive and preserve the credentials.
   */
  setTimeout(() => {
    const current =
      activePairings.get(cleanNum);

    if (!current) {
      return;
    }

    /*
     * If it has connected, do not destroy it.
     */
    if (current.connected) {
      console.log(
        `✅ Pairing completed, keeping connection alive: ${cleanNum}`
      );
      return;
    }

    console.log(
      `⏰ Pairing timeout reached: ${cleanNum}`
    );

    closePairing(cleanNum, false);
  }, 5 * 60 * 1000);

  return pairingData.pairingCode;
}

export function getActivePairing(phoneNumber) {
  const cleanNum =
    normalizePhoneNumber(phoneNumber);

  return activePairings.get(cleanNum) || null;
}

export function getActivePairings() {
  return activePairings;
}

export function closeActivePairing(phoneNumber) {
  const cleanNum =
    normalizePhoneNumber(phoneNumber);

  closePairing(cleanNum, false);
                 }
