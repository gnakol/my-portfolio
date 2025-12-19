# ============================================
# STAGE 1: Build
# ============================================
FROM node:20-bullseye AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev) needed for build
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# ============================================
# STAGE 2: Production
# ============================================
FROM node:20-bullseye

WORKDIR /app

# Install dumb-init + system dependencies required by Chrome/Puppeteer + Tor for IP rotation
RUN apt-get update && apt-get install -y --no-install-recommends \
    dumb-init \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    wget \
    tor \
  && rm -rf /var/lib/apt/lists/*

# Create non-root user (same IDs as avant)
RUN groupadd -g 1001 nodejs && \
    useradd -m -u 1001 -g nodejs nestjs

# Configure Tor to run as nestjs user
RUN mkdir -p /home/nestjs/tor-data && \
    chown -R nestjs:nodejs /home/nestjs/tor-data && \
    echo "SocksPort 9050" > /home/nestjs/torrc && \
    echo "ControlPort 9051" >> /home/nestjs/torrc && \
    echo "CookieAuthentication 0" >> /home/nestjs/torrc && \
    echo "DataDirectory /home/nestjs/tor-data" >> /home/nestjs/torrc && \
    chown nestjs:nodejs /home/nestjs/torrc

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Create startup script that launches Tor then the app (AVANT de passer en user nestjs)
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "🧅 Starting Tor proxy..."' >> /app/start.sh && \
    echo 'tor -f /home/nestjs/torrc &' >> /app/start.sh && \
    echo 'echo "⏳ Waiting for Tor to establish circuit..."' >> /app/start.sh && \
    echo 'sleep 10' >> /app/start.sh && \
    echo 'echo "✅ Tor is ready, launching application..."' >> /app/start.sh && \
    echo 'exec node dist/main.js' >> /app/start.sh && \
    chmod +x /app/start.sh && \
    chown nestjs:nodejs /app/start.sh

# ----- Puppeteer / Chrome setup -----
# On passe en user nestjs pour que le cache et Chrome soient sous /home/nestjs
USER nestjs

# Dossier cache Puppeteer (là où Chrome sera installé)
ENV PUPPETEER_CACHE_DIR=/home/nestjs/.cache/puppeteer

# Télécharge Chrome géré par Puppeteer
RUN npx puppeteer browsers install chrome

# Copy built application from builder (en gardant les bons droits)
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start Tor and the application
CMD ["/app/start.sh"]
