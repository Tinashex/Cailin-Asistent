import { NextResponse } from 'next/server';

export async function GET() {
  const categories = [
    {
      name: 'ai',
      title: '🤖 AI Assistant',
      description: 'Perintah kecerdasan buatan, ChatGPT, Character AI, & Voice Synth',
      commands: [
        { name: 'ai', usage: '.ai <pertanyaan>', desc: 'Tanya jawab serba tahu dengan Cailin AI' },
        { name: 'cai', usage: '.cai <pesan>', desc: 'Ngobrol roleplay anime ala Shizuku & Arisu' },
        { name: 'gpt4', usage: '.gpt4 <prompt>', desc: 'Generasi teks lanjutan menggunakan GPT-4' },
        { name: 'animediff', usage: '.animediff <prompt>', desc: 'Generate gambar anime AI super HD' }
      ]
    },
    {
      name: 'downloader',
      title: '📥 Downloader Tools',
      description: 'Pengunduh media gratis tanpa watermark',
      commands: [
        { name: 'tiktok', usage: '.tiktok <url>', desc: 'Download video TikTok MP4 / audio MP3 tanpa watermark' },
        { name: 'ig', usage: '.ig <url>', desc: 'Download Reels & Post Instagram' },
        { name: 'ytmp3', usage: '.ytmp3 <url>', desc: 'Convert video YouTube menjadi MP3 Audio' },
        { name: 'ytmp4', usage: '.ytmp4 <url>', desc: 'Download video YouTube HD' },
        { name: 'spotify', usage: '.spotify <link/judul>', desc: 'Download lagu dari Spotify' }
      ]
    },
    {
      name: 'rpg',
      title: '🎮 RPG & Game Fantasy',
      description: 'Petualangan RPG, berburu monster, & leveling',
      commands: [
        { name: 'adventure', usage: '.adventure', desc: 'Mulai petualangan mencari item & exp' },
        { name: 'hunt', usage: '.hunt', desc: 'Berburu monster dungeon untuk exp & gold' },
        { name: 'profile', usage: '.profile', desc: 'Cek status karakter RPG, level, & inventory' },
        { name: 'daily', usage: '.daily', desc: 'Klaim hadiah harian gold & exp' }
      ]
    },
    {
      name: 'tools',
      title: '🛠️ Utilities & Convert',
      description: 'Alat bantu harian & pembuat stiker',
      commands: [
        { name: 'sticker', usage: '.s (balas foto)', desc: 'Ubah foto/video menjadi stiker WhatsApp' },
        { name: 'toimg', usage: '.toimg (balas stiker)', desc: 'Konversi stiker biasa kembali jadi foto JPG' },
        { name: 'tourl', usage: '.tourl (balas media)', desc: 'Upload media ke Catbox / Athars Server' },
        { name: 'ssweb', usage: '.ssweb <url>', desc: 'Screenshot halaman website secara otomatis' }
      ]
    },
    {
      name: 'search',
      title: '🔍 Search & Stalker',
      description: 'Pencarian informasi & profil sosial media',
      commands: [
        { name: 'google', usage: '.google <query>', desc: 'Cari informasi langsung dari Google Search' },
        { name: 'pinterest', usage: '.pinterest <query>', desc: 'Cari fotoHD & estetik dari Pinterest' },
        { name: 'igstalk', usage: '.igstalk <username>', desc: 'Cek profil, followers, & bio Instagram' },
        { name: 'ttstalk', usage: '.ttstalk <username>', desc: 'Stalking akun TikTok' }
      ]
    },
    {
      name: 'maker',
      title: '🎨 Photo Maker & Ephoto',
      description: 'Efek teks neon, logo, & manipulasi foto',
      commands: [
        { name: 'ephoto', usage: '.ephoto <efek> | <teks>', desc: 'Buat logo 3D neon estetik' },
        { name: 'photoxy', usage: '.photoxy <efek> | <teks>', desc: 'Efek teks berapi, cyber, & glowing' },
        { name: 'wasted', usage: '.wasted (balas foto)', desc: 'Efek GTA Wasted pada foto' }
      ]
    }
  ];

  return NextResponse.json({ categories, totalCategories: categories.length });
}
