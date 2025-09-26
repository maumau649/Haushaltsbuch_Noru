// MongoDB Initialisierungsskript
// Wechselt zur Datenbank webappdb und erstellt Testdaten

// Zur webappdb Datenbank wechseln (wird erstellt falls nicht existent)
db = db.getSiblingDB('webappdb');

// Index für bessere Performance erstellen
try {
  db.users.createIndex({ "email": 1 }, { unique: true });
  db.users.createIndex({ "username": 1 });
  print('MongoDB Indizes erfolgreich erstellt');
} catch (e) {
  print('Indizes bereits vorhanden oder Fehler:', e.message);
}

// Test-Benutzer erstellen (nur wenn nicht bereits vorhanden)



print('\nMongoDB Initialisierung abgeschlossen!');