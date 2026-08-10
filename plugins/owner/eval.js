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

import util from 'util';
import { exec } from 'child_process';
import { simpleQuoted } from '../../lib/fakeQuoted.js';

const execAsync = util.promisify(exec);

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
  const sock = kyu || ctx?.conn;
  const cmdName = (command || '').toLowerCase();
  const rawInput = (ctx.query || text || '').trim();

  
  if (['$', 'exec', 'sh', 'terminal'].includes(cmdName)) {
    const code = (ctx.quoted?.text || rawInput).trim();
    if (!code) return ctx.reply('❌ Masukkan perintah shell yang ingin dijalankan!');

    try {
      const { stdout, stderr } = await execAsync(code, { timeout: 30000, maxBuffer: 1024 * 1024 });
      const output = (stdout || stderr || '').trim();
      if (!output) return ctx.reply('(no output)');
      await sock.sendMessage(m.chat || ctx.id, { text: output.slice(0, 4000) }, { quoted: simpleQuoted(ctx) });
    } catch (e) {
      await sock.sendMessage(m.chat || ctx.id, { text: e.message.slice(0, 4000) }, { quoted: simpleQuoted(ctx) });
    }
    return;
  }

  
  if (['>', '=>', 'eval', 'ev'].includes(cmdName)) {
    const code = (ctx.quoted?.text || rawInput).trim();
    if (!code) return ctx.reply('❌ Masukkan kode JavaScript yang ingin dievaluasi!');

    try {
      let evalCode = code;
      if (cmdName === '=>') {
        evalCode = code.startsWith('return') ? `(async () => { ${code} })()` : `(async () => { return ${code} })()`;
      } else {
        evalCode = `(async () => { ${code} })()`;
      }

      let result = await eval(evalCode);
      if (typeof result !== 'string') {
        result = util.inspect(result, { depth: 2, showHidden: false });
      }
      await sock.sendMessage(m.chat || ctx.id, { text: '```' + String(result).slice(0, 4000) + '```' }, { quoted: simpleQuoted(ctx) });
    } catch (e) {
      await sock.sendMessage(m.chat || ctx.id, { text: '```' + e.message.slice(0, 4000) + '```' }, { quoted: simpleQuoted(ctx) });
    }
    return;
  }
};

handler.help        = [">", "=>", "$", "eval", "ev", "exec", "sh", "terminal"];
handler.tags        = ["owner"];
handler.command     = /^([>=$]|eval|ev|exec|sh|terminal)$/i;
handler.description = "Evaluasi kode JS dan terminal shell secara langsung";
handler.owner       = true;

export default handler;
