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

import chalk from 'chalk';
import { getExpNeeded } from './tools.js';
import { contactQuoted } from '../lib/fakeQuoted.js';
import db from '../data/db.js';
import { addBotLog } from '../lib/logger.js';


export function checkIsOwner(kyu, ctx) {
  if (ctx.fromMe === true) return true;

  const botSelfJid = kyu?.user?.id || kyu?.user?.jid;

  const rawOwners = [
    ...(Array.isArray(global.owner) ? global.owner : (global.owner ? [global.owner] : [])),
    global.botNumber,
    global.bot?.author?.number,
    global.bot?.owner ? (Array.isArray(global.bot.owner) ? global.bot.owner : [global.bot.owner]) : [],
    botSelfJid,
  ].flat().filter(Boolean);

  const cleanNumber = (str) => {
    if (!str) return '';
    let num = String(str).split('@')[0].split(':')[0].replace(/\D/g, '');
    if (num.startsWith('0')) num = '62' + num.slice(1);
    return num;
  };

  const ownerNumbers = new Set(rawOwners.map(cleanNumber).filter(Boolean));
  const senderNumber = cleanNumber(ctx.sender);

  
  if (botSelfJid && cleanNumber(botSelfJid) === senderNumber) return true;

  if (ownerNumbers.has(senderNumber)) return true;
  if (global.db?.user?.[ctx.sender]?.ownerAcces === true) return true;

  return false;
}

