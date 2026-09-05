import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import './core/config.js';

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';

if (isVercel) {
  console.log(
    chalk.yellow(
      '[INFO] Running on Vercel — local Next.js/Baileys starter is disabled.'
    )
  );
  console.log(
    chalk.yellow(
      '[INFO] Vercel runs the Next.js application automatically.'
    )
  );
  process.exit(0);
}

console.clear();

console.log(
  chalk.bold.green(
    '\n  ✨ WATSONX-BOT v2.0.1 — WEB & BOT ENGINE  '
  )
);

console.log(
  chalk.gray(
    '  -----------------------------------------------'
  )
);

console.log(
  chalk.dim(
    '  • Baileys ESM Engine  | Next.js App Router'
  )
);

console.log(
  chalk.dim(
    '  • Multi-Session Bot   | Live Dashboard Web'
  )
);

console.log(
  chalk.gray(
    '  -----------------------------------------------\n'
  )
);

const rootDir = process.cwd();

const nextPath = path.join(
  rootDir,
  'node_modules',
  'next',
  'dist',
  'bin',
  'next'
);

const nextBuildDir = path.join(
  rootDir,
  '.next'
);

if (!fs.existsSync(nextPath)) {
  console.error(
    chalk.red(
      '[ERROR] Next.js was not found.'
    )
  );

  console.error(
    chalk.yellow(
      '[INFO] Run: npm install'
    )
  );

  process.exit(1);
}

const isBuilt =
  fs.existsSync(nextBuildDir);

const webMode =
  isBuilt
    ? 'Production'
    : 'Development';

console.log(
  chalk.bold.cyan(
    `[1/2] 🌐 Web Interface (Port 3000) [${webMode}]`
  )
);

const webArgs = isBuilt
  ? ['start', '-p', '3000']
  : ['dev', '-p', '3000'];

let webProcess = null;
let botProcess = null;
let cfProcess = null;

let shuttingDown = false;

function startWebServer() {
  try {
    webProcess = spawn(
      process.execPath,
      [nextPath, ...webArgs],
      {
        cwd: rootDir,
        stdio: 'inherit',
        shell: false,
        env: {
          ...process.env,
          NODE_ENV: isBuilt
            ? 'production'
            : process.env.NODE_ENV || 'development'
        }
      }
    );

    webProcess.on(
      'error',
      error => {
        console.error(
          chalk.red(
            '[ERROR Web Server]:'
          ),
          error.message
        );
      }
    );

    webProcess.on(
      'exit',
      (code, signal) => {
        if (shuttingDown) {
          return;
        }

        console.log(
          chalk.yellow(
            `[SYSTEM] Next.js stopped (code: ${code ?? 'null'}, signal: ${signal ?? 'none'}).`
          )
        );
      }
    );
  } catch (error) {
    console.error(
      chalk.red(
        '[ERROR] Failed to start Next.js:'
      ),
      error
    );

    process.exit(1);
  }
}

startWebServer();

const cfToken =
  process.env.CLOUDFLARED_TOKEN ||
  global.cloudflaredToken;

if (cfToken) {
  console.log(
    chalk.bold.cyan(
      '[CF TUNNEL] ☁️ Cloudflare Tunnel token detected! Starting tunnel...'
    )
  );

  let cfBinary = 'cloudflared';

  try {
    execSync(
      'cloudflared --version',
      {
        stdio: 'ignore'
      }
    );
  } catch (_) {
    const possiblePaths = [
      '/usr/local/bin/cloudflared',
      '/usr/bin/cloudflared',
      path.join(rootDir, 'cloudflared')
    ];

    const foundPath =
      possiblePaths.find(
        file => fs.existsSync(file)
      );

    if (foundPath) {
      cfBinary = foundPath;
    } else {
      console.warn(
        chalk.yellow(
          '[WARN] cloudflared binary not found. Skipping Cloudflare Tunnel.'
        )
      );

      cfBinary = null;
    }
  }

  if (cfBinary) {
    try {
      cfProcess = spawn(
        cfBinary,
        [
          'tunnel',
          'run',
          '--token',
          cfToken
        ],
        {
          cwd: rootDir,
          stdio: 'inherit',
          shell: false,
          env: {
            ...process.env
          }
        }
      );

      cfProcess.on(
        'error',
        error => {
          console.error(
            chalk.red(
              '[ERROR Cloudflare Tunnel]:'
            ),
            error.message
          );
        }
      );

      cfProcess.on(
        'exit',
        (code, signal) => {
          if (shuttingDown) {
            return;
          }

          console.log(
            chalk.yellow(
              `[CF TUNNEL] Tunnel stopped (code: ${code ?? 'null'}, signal: ${signal ?? 'none'}).`
            )
          );
        }
      );
    } catch (error) {
      console.error(
        chalk.red(
          '[ERROR Cloudflare Tunnel]:'
        ),
        error.message
      );
    }
  }
} else {
  console.log(
    chalk.dim(
      '[CF TUNNEL] No CLOUDFLARED_TOKEN configured. Tunnel disabled.'
    )
  );
}

