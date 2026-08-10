import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(process.cwd(), 'data', 'bot_activity.json');

export function addBotLog(tag, text) {
  const time = new Date().toLocaleTimeString('id-ID');
  const newEntry = { id: Date.now(), time, tag: `[${tag}]`, text };

  let logs = [];
  try {
    if (fs.existsSync(LOG_FILE)) {
      logs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'));
    }
  } catch (e) {}

  logs.push(newEntry);
  if (logs.length > 50) logs = logs.slice(logs.length - 50);

  try {
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
  } catch (e) {}

  return newEntry;
}

export function getBotLogs() {
  try {
    if (fs.existsSync(LOG_FILE)) {
      return JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'));
    }
  } catch (e) {}
  return [
    { id: 1, time: new Date().toLocaleTimeString('id-ID'), tag: '[SYSTEM]', text: 'Baileys ESM Bot Engine initialized successfully.' }
  ];
}
