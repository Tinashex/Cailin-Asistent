import fs from 'fs';
import path from 'path';
import os from 'os';

const isVercel = !!process.env.VERCEL;

// On Vercel use /tmp, on VPS use data folder
const LOG_FILE = isVercel 
  ? path.join(os.tmpdir(), 'bot_activity.json')
  : path.join(process.cwd(), 'data', 'bot_activity.json');

// In-memory logs for Vercel (serverless has no persistent disk)
let memoryLogs = [
  { id: 1, time: new Date().toLocaleTimeString('en-US'), tag: '[SYSTEM]', text: 'Baileys ESM Bot Engine initialized successfully.' },
  { id: 2, time: new Date().toLocaleTimeString('en-US'), tag: '[AUTH]', text: 'Session active. Waiting for pairing.' },
  { id: 3, time: new Date().toLocaleTimeString('en-US'), tag: '[WEB]', text: 'Dashboard ready. Generate pairing code below.' }
];

export function addBotLog(tag, text) {
  const time = new Date().toLocaleTimeString('en-US');
  const newEntry = { id: Date.now(), time, tag: `[${tag}]`, text };

  // Always add to memory
  memoryLogs.push(newEntry);
  if (memoryLogs.length > 50) memoryLogs = memoryLogs.slice(-50);

  // Try to save to file (will fail silently on Vercel, that's OK)
  try {
    let logs = [];
    if (fs.existsSync(LOG_FILE)) {
      logs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'));
    }
    logs.push(newEntry);
    if (logs.length > 50) logs = logs.slice(-50);
    
    const dir = path.dirname(LOG_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
  } catch (e) {
    // On Vercel file write fails — we already saved to memory, so ignore
  }

  return newEntry;
}

export function getBotLogs() {
  // On Vercel, return memory logs (filesystem is ephemeral)
  if (isVercel) {
    return memoryLogs;
  }

  // On VPS, try to read from file
  try {
    if (fs.existsSync(LOG_FILE)) {
      const fileLogs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'));
      if (fileLogs.length > 0) return fileLogs;
    }
  } catch (e) {}
  
  return memoryLogs;
   }
