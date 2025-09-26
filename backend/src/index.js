require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./server');

const PORT = process.env.BACKEND_PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM Signal empfangen - Server wird heruntergefahren');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT Signal empfangen - Server wird heruntergefahren');
  await mongoose.connection.close();
  process.exit(0);
});

async function startServer() {
  try {
    // MongoDB Verbindung mit Error Handling
    console.log('Verbinde mit MongoDB...');
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 sekunden timeout
      maxPoolSize: 10,
    });
    
    console.log('MongoDB erfolgreich verbunden');

    // Server starten
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Backend Server läuft auf Port ${PORT}`);
    });

    // Graceful shutdown für den Server
    process.on('SIGTERM', () => {
      console.log('SIGTERM erhalten. Server wird geschlossen...');
      server.close(() => {
        console.log('HTTP Server geschlossen');
      });
    });

  } catch (error) {
    console.error('Fehler beim Starten des Servers:', error);
    process.exit(1);
  }
}

// Server starten
startServer();