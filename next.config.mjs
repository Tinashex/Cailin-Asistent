import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  turbopack: { root: path.resolve(__dirname, '..') },
  serverExternalPackages: ["pino", "pino-pretty", "@whiskeysockets/baileys", "jimp", "fluent-ffmpeg"],
  experimental: {
    serverComponentsExternalPackages: ["pino", "pino-pretty", "@whiskeysockets/baileys"],
  },
};
export default nextConfig;
