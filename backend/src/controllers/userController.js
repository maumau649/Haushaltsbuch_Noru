const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Hilfsfunktion zum Erzeugen eines JWT-Tokens
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id || user.id,
      email: user.email 
    }, 
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // 7 Tage gültig
  );
};

// Hilfsfunktion für Validierungsfehler
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validierungsfehler',
      errors: errors.array()
    });
  }
  return null;
};

// Registrierung eines neuen Benutzers
const registerUser = async (req, res) => {
  try {
    // Validierung prüfen
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const { username, email, password } = req.body;

    // Prüfen ob Benutzer bereits existiert
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ 
        message: 'Benutzer mit dieser E-Mail-Adresse existiert bereits' 
      });
    }

    // Passwort hashen
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Benutzer erstellen
    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // Token generieren
    const token = generateToken(user);

    res.status(201).json({
      message: 'Benutzer erfolgreich registriert',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });

  } catch (error) {
    console.error('Fehler bei Registrierung:', error);
    
    // MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        message: `${field === 'email' ? 'E-Mail-Adresse' : 'Benutzername'} bereits vergeben` 
      });
    }

    res.status(500).json({ 
      message: 'Interner Serverfehler bei der Registrierung' 
    });
  }
};

// Login eines Benutzers
const loginUser = async (req, res) => {
  try {
    // Validierung prüfen
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const { email, password } = req.body;

    // Benutzer suchen (mit Passwort)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        message: 'Ungültige Anmeldedaten' 
      });
    }

    // Passwort überprüfen
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Ungültige Anmeldedaten' 
      });
    }

    // Token generieren
    const token = generateToken(user);

    res.json({
      message: 'Anmeldung erfolgreich',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });

  } catch (error) {
    console.error('Fehler beim Login:', error);
    res.status(500).json({ 
      message: 'Interner Serverfehler beim Login' 
    });
  }
};

// Profil des eingeloggten Benutzers anzeigen
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ 
        message: 'Benutzer nicht gefunden' 
      });
    }

    res.json(user);
  } catch (error) {
    console.error('Fehler bei Profilabruf:', error);
    res.status(500).json({ 
      message: 'Interner Serverfehler beim Profilabruf' 
    });
  }
};

// Profil des eingeloggten Benutzers aktualisieren
const updateUserProfile = async (req, res) => {
  try {
    // Validierung prüfen
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const { username, email } = req.body;
    
    // Mindestens ein Feld muss angegeben werden
    if (!username && !email) {
      return res.status(400).json({ 
        message: 'Mindestens ein Feld (username oder email) muss angegeben werden' 
      });
    }

    // Benutzer suchen
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        message: 'Benutzer nicht gefunden' 
      });
    }

    // Prüfen ob E-Mail bereits verwendet wird (falls geändert)
    if (email && email.toLowerCase() !== user.email) {
      const emailExists = await User.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: user._id }
      });
      if (emailExists) {
        return res.status(400).json({ 
          message: 'E-Mail-Adresse bereits vergeben' 
        });
      }
    }

    // Daten aktualisieren
    if (username) user.username = username.trim();
    if (email) user.email = email.toLowerCase();

    const updatedUser = await user.save();

    res.json({
      message: 'Profil erfolgreich aktualisiert',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
      },
    });

  } catch (error) {
    console.error('Fehler bei Profilaktualisierung:', error);
    
    // MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        message: `${field === 'email' ? 'E-Mail-Adresse' : 'Benutzername'} bereits vergeben` 
      });
    }

    res.status(500).json({ 
      message: 'Interner Serverfehler bei der Profilaktualisierung' 
    });
  }
};

// Passwort des eingeloggten Benutzers ändern
const changePassword = async (req, res) => {
  try {
    // Validierung prüfen
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const { oldPassword, newPassword } = req.body;

    // Benutzer suchen (mit Passwort)
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ 
        message: 'Benutzer nicht gefunden' 
      });
    }

    // Altes Passwort überprüfen
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Aktuelles Passwort ist falsch' 
      });
    }

    // Prüfen ob neues Passwort sich vom alten unterscheidet
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ 
        message: 'Das neue Passwort muss sich vom aktuellen Passwort unterscheiden' 
      });
    }

    // Neues Passwort hashen und speichern
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ 
      message: 'Passwort erfolgreich geändert' 
    });

  } catch (error) {
    console.error('Fehler beim Passwort ändern:', error);
    res.status(500).json({ 
      message: 'Interner Serverfehler beim Ändern des Passworts' 
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
};