import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Alert, Paper } from '@mui/material';
import { apiFetch } from '../../utils/apiFetch';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Bitte alle Felder ausfüllen');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔐 Login-Versuch für:', email);
      
      const data = await apiFetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      console.log('✅ Login erfolgreich:', data);

      // Token speichern
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        console.log('💾 Token gespeichert');
        
        // Zur Main-Seite weiterleiten (nicht mehr Profile)
        navigate('/main');
      } else {
        throw new Error('Kein Token in der Antwort erhalten');
      }

    } catch (error) {
      console.error('❌ Login-Fehler:', error);
      setError(error.message || 'Fehler beim Login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background: 'linear-gradient(135deg, #A497E9 0%, #7DABF7 25%, #92D8D8 50%, #F2C6D9 75%, #FFB347 100%)',
      }}
      padding={2}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 5,
          maxWidth: 450,
          width: '100%',
          borderRadius: 3,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
        }}
      >
        <Box textAlign="center" mb={3}>
          <Typography variant="h3" component="h1" gutterBottom sx={{
            fontWeight: 'bold',
            color: '#4B2E05',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            WebApp
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Willkommen zurück
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Melde dich an, um fortzufahren
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="E-Mail Adresse"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            margin="normal"
            autoFocus
            disabled={loading}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          
          <TextField
            label="Passwort"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
            disabled={loading}
            variant="outlined"
            sx={{ mb: 3 }}
          />

          {error && (
            <Alert severity="error" sx={{ marginY: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              mt: 2,
              mb: 3,
              height: 48,
              background: 'linear-gradient(45deg, #A497E9, #7DABF7)',
              '&:hover': {
                background: 'linear-gradient(45deg, #8b7fc9, #6a9bf0)',
              }
            }}
          >
            {loading ? 'Wird angemeldet...' : 'Anmelden'}
          </Button>
        </Box>

        {/* Debug-Info für Development */}
        {process.env.NODE_ENV === 'development' && (
          <Box mt={3} p={2} bgcolor="#f8f9fa" borderRadius={1}>
            <Typography variant="caption" color="textSecondary">
              <strong>Test-Accounts:</strong><br/>
              📧 admin@example.com | 🔑 password<br/>
              📧 user@example.com | 🔑 password
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default Login;