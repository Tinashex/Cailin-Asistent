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
import { simpleQuoted } from '../../lib/fakeQuoted.js';

let handler = async (m, { kyu, ctx, args, text, command, prefix }) => {
  try {
    const query = ctx.query?.trim() || text?.trim() || "";
    if (!query) {
      return ctx.reply(
        `🔍 *ADVANCED WEB SCRAPER & DETECTOR*\n\n` +
        `*Cara Penggunaan:*\n` +
        `• \`${prefix}${command} https://example.com\`\n` +
        `• \`${prefix}${command} https://example.com --html\` (Scrape HTML)\n` +
        `• \`${prefix}${command} https://example.com --text\` (Hanya Teks)\n\n` +
        `*Fitur Deteksi Otomatis:*\n` +
        `✔ Scrape Teks / Headings / Links\n` +
        `✔ Deteksi Sitekey (reCAPTCHA v2/v3, hCaptcha, Turnstile)\n` +
        `✔ Deteksi JWT Token & Auth Bearer\n` +
        `✔ Extrak Meta Data & API Endpoints`
      );
    }

    const isHtmlMode = query.includes("--html");
    const isTextMode = query.includes("--text");
    const cleanUrl = query.replace(/--(html|text)/gi, "").trim();

    if (!/^https?:\/\//i.test(cleanUrl)) {
      return ctx.reply("❌ Awali URL dengan http:// atau https://");
    }

    await ctx.reply("🕵️ *Menganalisis & Mengunduh Data Website...*");

    const res = await axios.get(cleanUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5"
      },
      timeout: 25000,
    });

    const html = typeof res.data === "string" ? res.data : JSON.stringify(res.data);
    const $ = cheerio.load(html);

    
    const sitekeys = [];
    $("[data-sitekey]").each((_, el) => {
      const key = $(el).attr("data-sitekey");
      if (key) sitekeys.push({ type: "data-sitekey", key });
    });

    const turnstileMatches = html.match(/(?:turnstile|sitekey)['"]?\s*[:=]\s*['"]([a-zA-Z0-9_-]{10,80})['"]/gi) || [];
    const recaptchaMatches = html.match(/6L[a-zA-Z0-9_-]{38}/g) || [];
    const hcaptchaMatches = html.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi) || [];

    turnstileMatches.forEach(m => sitekeys.push({ type: "Turnstile/Generic", key: m }));
    recaptchaMatches.forEach(m => sitekeys.push({ type: "reCAPTCHA v2/v3", key: m }));
    hcaptchaMatches.forEach(m => sitekeys.push({ type: "hCaptcha", key: m }));

    const uniqueSitekeys = [...new Set(sitekeys.map(s => `• [${s.type}] ${s.key}`))];

    
    const jwtRegex = /eyJ[a-zA-Z0-9_-]{10,}\.eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}/g;
    const jwtMatches = [...new Set(html.match(jwtRegex) || [])];

    
    const title = $("title").text().trim() || "Tidak ada judul";
    const metaDesc = $('meta[name="description"]').attr("content") || $('meta[property="og:description"]').attr("content") || "-";
    const h1s = $("h1").map((_, el) => $(el).text().trim()).get().slice(0, 5);

    
    const links = [];
    $("a[href]").each((_, el) => {
      const href = $(el).attr("href");
      if (href && !href.startsWith("#") && !href.startsWith("javascript:")) {
        links.push(href);
      }
    });
    const uniqueLinks = [...new Set(links)].slice(0, 10);

    if (isHtmlMode) {
      return ctx.reply(`📄 *RAW HTML OUTPUT (4000 char limit)*:\n\`\`\`html\n${html.slice(0, 3900)}\n\`\`\``);
    }

    let caption = `🌐 *WEB SCRAPE & AUDIT RESULT*\n\n`;
    caption += `• *URL:* ${cleanUrl}\n`;
    caption += `• *Title:* ${title}\n`;
    caption += `• *Description:* ${metaDesc.slice(0, 150)}\n\n`;

    caption += `🔐 *CAPTCHA & SITEKEYS FOUND (${uniqueSitekeys.length}):*\n`;
    caption += uniqueSitekeys.length > 0 ? `${uniqueSitekeys.join("\n")}\n\n` : `• Tidak ada sitekey publik terdeteksi\n\n`;

    caption += `🔑 *JWT TOKENS DETECTED (${jwtMatches.length}):*\n`;
    if (jwtMatches.length > 0) {
      caption += jwtMatches.map((token, i) => `• Token ${i + 1}: \`${token.slice(0, 40)}...\``).join("\n") + "\n\n";
    } else {
      caption += `• Tidak ada JWT token ditemukan\n\n`;
    }

    if (h1s.length > 0) {
      caption += `📌 *HEADINGS (H1):*\n${h1s.map(h => `• ${h}`).join("\n")}\n\n`;
    }

    if (uniqueLinks.length > 0) {
      caption += `🔗 *LINKS / ENDPOINTS (${uniqueLinks.length}):*\n${uniqueLinks.map(l => `• ${l}`).join("\n")}\n\n`;
    }

    if (isTextMode) {
      const pageText = $("body").text().replace(/\s+/g, " ").trim();
      caption += `📝 *BODY TEXT SAMPLE:*\n${pageText.slice(0, 1000)}...`;
    }

    return kyu.sendMessage(ctx.id, { text: caption.trim() }, { quoted: simpleQuoted(ctx) });

  } catch (error) {
    const errMsg = error.response ? `HTTP ${error.response.status} ${error.response.statusText}` : error.message;
    return ctx.reply(`💥 *Scrape Error:* ${errMsg}`);
  }
};

handler.help        = ["webscrape", "scrapeweb", "webscraping", "sitekey", "jwt"];
handler.tags        = ["tools"];
handler.command     = /^(webscrape|scrapeweb|webscraping|sitekey|jwt)$/i;
handler.description = "Scrape web, deteksi Sitekey Captcha (Turnstile/reCAPTCHA/hCaptcha) & JWT Token";

export default handler;
