import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import './core/config.js';

console.clear();
console.log(chalk.bold.green('\n  ✨ WATSONX-BOT v2.0.1 — WEB & BOT ENGINE  '));
console.log(chalk.gray('  -----------------------------------------------'));
console.log(chalk.dim('  • Baileys ESM Engine  | Next.js App Router'));
console.log(chalk.dim('  • Multi-Session Bot   | Live Dashboard Web'));
console.log(chalk.gray('  -----------------------------------------------\n'));

const isBuilt = fs.existsSync(path.join(process.cwd(), '.next'));
const nextPath = path.join(process.cwd(), 'node_modules', 'next', 'dist', 'bin', 'next');

if (!fs.existsSync(nextPath)) {
  console.error(chalk.red('[ERROR] Next.js not found. Run: npm install'));
  process.exit(1);
}

console.log(chalk.bold.cyan(`[1/2] 🌐 Web Interface (Port 3000) [${isBuilt ? 'Production' : 'Development'}]`));

// Use node + next bin directly instead of npx to avoid Vercel chunk errors with pino
const webCmd = isBuilt ? [nextPath, 'start', '-p', '3000'] : [nextPath, 'dev', '-p', '3000'];

const webProcess = spawn('node', webCmd, {
  cwd: process.cwd(),
  stdio: 'inherit',
  shell: false // shell: false is more stable on serverless hosts
});

webProcess.on('error', (err) => {
  console.error(chalk.red('[ERROR Web Server]:'), err.message);
});

const cfToken = process.env.CLOUDFLARED_TOKEN || global.cloudflaredToken;

if (cfToken) {
  console.log(chalk.bold.cyan('[CF TUNNEL] ☁️ Cloudflare Tunnel token detected! Starting tunnel...'));
  
  let cfBinary = 'cloudflared';
  try {
    execSync('cloudflared --version', { stdio: 'ignore' });
  } catch (_) {
    if (fs.existsSync('/usr/local/bin/cloudflared')) cfBinary = '/usr/local/bin/cloudflared';
    else if (fs.existsSync('/usr/bin/cloudflared')) cfBinary = '/usr/bin/cloudflared';
    else if (fs.existsSync('./cloudflared')) cfBinary = './cloudflared';
    else {
      console.warn(chalk.yellow('[WARN] cloudflared binary not found. Skipping tunnel.'));
      cfBinary = null;
    }
  }

  if (cfBinary) {
    const cfProcess = spawn(cfBinary, ['tunnel', 'run', '--token', cfToken], {
      stdio: 'inherit',
      shell: false
    });

    cfProcess.on('error', (err) => {
      console.error(chalk.red('[ERROR Cloudflare Tunnel]:'), err.message);
    });
  }
}

console.log(chalk.bold.green('\n[2/2] 🤖 WhatsApp Bot Engine (Persistent Socket)...'));
const botProcess = spawn('node', ['index.js'], {
  cwd: process.cwd(),
  stdio: 'inherit',
  shell: false
});

botProcess.on('exit', (code) => {
  console.log(chalk.yellow(`[SYSTEM] WhatsApp Bot Engine stopped (code: ${code}).`));
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log(chalk.gray('\n[SYSTEM] Shutting down...'));
  webProcess.kill();
  botProcess.kill();
  process.exit();
});