console.log(
  chalk.bold.green(
    '\n[2/2] 🤖 WhatsApp Bot Engine (Persistent Socket)...'
  )
);

function startBot() {
  try {
    botProcess = spawn(
      process.execPath,
      ['index.js'],
      {
        cwd: rootDir,
        stdio: 'inherit',
        shell: false,
        env: {
          ...process.env
        }
      }
    );

    botProcess.on(
      'error',
      error => {
        console.error(
          chalk.red(
            '[ERROR WhatsApp Bot]:'
          ),
          error.message
        );
      }
    );

    botProcess.on(
      'exit',
      (code, signal) => {
        if (shuttingDown) {
          return;
        }

        console.log(
          chalk.yellow(
            `[SYSTEM] WhatsApp Bot Engine stopped (code: ${code ?? 'null'}, signal: ${signal ?? 'none'}).`
          )
        );

        /*
         * Do not automatically spawn another bot here.
         *
         * index.js already contains its own Baileys
         * reconnection/session management.
         *
         * Starting another index.js process automatically
         * could create duplicate WhatsApp connections.
         */
      }
    );
  } catch (error) {
    console.error(
      chalk.red(
        '[ERROR] Failed to start WhatsApp Bot:'
      ),
      error
    );

    process.exit(1);
  }
}

startBot();

console.log(
  chalk.green(
    '\n[SYSTEM] Web interface and WhatsApp bot engine started.'
  )
);

function killProcess(child, name) {
  if (!child || child.killed) {
    return;
  }

  try {
    console.log(
      chalk.gray(
        `[SYSTEM] Stopping ${name}...`
      )
    );

    child.kill('SIGTERM');
  } catch (error) {
    console.error(
      chalk.red(
        `[SYSTEM] Failed stopping ${name}:`
      ),
      error.message
    );
  }
}

function shutdown(signal = 'SIGTERM') {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  console.log(
    chalk.gray(
      `\n[SYSTEM] Received ${signal}. Shutting down...`
    )
  );

  killProcess(
    cfProcess,
    'Cloudflare Tunnel'
  );

  killProcess(
    webProcess,
    'Next.js Web Server'
  );

  killProcess(
    botProcess,
    'WhatsApp Bot Engine'
  );

  setTimeout(() => {
    try {
      if (
        webProcess &&
        !webProcess.killed
      ) {
        webProcess.kill('SIGKILL');
      }
    } catch (_) {}

    try {
      if (
        botProcess &&
        !botProcess.killed
      ) {
        botProcess.kill('SIGKILL');
      }
    } catch (_) {}

    try {
      if (
        cfProcess &&
        !cfProcess.killed
      ) {
        cfProcess.kill('SIGKILL');
      }
    } catch (_) {}

    process.exit(0);
  }, 5000);
}

process.once(
  'SIGINT',
  () => shutdown('SIGINT')
);

process.once(
  'SIGTERM',
  () => shutdown('SIGTERM')
);

process.on(
  'uncaughtException',
  error => {
    console.error(
      chalk.red(
        '[FATAL] Uncaught Exception:'
      ),
      error
    );
  }
);

process.on(
  'unhandledRejection',
  reason => {
    console.error(
      chalk.red(
        '[FATAL] Unhandled Promise Rejection:'
      ),
      reason
    );
  }
);
