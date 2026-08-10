import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { message, character } = await request.json();

    if (!message || message.trim() === '') {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    const query = message.toLowerCase();
    let reply = '';

    if (query.includes('halo') || query.includes('hi') || query.includes('p') || query.includes('helo')) {
      reply = 'Halo master! 🎀 Akuh Cailin Assistant, siap membantu kamu kapan saja. Mau nyobain fitur AI, downloader, atau RPG?';
    } else if (query.includes('siapa kamu') || query.includes('bot')) {
      reply = 'Aku adalah **Cailin Assistant v2.0.0**, WhatsApp & Web Bot Assistant dengan gaya Shizuku! Dibuat dengan cinta oleh Mommy Kyu ✨';
    } else if (query.includes('pairing') || query.includes('login') || query.includes('connect')) {
      reply = 'Untuk menghubungkan WhatsApp kamu ke Cailin Bot, gunakan widget **WhatsApp Pairing Code** di atas atau masukkan nomor kamu di menu Pairing!';
    } else if (query.includes('fitur') || query.includes('command') || query.includes('menu')) {
      reply = 'Cailin memiliki 12 kategori fitur unggulan:\n1. 🤖 **AI Assistant** (Chat GPT, Character AI)\n2. 🎮 **RPG & Games** (Adventure, Leveling)\n3. 📥 **Downloader** (TikTok, IG, YouTube, Spotify)\n4. 🛠️ **Tools & Utilities**\n5. 🎨 **Maker & Ephoto**\n6. 🔍 **Search & Stalker**\n\nScroll ke bagian **Command Explorer** di bawah untuk daftar lengkapnya!';
    } else if (query.includes('owner') || query.includes('creator')) {
      reply = 'Developer utama Cailin Assistant adalah **Mommy Kyu** 💕\nTelegram: @kyuugperawan\nWebsite API: https://api.kyzzz.eu.cc';
    } else {
      
      reply = `✨ Cailin sedang memproses respon untuk "${message}"...\n\n[System Note]: Aku bisa membantumu mencari gambar, download video, bikin stiker, hingga ngobrol AI santai. Coba ketik command seperti \`.ai\`, \`.tiktok\`, atau \`.sticker\`! 🌸`;
    }

    return NextResponse.json({
      status: 'success',
      response: reply,
      timestamp: new Date().toISOString(),
      character: character || 'Cailin'
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
