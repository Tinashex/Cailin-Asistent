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

import axios from 'axios';

const handler = async (m, { conn: kyu }) => {
  
  const jid = m.chat || m.key?.remoteJid;
  
  if (!jid) return console.error("JID tidak ditemukan!");

  try {
    const { data } = await axios.get('https://pastebin.com/raw/j9Hrx7V4');
    const list = data.indonesia;
    const random = list[Math.floor(Math.random() * list.length)];
    
    await kyu.sendMessage(jid, { 
      image: { url: random }, 
      caption: 'Cecan Indonesia' 
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    
    await kyu.sendMessage(jid, { text: 'Terjadi kesalahan saat mengambil gambar.' }, { quoted: m });
  }
};

handler.help = ['indonesia', 'indo'];
handler.command = /^(indonesia|indo)$/i;
handler.tags = ['cecan'];
handler.limit = true;

export default handler;
