const mongoose = require('mongoose');

// MongoDB Connection mit besserer Error Handling
mongoose.set('strictQuery', false);

// Connection Events
mongoose.connection.on('connected', () => {
  console.log('MongoDB: Verbindung hergestellt');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB: Verbindungsfehler:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB: Verbindung getrennt');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB: Verbindung durch App-Beendigung geschlossen');
  process.exit(0);
});

module.exports = mongoose;