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
import * as cheerio from "cheerio";
import yts from "yt-search";
import { Buffer } from "buffer";
import { contactQuoted, simpleQuoted } from '../../lib/fakeQuoted.js';

function convertMs(ms) {
  const m = Math.floor(ms / 60000);
  const s = ((ms % 60000) / 1000).toFixed(0);
  return m + ":" + (Number(s) < 10 ? "0" : "") + s;
}

async function spotifyTokenGen(client) {
  return axios.post(
    "https://accounts.spotify.com/api/token",
    "grant_type=client_credentials",
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + Buffer.from(client).toString("base64")
      },
      timeout: 30000
    }
  ).then(r => ({
    status: true,
    token: r.data.access_token
  })).catch(() => ({ status: false }));
}

async function getSpotifyToken() {
  let t1 = await spotifyTokenGen("7bbae52593da45c69a27c853cc22edff:88ae1f7587384f3f83f62a279e7f87af");
  if (t1.status) return t1.token;
  let t2 = await spotifyTokenGen("f97b33bf590840f7ab31e7d372b1a1bf:d700cceafc7c4de483b2ec3850f97a6a");
  if (t2.status) return t2.token;
  return null;
}

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
      if (!ctx.args.length) return ctx.reply("❌ Masukkan judul lagu");
      
      try {
        const token = await getSpotifyToken();
        if (!token) return ctx.reply("❌ Auth Spotify gagal");
        
        const res = await axios.get("https://api.spotify.com/v1/search", {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            q: ctx.query,
            type: "track",
            limit: 5,
            market: "US"
          }
        });
        
        const items = res.data.tracks.items;
        if (!items.length) return ctx.reply("❌ Lagu tidak ditemukan");
        
        const album = items.map(v => ({
          image: { url: v.album.images[0]?.url },
          caption: 
`┏━━━〔 SPOTIFY TRACK 〕━━━┓
┃ Title : ${v.artists[0].name} - ${v.name}
┃ Artist: ${v.artists[0].name}
┃ Album : ${v.album.name}
┃ Durasi: ${convertMs(v.duration_ms)}
┃ Rilis : ${v.album.release_date}
┗━━━━━━━━━━━━━━━━━━━━┛
🔗 Link: ${v.external_urls.spotify}`
        }));
        
        await kyu.sendMessage(ctx.id, { album }, { quoted: simpleQuoted(ctx) });
      } catch (error) {
        ctx.reply(`❌ Gagal mengambil data Spotify: ${error.message}`);
      }
    
};

handler.help        = ["spotifysearch","spotify-search","spsearch"];
handler.tags        = ["search"];
handler.command     = /^(spotifysearch|spotify-search|spsearch)$/i;
handler.description = "Mencari lagu di Spotify";

export default handler;
