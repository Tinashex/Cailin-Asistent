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
import { load } from "cheerio";

export default async function mediafireDl(url) {
  if (!/^https?:\/\/(www\.)?mediafire\.com\/file\//i.test(url)) {
    throw new Error("Invalid MediaFire URL");
  }

  const { data } = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      Accept: "text/html",
    },
    timeout: 15000,
  });

  const $ = load(data);
  const downloadUrl = $("#downloadButton").attr("href");
  if (!downloadUrl) {
    throw new Error("Download link not found");
  }
  const filename =
    $(".filename").text().trim() || downloadUrl.split("/").pop().split("?")[0];
  const filesize = $(".details li")
    .first()
    .text()
    .replace(/Size:\s*/i, "")
    .trim();

  return {
    filename,
    filesize,
    downloadUrl,
  };
}
