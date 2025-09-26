FROM node:18-alpine

# Arbeitsverzeichnis setzen
WORKDIR /app

# Package files kopieren
COPY package*.json ./

# Dependencies installieren
RUN npm ci

# Source code kopieren
COPY public/ ./public/
COPY src/ ./src/

# Port freigeben
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

# Development server starten
CMD ["npm", "start"]