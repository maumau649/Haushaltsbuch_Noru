// API Base URL - automatisch je nach Umgebung
export const BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000'
  : 'http://backend:5000';

/**
 * Wrapper für fetch() mit automatischer Token-Behandlung
 */
export const apiFetch = async (url, options = {}) => {
  try {
    // Token aus localStorage holen
    const token = localStorage.getItem('authToken');
    
    // Standard Headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Token hinzufügen wenn vorhanden
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Debug logging für Development
    if (process.env.NODE_ENV === 'development') {
      console.log('🌐 API Request:', {
        url: `${BASE_URL}${url}`,
        method: options.method || 'GET',
        hasToken: !!token,
      });
    }

    // Fetch Request ausführen
    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers,
    });

    // Response Debug
    if (process.env.NODE_ENV === 'development') {
      console.log('📡 API Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });
    }

    // Content Type prüfen
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    // Response Data extrahieren
    let data;
    if (isJson) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Erfolgreiche Response
    if (response.ok) {
      return data;
    }

    // Error Handling für verschiedene Status Codes
    if (response.status === 401) {
      // Token ungültig oder abgelaufen - aber NICHT automatisch weiterleiten
      console.warn('🚨 Unauthorized - Token entfernt');
      localStorage.removeItem('authToken');
      
      throw new Error(data?.error?.message || data?.message || 'Authentifizierung erforderlich');
    }

    if (response.status === 403) {
      throw new Error(data?.error?.message || data?.message || 'Zugriff verweigert');
    }

    if (response.status === 404) {
      throw new Error(data?.error?.message || data?.message || 'Ressource nicht gefunden');
    }

    if (response.status === 422 || response.status === 400) {
      throw new Error(data?.error?.message || data?.message || 'Validierungsfehler');
    }

    if (response.status >= 500) {
      throw new Error(data?.error?.message || data?.message || 'Serverfehler - bitte versuchen Sie es später erneut');
    }

    // Generischer HTTP Error
    throw new Error(data?.error?.message || data?.message || `HTTP Error: ${response.status} ${response.statusText}`);

  } catch (error) {
    // Network oder andere Fehler
    if (error.name === 'TypeError' || error.message.includes('fetch')) {
      console.error('🔌 Netzwerkfehler:', error);
      throw new Error('Verbindung zum Server fehlgeschlagen. Bitte prüfen Sie Ihre Internetverbindung.');
    }

    // Debug logging für Development
    if (process.env.NODE_ENV === 'development') {
      console.error('🚨 API Fehler:', error);
    }

    // Weiterwerfen des ursprünglichen Fehlers
    throw error;
  }
};

export default apiFetch;