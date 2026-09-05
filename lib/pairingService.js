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

function cleanPhoneNumber(phoneNumber) {
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    throw new Error('Phone number is required!');
  }

  let number = phoneNumber.replace(/\D/g, '');

  if (number.startsWith('0')) {
    number = '263' + number.slice(1);
  }

  if (!number || number.length < 9) {
    throw new Error('Invalid phone number!');
  }

  return number;
}

async function getBaileysVersion() {
  try {
    const result = await fetchLatestBaileysVersion();

    if (result?.version) {
      return result.version;
    }
  } catch (error) {
    console.error(
      '⚠️ Failed to fetch latest Baileys version:',
      error?.message || error
    );
  }

  return [2, 3000, 1043857760];
}

function closePairing(pairing, removeSession = false) {
  if (!pairing) return;

  try {
    pairing.socket?.ws?.close();
  } catch {}

  try {
    pairing.socket?.end?.();
  } catch {}

  if (removeSession && pairing.sessionDir) {
    try {
      fs.rmSync(pairing.sessionDir, {
        recursive: true,
        force: true
      });
    } catch {}
  }
}

export async function requestRealBaileysPairingCode(phoneNumber) {
  const cleanNum = cleanPhoneNumber(phoneNumber);

  /*
   * Do not create multiple pairing sockets for the same number.
   */
  const existing = activePairings.get(cleanNum);

  if (existing) {
    try {
      if (existing.socket && !existing.socket.ws?.isClosed) {
        return existing.code;
      }
    } catch {}

    activePairings.delete(cleanNum);
  }

  /*
   * Vercel only gives temporary filesystem storage.
   * On a normal VPS we use the persistent session directory.
   */
  const isVercel =
    process.env.VERCEL === '1' ||
    process.env.VERCEL === 'true';

  const baseDir = isVercel
    ? path.join(os.tmpdir(), 'cailin-pairings')
    : path.join(process.cwd(), 'session', 'pairings');

  const sessionDir = path.join(baseDir, `pairing_${cleanNum}`);

  try {
    fs.mkdirSync(sessionDir, {
      recursive: true
    });
  } catch (error) {
    throw new Error(
      `Failed to create pairing session: ${error?.message || error}`
    );
  }

  let state;
  let saveCreds;

  try {
    const authState = await useMultiFileAuthState(sessionDir);
    state = authState.state;
    saveCreds = authState.saveCreds;
  } catch (error) {
    try {
      fs.rmSync(sessionDir, {
        recursive: true,
        force: true
      });
    } catch {}

    throw new Error(
      `Failed to initialize WhatsApp authentication: ${
        error?.message || error
      }`
    );
  }

  const version = await getBaileysVersion();

  let socket;

  try {
    socket = makeWASocket({
      version,
      auth: state,
      browser: Browsers.ubuntu('Chrome'),
      printQRInTerminal: false,
      syncFullHistory: false,
      markOnlineOnConnect: false,
      generateHighQualityLinkPreview: false,
      logger: pino({
        level: 'silent'
      })
    });
  } catch (error) {
    try {
      fs.rmSync(sessionDir, {
        recursive: true,
        force: true
      });
    } catch {}

    throw new Error(
      `Failed to start WhatsApp connection: ${
        error?.message || error
      }`
    );
  }

  const pairing = {
    socket,
    sessionDir,
    code: null,
    connected: false,
    createdAt: Date.now()
  };

  activePairings.set(cleanNum, pairing);

  socket.ev.on('creds.update', async () => {
    try {
      await saveCreds();
    } catch (error) {
      console.error(
        `⚠️ Failed to save pairing credentials for ${cleanNum}:`,
        error?.message || error
      );
    }
  });

  socket.ev.on('connection.update', update => {
    const { connection, lastDisconnect } = update;

    if (connection === 'open') {
      pairing.connected = true;

      console.log(
        `✅ WhatsApp connected successfully: ${cleanNum}`
      );
    }

    if (connection === 'close') {
      pairing.connected = false;

      console.log(
        `⚠️ WhatsApp pairing connection closed: ${cleanNum}`
      );

      const current = activePairings.get(cleanNum);

      if (current === pairing) {
        activePairings.delete(cleanNum);
      }

      if (lastDisconnect?.error) {
        console.error(
          `Pairing connection error for ${cleanNum}:`,
          lastDisconnect.error?.message ||
            String(lastDisconnect.error)
        );
      }
    }
  });

  /*
   * Give Baileys time to establish the socket before requesting
   * the pairing code.
   */
  await new Promise(resolve => setTimeout(resolve, 2500));

  let rawCode;

  try {
    rawCode = await socket.requestPairingCode(cleanNum);
  } catch (error) {
    activePairings.delete(cleanNum);

    closePairing(pairing, true);

    throw new Error(
      `Failed to request WhatsApp pairing code: ${
        error?.message || error
      }`
    );
  }

  if (!rawCode) {
    activePairings.delete(cleanNum);

    closePairing(pairing, true);

    throw new Error(
      'WhatsApp returned an empty pairing code!'
    );
  }

  const codeString = String(rawCode).replace(/[^a-zA-Z0-9]/g, '');

  if (codeString.length < 8) {
    activePairings.delete(cleanNum);

    closePairing(pairing, true);

    throw new Error(
      'WhatsApp returned an invalid pairing code!'
    );
  }

  const formattedCode =
    codeString.length === 8
      ? `${codeString.slice(0, 4)}-${codeString.slice(4, 8)}`
      : codeString;

  pairing.code = formattedCode.toUpperCase();

  console.log(
    `📱 Pairing code generated for ${cleanNum}: ${pairing.code}`
  );

  /*
   * IMPORTANT:
   *
   * Do NOT immediately close the socket.
   * WhatsApp still needs this socket alive while the user enters
   * the code on their phone.
   *
   * Keep it alive for up to 60 seconds.
   */
  pairing.cleanupTimer = setTimeout(() => {
    const current = activePairings.get(cleanNum);

    if (current === pairing) {
      activePairings.delete(cleanNum);
    }

    /*
     * On a VPS, keep the credentials if WhatsApp successfully
     * completed the pairing. If it never connected, clean up.
     */
    if (pairing.connected) {
      console.log(
        `💾 Keeping WhatsApp session for ${cleanNum}`
      );
      return;
    }

    console.log(
      `🧹 Pairing timeout reached for ${cleanNum}`
    );

    closePairing(pairing, true);
  }, 60 * 1000);

  return pairing.code;
}

export function getActivePairing(phoneNumber) {
  try {
    const cleanNum = cleanPhoneNumber(phoneNumber);
    return activePairings.get(cleanNum) || null;
  } catch {
    return null;
  }
}

export function getActivePairings() {
  return activePairings;
}

export function closeActivePairing(phoneNumber) {
  const pairing = getActivePairing(phoneNumber);

  if (!pairing) {
    return false;
  }

  try {
    clearTimeout(pairing.cleanupTimer);
  } catch {}

  const cleanNum = cleanPhoneNumber(phoneNumber);

  activePairings.delete(cleanNum);

  closePairing(pairing, false);

  return true;
}
