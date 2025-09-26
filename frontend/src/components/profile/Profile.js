import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Alert,
  Divider 
} from '@mui/material';
import { 
  Person as PersonIcon,
  Save as SaveIcon,
  Lock as LockIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../utils/apiFetch';
import { ProfileContainer, ProfileCard, SectionTitle } from './styles/profilestyles';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Form States
  const [profileForm, setProfileForm] = useState({
    username: '',
    email: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  // User-Profil laden
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const userData = await apiFetch('/api/users/profile');
        setUser(userData);
        setProfileForm({
          username: userData.username || '',
          email: userData.email || ''
        });
        console.log('Profil geladen:', userData);
      } catch (err) {
        setError('Profil konnte nicht geladen werden');
        console.error('Fehler beim Laden des Profils:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Profil-Daten ändern
  const handleProfileChange = (e) => {
    setProfileForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Passwort-Daten ändern
  const handlePasswordChange = (e) => {
    setPasswordForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Profil speichern
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    if (!profileForm.username.trim() || !profileForm.email.trim()) {
      setError('Bitte alle Felder ausfüllen');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await apiFetch('/api/users/update-profile', {
        method: 'PUT',
        body: JSON.stringify(profileForm),
      });

      setUser(prev => ({
        ...prev,
        ...profileForm
      }));

      setMessage('Profil erfolgreich aktualisiert! 🎉');
      console.log('Profil gespeichert');
    } catch (err) {
      setError(err.message || 'Fehler beim Speichern des Profils');
      console.error('Fehler beim Speichern:', err);
    } finally {
      setLoading(false);
    }
  };

  // Passwort ändern
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setError('Bitte alle Passwort-Felder ausfüllen');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Neue Passwörter stimmen nicht überein');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError('Neues Passwort muss mindestens 6 Zeichen haben');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await apiFetch('/api/users/change-password', {
        method: 'PUT',
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword
        }),
      });

      setPasswordForm({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setMessage('Passwort erfolgreich geändert! 🔐');
      console.log('Passwort geändert');
    } catch (err) {
      setError(err.message || 'Fehler beim Ändern des Passworts');
      console.error('Passwort-Fehler:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <ProfileContainer>
        <Typography variant="h6" textAlign="center">
          Lade Profil...
        </Typography>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <Typography variant="h4" component="h1" gutterBottom sx={{
        fontWeight: 'bold',
        color: '#4B2E05',
        textAlign: 'center',
        mb: 4
      }}>
        Profil-Einstellungen
      </Typography>

      {/* Nachrichten */}
      {message && (
        <Alert severity="success" sx={{ mb: 3, maxWidth: 600, width: '100%' }}>
          {message}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3, maxWidth: 600, width: '100%' }}>
          {error}
        </Alert>
      )}

      {/* Profil bearbeiten */}
      <ProfileCard>
        <SectionTitle variant="h6" gutterBottom>
          <PersonIcon sx={{ mr: 1 }} />
          Profil-Daten
        </SectionTitle>

        <Box component="form" onSubmit={handleSaveProfile} noValidate>
          <TextField
            name="username"
            label="Benutzername"
            value={profileForm.username}
            onChange={handleProfileChange}
            fullWidth
            margin="normal"
            disabled={loading}
          />

          <TextField
            name="email"
            label="E-Mail Adresse"
            type="email"
            value={profileForm.email}
            onChange={handleProfileChange}
            fullWidth
            margin="normal"
            disabled={loading}
          />

          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{ mt: 2 }}
            disabled={loading}
            fullWidth
          >
            {loading ? 'Speichere...' : 'Profil speichern'}
          </Button>
        </Box>
      </ProfileCard>

      {/* Passwort ändern */}
      <ProfileCard>
        <SectionTitle variant="h6" gutterBottom>
          <LockIcon sx={{ mr: 1 }} />
          Passwort ändern
        </SectionTitle>

        <Box component="form" onSubmit={handleChangePassword} noValidate>
          <TextField
            name="oldPassword"
            label="Aktuelles Passwort"
            type="password"
            value={passwordForm.oldPassword}
            onChange={handlePasswordChange}
            fullWidth
            margin="normal"
            disabled={loading}
          />

          <TextField
            name="newPassword"
            label="Neues Passwort"
            type="password"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
            fullWidth
            margin="normal"
            disabled={loading}
          />

          <TextField
            name="confirmPassword"
            label="Neues Passwort bestätigen"
            type="password"
            value={passwordForm.confirmPassword}
            onChange={handlePasswordChange}
            fullWidth
            margin="normal"
            disabled={loading}
          />

          <Button
            type="submit"
            variant="contained"
            startIcon={<LockIcon />}
            sx={{ mt: 2 }}
            disabled={loading}
            fullWidth
          >
            {loading ? 'Ändere...' : 'Passwort ändern'}
          </Button>
        </Box>
      </ProfileCard>
    </ProfileContainer>
  );
}

export default Profile;