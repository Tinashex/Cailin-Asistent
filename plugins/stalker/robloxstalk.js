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

import axios from "axios";
import { simpleQuoted } from '../../lib/fakeQuoted.js';

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
      try {
        if (!ctx.args.length) return ctx.reply("❌ Masukkan username Roblox.\nContoh: .robloxstalk lelia_liyaa");
        
        const username = ctx.query;
        const { data } = await axios.get(`https://api.deltaku.web.id/api/stalk/roblox?q=${encodeURIComponent(username)}`);
        
        if (!data.status) return ctx.reply("❌ User tidak ditemukan");
        
        const d = data.data;
        const basic = d.basic_info;
        
        const teks = 
`┏━━━〔 ROBLOX STALKER 〕━━━┓
┃ Username: ${basic.username}
┃ Display Name: ${basic.display_name}
┃ User ID: ${basic.user_id}
┃ Created: ${basic.created_formatted}
┃ Verified Badge: ${basic.has_verified_badge ? "✅" : "❌"}
┃ Banned: ${basic.is_banned ? "🚫" : "✅"}
┃
┃ 📊 Stats:
┃ • Friends: ${d.friends?.count || 0}
┃ • Followers: ${d.followers?.count || 0}
┃ • Following: ${d.following?.count || 0}
┃ • Groups: ${d.groups?.count || 0}
┃ • Badges: ${d.badges?.count || 0}
┃ • Games: ${d.games?.count || 0}
┃
┃ 📝 Bio: ${basic.description || "-"}
┃
┃ 🔗 ${basic.profile_url}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`;

        await kyu.sendMessage(ctx.id, {
          image: { url: d.avatar?.image_url },
          caption: teks }, { quoted: simpleQuoted(ctx) });
      } catch (error) {
        ctx.reply(`❌ Error: ${error.message}`);
      }
    
};

handler.help        = ["robloxstalk","rblxstalk","stalkroblox"];
handler.tags        = ["stalker"];
handler.command     = /^(robloxstalk|rblxstalk|stalkroblox)$/i;
handler.description = "Menampilkan informasi profil Roblox";

export default handler;
