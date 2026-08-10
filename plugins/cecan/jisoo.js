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

import sendCecan from '../../lib/cecan.js';

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
  await sendCecan(kyu, ctx, 'Jiso');
};

handler.help        = ["jisoo", "jiso"];
handler.tags        = ["cecan"];
handler.command     = /^(jisoo|jiso)$/i;
handler.description = "Foto Jisoo BLACKPINK random via Kyzz API";

export default handler;
