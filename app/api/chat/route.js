import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { message, character } = await request.json();

    if (!message || message.trim() === '') {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    const query = message.toLowerCase();
    let reply = '';

    if (query.includes('hello') || query.includes('hi') || query.includes('p') || query.includes('helo')) {
      reply = 'Hello master! 🎀 I\'m Cailin Assistant, ready to help you anytime. Want to try AI features, downloader, or RPG?';
    } else if (query.includes('who are you') || query.includes('bot')) {
      reply = 'I am **Cailin Assistant v2.0.0**, WhatsApp & Web Bot Assistant with Shizuku style! Made with love by Mommy Kyu ✨';
    } else if (query.includes('pairing') || query.includes('login') || query.includes('connect')) {
      reply = 'To connect your WhatsApp to Cailin Bot, use the **WhatsApp Pairing Code** widget above or enter your number in the Pairing menu!';
    } else if (query.includes('feature') || query.includes('command') || query.includes('menu')) {
      reply = 'Cailin has 12 featured categories:\n1. 🤖 **AI Assistant** (Chat GPT, Character AI)\n2. 🎮 **RPG & Games** (Adventure, Leveling)\n3. 📥 **Downloader** (TikTok, IG, YouTube, Spotify)\n4. 🛠️ **Tools & Utilities**\n5. 🎨 **Maker & Ephoto**\n6. 🔍 **Search & Stalker**\n\nScroll down to the **Command Explorer** section below for the full list!';
    } else if (query.includes('owner') || query.includes('creator')) {
      reply = 'The main developer of Cailin Assistant is **Mommy Kyu** 💕\nTelegram: @kyuugperawan\nAPI Website: https://api.kyzzz.eu.cc';
    } else {
      reply = `✨ Cailin is processing a response for "${message}"...\n\n[System Note]: I can help you search for images, download videos, make stickers, and have casual AI chats. Try typing commands like \`.ai\`, \`.tiktok\`, or \`.sticker\`! 🌸`;
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
