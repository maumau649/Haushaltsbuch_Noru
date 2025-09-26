const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  // Debug logging für Development
  if (process.env.NODE_ENV === 'development') {
    console.log('🔐 Authentifizierung: Middleware aufgerufen');
    console.log('Authorization Header:', req.headers.authorization);
  }

  // Token aus Authorization Header extrahieren
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ 
          message: 'Kein Token gefunden, Zugriff verweigert' 
        });
      }

      // Token verifizieren
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Token erfolgreich verifiziert für User:', decoded.id);
      }

      // User-Daten dem Request hinzufügen
      req.user = {
        id: decoded.id,
        email: decoded.email
      };

      next();
    } catch (error) {
      console.error('❌ Token-Verifikationsfehler:', error.message);
      
      // Spezifische Fehlermeldungen je nach Fehlertyp
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          message: 'Token ist abgelaufen',
          code: 'TOKEN_EXPIRED'
        });
      }
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          message: 'Ungültiger Token',
          code: 'INVALID_TOKEN'
        });
      }

      return res.status(401).json({ 
        message: 'Token-Verifikation fehlgeschlagen',
        code: 'TOKEN_VERIFICATION_FAILED'
      });
    }
  } else {
    return res.status(401).json({ 
      message: 'Kein Authorization Header gefunden, Zugriff verweigert',
      code: 'NO_TOKEN'
    });
  }
};

// Middleware für optionale Authentifizierung
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Wenn Token vorhanden, versuche zu authentifizieren
    protect(req, res, next);
  } else {
    // Wenn kein Token, weiterleiten ohne User-Daten
    req.user = null;
    next();
  }
};

module.exports = { 
  protect,
  optionalAuth
};