import './globals.css';

export const metadata = {
  title: 'Cailin Assistant - WhatsApp Bot Web Engine',
  description: 'Interactive AI WhatsApp & Web Assistant Bot featuring Neobrutalism UI, pairing code generator, live status dashboard, and command directory.',
  keywords: 'Cailin Assistant, Cailin bot, WhatsApp bot, Next.js bot website, AI Assistant',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="cyber-grid" />
        <main className="relative z-10 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
