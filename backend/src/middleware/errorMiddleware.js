/**
 * Globaler Error Handler für Express
 * Behandelt alle nicht abgefangenen Fehler in der Anwendung
 */

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error für Debugging
  console.error('🚨 Fehler aufgetreten:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : 'Stack trace hidden',
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Mongoose/MongoDB Fehler behandeln
  if (err.name === 'CastError') {
    const message = 'Ressource nicht gefunden';
    error.message = message;
    error.statusCode = 404;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const message = `${field} bereits vorhanden`;
    error.message = message;
    error.statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    error.message = messages.join(', ');
    error.statusCode = 400;
  }

  // JWT Fehler
  if (err.name === 'JsonWebTokenError') {
    const message = 'Ungültiger Token';
    error.message = message;
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token ist abgelaufen';
    error.message = message;
    error.statusCode = 401;
  }

  // PostgreSQL Fehler
  if (err.code === '23505') {
    const message = 'Daten bereits vorhanden';
    error.message = message;
    error.statusCode = 400;
  }

  if (err.code === '23503') {
    const message = 'Referenzfehler - abhängige Daten vorhanden';
    error.message = message;
    error.statusCode = 400;
  }

  // Express Validator Fehler
  if (err.type === 'entity.parse.failed') {
    const message = 'Ungültiges JSON Format';
    error.message = message;
    error.statusCode = 400;
  }

  // Standard Werte setzen
  const statusCode = error.statusCode || err.statusCode || 500;
  const message = error.message || 'Interner Serverfehler';

  // Response senden
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
        details: err
      })
    },
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  });
};

module.exports = errorHandler;