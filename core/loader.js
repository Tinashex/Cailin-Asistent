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

import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import chokidar from 'chokidar';
import chalk from 'chalk';

export class CommandLoader {
  constructor(opts = {}) {
    this.pluginsDir = path.resolve(opts.dir || path.join(process.cwd(), 'plugins'));
    this.logger = opts.logger || console;
    this.commandMap = new Map();
    this.fileMap = new Map();
    this.beforeHandlers = [];
    this.watcher = null;
    this._timers = new Map();
  }

  async _importFresh(filePath) {
    const href = pathToFileURL(filePath).href + `?t=${Date.now()}`;
    return import(/* turbopackIgnore: true */ href);
  }

  _normalize(exported, filePath) {
    
    if (typeof exported === 'function' && exported.command) {
      const fn = exported;
      const folderName = path.basename(path.dirname(filePath));
      const helpNames = Array.isArray(fn.help) ? fn.help : (fn.help ? [fn.help] : []);
      const primaryName = helpNames[0] || path.basename(filePath, '.js');
      const tagCategory = fn.tags?.[0] ? (fn.tags[0].charAt(0).toUpperCase() + fn.tags[0].slice(1)) : null;

      return [{
        name: primaryName.toLowerCase(),
        aliases: helpNames.slice(1).map(a => String(a).toLowerCase()),
        description: fn.description || '',
        category: tagCategory || fn.category || (folderName !== 'plugins' ? folderName.charAt(0).toUpperCase() + folderName.slice(1) : 'General'),
        tags: fn.tags || [],
        help: helpNames,
        limit: fn.limit || false,
        register: fn.register || false,
        owner: fn.owner || false,
        group: fn.group || false,
        private: fn.private || false,
        command: fn.command,
        before: fn.before || null,
        execute: async (kyu, ctx, msg) => {
          await fn(msg, {
            conn: kyu,
            kyu,
            db: { data: global.db?.cmd || {}, user: global.db?.user || {}, group: global.db?.group || {} },
            args: ctx.args,
            text: ctx.query,
            command: ctx.cmd,
            prefix: ctx.prefix || '',
            usedPrefix: ctx.prefix || '',
            ctx
          });
        },
        _raw: fn,
        filePath,
      }];
    }

    return [];
  }

  async loadPlugin(filePath) {
    filePath = path.resolve(filePath);
    try {
      const mod = await this._importFresh(filePath);
      const exported = mod?.default ?? mod;

      await this.unloadPlugin(filePath);

      const cmds = this._normalize(exported, filePath);
      if (!cmds.length) return;

      const names = [];
      for (const cmd of cmds) {
        const name = cmd.name;
        if (this.commandMap.has(name)) continue;

        this.commandMap.set(name, cmd);
        for (const al of cmd.aliases) {
          if (!this.commandMap.has(al)) this.commandMap.set(al, cmd);
        }
        names.push(name);

        if (typeof cmd.before === 'function') {
          this.beforeHandlers.push({ filePath, fn: cmd.before });
        }
      }

      if (names.length) {
        this.fileMap.set(filePath, names);
      }
    } catch (e) {
      this.logger.error(chalk.red(`[!] Gagal memuat plugin ${path.relative(this.pluginsDir, filePath)}:\n${e.stack || e.message || e}`));
    }
  }

  async unloadPlugin(filePath) {
    filePath = path.resolve(filePath);
    const names = this.fileMap.get(filePath);
    if (!names) return;
    for (const name of names) {
      const entry = this.commandMap.get(name);
      if (entry?.filePath === filePath) this.commandMap.delete(name);
      if (entry?.aliases) {
        for (const al of entry.aliases) {
          const e = this.commandMap.get(al);
          if (e?.filePath === filePath) this.commandMap.delete(al);
        }
      }
    }
    this.beforeHandlers = this.beforeHandlers.filter(b => b.filePath !== filePath);
    this.fileMap.delete(filePath);
  }

  async reloadPlugin(filePath) {
    filePath = path.resolve(filePath);
    await this.unloadPlugin(filePath);
    await this.loadPlugin(filePath);
  }

  _walkDir(dir) {
    const results = [];
    if (!fs.existsSync(dir)) return results;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) results.push(...this._walkDir(full));
      else if (entry.isFile() && entry.name.endsWith('.js')) results.push(full);
    }
    return results;
  }

  async loadAll() {
    const files = this._walkDir(this.pluginsDir);
    const results = await Promise.allSettled(files.map(f => this.loadPlugin(f)));
    
    let failedCount = 0;
    results.forEach((res, i) => {
      if (res.status === 'rejected') {
        failedCount++;
        this.logger.error(chalk.red(`[!] Gagal memuat plugin ${path.relative(this.pluginsDir, files[i])}: ${res.reason?.stack || res.reason?.message || res.reason}`));
      }
    });

    if (failedCount > 0) {
      this.logger.warn(chalk.yellow(`[⚠️] Terdapat ${failedCount} plugin yang gagal dimuat!`));
    }
  }

  _debounce(key, fn, ms = 150) {
    if (this._timers.has(key)) clearTimeout(this._timers.get(key));
    const t = setTimeout(() => { this._timers.delete(key); fn(); }, ms);
    this._timers.set(key, t);
  }

  watch() {
    if (this.watcher) return;
    this.watcher = chokidar.watch(this.pluginsDir, { ignoreInitial: true, persistent: true, depth: 5 });
    this.watcher
      .on('add', fp => { if (fp.endsWith('.js')) this._debounce(fp, () => this.loadPlugin(fp)); })
      .on('change', fp => { if (fp.endsWith('.js')) this._debounce(fp, () => this.reloadPlugin(fp)); })
      .on('unlink', fp => { if (fp.endsWith('.js')) this._debounce(fp, () => this.unloadPlugin(fp)); });
  }

  getCommand(name, fullText = '') {
    if (!name && !fullText) return undefined;
    
    const cleanName = name ? String(name).toLowerCase().trim() : '';
    if (cleanName) {
      const direct = this.commandMap.get(cleanName);
      if (direct) return direct;
    }

    if (fullText) {
      const byRegex = this.getCommandByRegex(fullText);
      if (byRegex) return byRegex;
    }

    if (cleanName) {
      const byNameRegex = this.getCommandByRegex(cleanName);
      if (byNameRegex) return byNameRegex;
    }

    for (const [, cmd] of this.commandMap) {
      if (cmd.name === cleanName || cmd.aliases?.includes(cleanName)) return cmd;
    }

    return undefined;
  }

  getCommandByRegex(text) {
    for (const [, cmd] of this.commandMap) {
      if (cmd.command instanceof RegExp) {
        cmd.command.lastIndex = 0;
        if (cmd.command.test(text)) return cmd;
      }
    }
    return undefined;
  }

  listCommands() {
    return [...new Set(this.commandMap.keys())];
  }

  getCommands() {
    return Object.fromEntries(this.commandMap);
  }

  getCommandsByCategory() {
    const cats = {};
    const seen = new Set();
    for (const [, cmd] of this.commandMap) {
      if (!cmd || !cmd.name) continue;
      const key = cmd.filePath || cmd.name;
      if (seen.has(key)) continue;
      seen.add(key);

      if (cmd._raw?.hidden || cmd._raw?.disabled) continue;

      const cat = (cmd.category || 'general').toLowerCase();
      if (!cats[cat]) cats[cat] = [];
      cats[cat].push({ name: cmd.name, description: cmd.description, help: cmd.help });
    }
    return cats;
  }

  getBeforeHandlers() {
    return this.beforeHandlers;
  }
}