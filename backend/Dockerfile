FROM node:18-alpine

# Arbeitsverzeichnis setzen
WORKDIR /app

# Package files kopieren
COPY package*.json ./

# Dependencies installieren
RUN npm ci --only=production

# Source code kopieren
COPY src/ ./src/

# Port freigeben
EXPOSE 5000

# Health check
# HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
# CMD curl -f http://localhost:5000/ || exit 1

# App starten
CMD ["npm", "start"]