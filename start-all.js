import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import './core/config.js';

console.clear();
console.log(chalk.bold.green('\n  ✨ CAILIN ASSISTANT v2.0.0 — WEB & BOT ENGINE  '));
console.log(chalk.gray('  -----------------------------------------------'));
console.log(chalk.dim('  • Baileys ESM Engine  | Next.js App Router'));
console.log(chalk.dim('  • Multi-Session Bot   | Live Dashboard Web'));
console.log(chalk.gray('  -----------------------------------------------\n'));

const isBuilt = fs.existsSync(path.join(process.cwd(), '.next'));
const webCmd = isBuilt ? ['next', 'start', '-p', '3000'] : ['next', 'dev', '-p', '3000'];

console.log(chalk.bold.cyan(`[1/2] 🌐 Web Interface (Port 3000) [${isBuilt ? 'Production' : 'Development'}]`));

const webProcess = spawn('npx', webCmd, {
  cwd: process.cwd(),
  stdio: 'inherit',
  shell: true
});

const cfToken = process.env.CLOUDFLARED_TOKEN || global.cloudflaredToken;

if (cfToken) {
  console.log(chalk.bold.cyan('[CF TUNNEL] ☁️ Cloudflare Tunnel Token terdeteksi! Memulai tunnel...'));
  
  let cfBinary = 'cloudflared';
  try {
    execSync('cloudflared --version', { stdio: 'ignore' });
  } catch (_) {
    if (fs.existsSync('/usr/local/bin/cloudflared')) cfBinary = '/usr/local/bin/cloudflared';
    else if (fs.existsSync('/usr/bin/cloudflared')) cfBinary = '/usr/bin/cloudflared';
    else if (fs.existsSync('./cloudflared')) cfBinary = './cloudflared';
  }

  const cfProcess = spawn(cfBinary, ['tunnel', 'run', '--token', cfToken], {
    stdio: 'inherit',
    shell: true
  });

  cfProcess.on('error', (err) => {
    console.error(chalk.red('[ERROR Cloudflare Tunnel]:'), err.message);
  });
}

console.log(chalk.bold.green('\n[2/2] 🤖 WhatsApp Bot Engine (Persistent Socket)...'));
const botProcess = spawn('node', ['index.js'], {
  cwd: process.cwd(),
  stdio: 'inherit',
  shell: true
});

botProcess.on('exit', (code) => {
  console.log(chalk.yellow(`[SYSTEM] WhatsApp Bot Engine berhenti (code: ${code}).`));
});
