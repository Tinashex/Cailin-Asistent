# Cailin Assistant - Docker Compose
# For VPS / Local Docker only — Vercel does NOT use this file

services:
  cailin-bot:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: cailin-assistant
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - CLOUDFLARED_TOKEN=${CLOUDFLARED_TOKEN:-}
      - BOT_NUMBER=${BOT_NUMBER:-263781330745}
      - PAIRING_CODE=${PAIRING_CODE:-}
    volumes:
      # Persist WhatsApp sessions
      - ./session:/app/session
      - ./session_clones:/app/session_clones
      # Persist database and config
      - ./data:/app/data
      # Temp pairing codes (Vercel fix uses /tmp)
      - ./tmp:/app/tmp
      # Optional: persist media
      - ./media:/app/media
    # Optional health check
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/api/status"]
      interval: 30s
      timeout: 10s
      retries: 3