export async function UpsertMsgHandle(kyu, msg, ctx, { cmd }) {
  
  if (ctx.sender && ctx.sender !== 'status@broadcast') {
    db.ensureUser(ctx.sender, ctx.pushname || ctx.sender.split('@')[0]);
  }

  
  if (ctx.group && ctx.id) {
    db.ensureGroup(ctx.id);
  }

  
  if (ctx.group && ctx.id) {
    const groupData = global.db?.group?.[ctx.id];
    if (groupData?.bans === true) return;
  }

  
  const user = global.db?.user?.[ctx.sender];
  if (user?.premium?.status && user.premium.expiredAt !== Number.MAX_SAFE_INTEGER) {
    if (user.premium.expiredAt <= Date.now()) {
      user.premium.status = false;
      user.premium.expiredAt = null;
      db.write(global.db);
    }
  }

  
  const loader = cmd || global.loader;
  const beforeHandlers = loader?.getBeforeHandlers?.() || [];
  for (const { fn } of beforeHandlers) {
    try {
      await fn(msg, { conn: kyu, db: { data: global.db?.cmd || {} } });
    } catch (e) {
      console.error(chalk.red('[BEFORE ERROR]'), e.message);
    }
  }

  if (!ctx.cmd) return;

  const startTime = Date.now();
  const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const pushName = ctx.pushname || msg.pushName || ctx.sender.split('@')[0];
  const senderJid = ctx.sender;
  const chatType = ctx.group ? '👥 GROUP' : '👤 PRIVATE';
  const fullCmd = ctx.prefix ? `${ctx.prefix}${ctx.cmd}` : ctx.cmd;

  addBotLog('CMD', `${pushName} (${chatType}): Executed command ${fullCmd}`);

  console.log(
    chalk.cyan(`\n╭───〔 `) + chalk.bold.yellowBright(fullCmd.toUpperCase()) + chalk.cyan(` 〕───⬿`) +
    chalk.gray(` (${timeStr})`) +
    chalk.white(`\n│ `) + chalk.cyan('• Message : ') + chalk.yellow.bold(fullCmd) + (ctx.query ? chalk.gray(` ${ctx.query}`) : '') +
    chalk.white(`\n│ `) + chalk.cyan('• Chat In : ') + chalk.magenta(chatType) + chalk.gray(` (${ctx.id})`) +
    chalk.white(`\n│ `) + chalk.cyan('• Sender  : ') + chalk.whiteBright(pushName) + chalk.gray(` (${senderJid})`) +
    chalk.cyan(`\n╰─────────────────────────⬿\n`)
  );

  const command = loader?.getCommand?.(ctx.cmd, (ctx.prefix ? ctx.text.slice(ctx.prefix.length) : ctx.text).trim());
  if (!command) {
    console.log(chalk.gray(` └─ `) + chalk.bgGray.white.bold(` UNKNOWN `) + ' ' + chalk.gray(`Command not found\n`));
    return;
  }

  const isOwner = checkIsOwner(kyu, ctx);

  
  if (command.register && !isOwner) {
    const userData = global.db?.user?.[ctx.sender];
    if (!userData?.name || userData.name === ctx.sender.split('@')[0]) {
      console.log(chalk.gray(` └─ `) + chalk.bgYellow.black.bold(` UNREGISTERED `) + ' ' + chalk.yellow(`User needs registration\n`));
      return ctx.reply(global.msg?.register || global.mess?.register || '❌ Kamu belum terdaftar!\nGunakan perintah *.register [nama]* terlebih dahulu.');
    }
  }

  
  if (command.owner && !isOwner) {
    console.log(chalk.gray(` └─ `) + chalk.bgRed.white.bold(` DENIED `) + ' ' + chalk.red(`Owner access required\n`));
    return ctx.reply(global.msg?.owner || global.mess?.owner || '❌ Perintah ini hanya untuk owner!');
  }

  
  if (command.group && !ctx.group) {
    console.log(chalk.gray(` └─ `) + chalk.bgRed.white.bold(` DENIED `) + ' ' + chalk.red(`Group chat required\n`));
    return ctx.reply(global.msg?.group || global.mess?.group || '❌ Perintah ini hanya bisa digunakan di grup!');
  }

  
  if (command.private && ctx.group) {
    console.log(chalk.gray(` └─ `) + chalk.bgRed.white.bold(` DENIED `) + ' ' + chalk.red(`Private chat required\n`));
    return ctx.reply(global.msg?.private || global.mess?.private || '❌ Perintah ini hanya bisa digunakan di chat pribadi!');
  }

  
  if (command.limit && !isOwner) {
    const userData = global.db?.user?.[ctx.sender];
    const isPremium = userData?.premium?.status === true;

    if (!isPremium) {
      if ((userData?.limit ?? 0) <= 0) {
        console.log(chalk.gray(` └─ `) + chalk.bgYellow.black.bold(` LIMIT EXHAUSTED `) + ' ' + chalk.yellow(`User out of limits\n`));
        return ctx.reply(global.msg?.limit || global.mess?.limit || '❌ *Limit kamu habis!*');
      }
      userData.limit = (userData.limit ?? 20) - 1;
      db.write(global.db);
    }
  }

  await command.execute(kyu, ctx, msg);
  const latency = Date.now() - startTime;
  console.log(
    chalk.gray(` └─ `) + chalk.bgGreen.black.bold(` SUCCESS `) + ' ' + chalk.greenBright(`Done in ${latency}ms\n`)
  );

  
  if (command.category === 'RPG' && global.db?.user?.[ctx.sender]) {
    const userData = global.db.user[ctx.sender];
    let needed = getExpNeeded(userData.level);
    while (userData.exp >= needed) {
      userData.exp -= needed;
      userData.level++;
      userData.hpMax += 20; userData.manaMax += 10;
      userData.atk += 3; userData.def += 2;
      userData.hp = userData.hpMax; userData.mana = userData.manaMax;
      await kyu.sendMessage(ctx.id, {
        text: `╭─〔 *LEVEL UP* 〕─⬿\n│\n│ ✨ Selamat *${userData.name}*!\n│ Naik ke level *${userData.level}*!\n│\n│ • HP Max : +20 (${userData.hpMax})\n│ • Mana   : +10 (${userData.manaMax})\n│ • ATK    : +3 (${userData.atk})\n│ • DEF    : +2 (${userData.def})\n│\n╰─〔 ${global.bot?.name} RPG 〕─⬿`,
              }, { quoted: contactQuoted(ctx) });
      needed = getExpNeeded(userData.level);
    }
    db.write(global.db);
  }
}
