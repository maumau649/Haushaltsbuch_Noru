import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * PrivateRoute Komponente
 * Schützt Routen vor unauthentifizierten Zugriffen
 * Leitet zur Login-Seite weiter wenn kein Token vorhanden
 */
function PrivateRoute({ children }) {
  // Token aus localStorage prüfen
  const token = localStorage.getItem('authToken');
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🔐 PrivateRoute Check:', {
      hasToken: !!token,
      timestamp: new Date().toISOString()
    });
  }
  
  // Wenn kein Token, zur Login-Seite weiterleiten
  if (!token) {
    console.log('🚫 Kein Token - Weiterleitung zum Login');
    return <Navigate to="/login" replace />;
  }

  // Wenn Token vorhanden, Kinder-Komponenten rendern
  return children;
}

export default PrivateRoute;