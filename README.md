# WebApp Projekt - Haushaltsbuch



## Übersicht
Diese WebApp ist eine Full-Stack-Anwendung mit:
- **Backend**: Node.js + Express + MongoDB/PostgreSQL
- **Frontend**: React 19 + Material UI
- **Container**: Docker + Docker Compose



## Projektstruktur
```
seer/
├── docker-compose.yml          # Container-Orchestrierung
├── .env                       # Umgebungsvariablen
├── README.md                  # Diese Anleitung
├── backend/                   # Node.js Backend
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── index.js          # Einstiegspunkt
│       ├── server.js         # Express Server
│       ├── controllers/      # Business Logic
│       ├── middleware/       # Auth & Error Handling
│       ├── models/          # Datenmodelle
│       ├── routes/          # API Routen
│       ├── clients/         # DB Verbindungen
│       └── docs/           # Swagger Dokumentation
├── frontend/                 # React Frontend
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── index.js
│       ├── App.js
│       ├── components/      # React Komponenten
│       └── utils/          # Helper Funktionen
└── database/               # DB Initialisierung
    ├── postgres-init.sql
    └── mongo-init.js
```



## Installation & Start

### Vorraussetzungen
- Docker & Docker Compose
- Git
- min. 4GB RAM

### 2. Umgebungsdatei erstellen
Erstelle eine `.env` Datei im Hauptverzeichnis:
```env
# Database Configuration
PG_HOST=postgres
PG_PORT=5432
PG_USER=username
PG_PASSWORD=*****
PG_DATABASE=webappdb

MONGO_URI=mongodb://Username:password@mongo:27017/webappdb?authSource=admin

# JWT Secret
JWT_SECRET=*****

# Node Environment
NODE_ENV=development

# Ports
BACKEND_PORT=5000
FRONTEND_PORT=3000
```

### 3. Anwendung starten
```bash
# Alle Container bauen und starten
docker-compose up --build

# Im Hintergrund starten
docker-compose up --build -d
```

### 4. Zugriff auf die Anwendung
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Dokumentation**: http://localhost:5000/api-docs
- **PostgreSQL**: localhost:5432
- **MongoDB**: localhost:27017



## Fehlerbehebung
### Port bereits belegt
```bash
# Prüfe welcher Prozess den Port belegt
lsof -i :3000  # Frontend
lsof -i :5000  # Backend
lsof -i :5432  # PostgreSQL
lsof -i :27017 # MongoDB

# Ändere Ports in docker-compose.yml falls nötig
```



## Entwicklung
### Backend entwickeln
```bash
docker compose up --build
```

### API testen
```bash
# Health Check
curl http://localhost:5000/health

# User registrieren
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```



## Deployment
### Produktion vorbereiten
1. Ändere alle Passwörter in `.env`
2. Setze `NODE_ENV=production`
3. Generiere neuen JWT_SECRET
4. Konfiguriere Reverse Proxy (nginx)

### Container stoppen
```bash
# Alle Container stoppen
docker-compose down

# Container + Volumes löschen (VORSICHT: Daten werden gelöscht!)
docker-compose down -v
```