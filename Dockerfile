# Base image Node.js 20 LTS Alpine
FROM node:20-alpine AS base

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Set working directory
WORKDIR /app

# Install system dependencies (ffmpeg & graphics libraries for baileys & media tools)
RUN apk add --no-cache \
    ffmpeg \
    imagemagick \
    graphicsmagick \
    python3 \
    make \
    g++ \
    curl \
    && curl -L --output /usr/local/bin/cloudflared https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 \
    && chmod +x /usr/local/bin/cloudflared

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build Next.js Web App
RUN npm run build || true

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "start"]
