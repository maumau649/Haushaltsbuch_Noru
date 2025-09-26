import React, { useState, useEffect } from 'react';
import { 
  AppBar as MuiAppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton
} from '@mui/material';
import { 
  Person as PersonIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon 
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiFetch } from '../../utils/apiFetch';
import { AppBarContainer, Logo, UserSection, UserButton } from './styles/appbarstyles';



function AppBar() {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();


  // User-Profil laden
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await apiFetch('/api/users/profile');
        setUser(userData);
        console.log('User-Profil geladen:', userData);
      } catch (error) {
        console.error('Fehler beim Laden des User-Profils:', error);
      }
    };

    fetchUserProfile();
  }, []);


  // User-Menu öffnen/schließen
  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };


  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };


  // Navigation zur Profil-Seite
  const handleProfileClick = () => {
    handleUserMenuClose();
    navigate('/profile');
  };


  // Logout
  const handleLogout = () => {
    console.log('🚪 Logout ausgeführt');
    localStorage.removeItem('authToken');
    navigate('/login');
  };


  // Zur Hauptseite navigieren
  const handleHomeClick = () => {
    navigate('/main');
  };


  // Aktueller Seitentitel
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/main') return 'Meine Kacheln';
    if (path === '/profile') return 'Profil-Einstellungen';
    if (path.startsWith('/action/')) {
      const tileName = path.split('/')[2];
      return `${decodeURIComponent(tileName)} - Aktionen`;
    }
    return 'WebApp';
  };



  return (
    <AppBarContainer position="fixed">
      <Toolbar sx={{ justifyContent: 'space-between', padding: '0 24px' }}>
        {/* Logo/Brand - klickbar, leitet zur Main-Page */}
        <Logo onClick={handleHomeClick}>
          <Typography variant="h5" component="div" sx={{ 
            fontFamily: 'Macondo Swash Caps',
            fontWeight: 'bold',
            fontSize: '30px',
            cursor: 'pointer',
            color: '#4B2E05'
          }}>
            SeeR
          </Typography>
        </Logo>



        {/* User Section */}
        <UserSection>
          {user ? (
            <>
              <UserButton
                onClick={handleUserMenuOpen}
                startIcon={
                  <Avatar sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: '#4B2E05',
                    fontSize: '0.9rem',
                    fontFamily: 'Macondo Swash Caps'
                  }}>
                    {user.username?.[0]?.toUpperCase() || 'U'}
                  </Avatar>
                }
              >
                <Box sx={{ 
                  display: { xs: 'none', sm: 'block' },
                  textAlign: 'left'
                }}>
                  <Typography variant="body2" sx={{ 
                    lineHeight: 1.2,
                    fontWeight: '600',
                    fontFamily: 'Macondo Swash Caps'
                  }}>
                    {user.username}
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    lineHeight: 1,
                    opacity: 0.8
                  }}>
                    {user.email}
                  </Typography>
                </Box>
              </UserButton>

              {/* User Menu */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleUserMenuClose}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1.5,
                    minWidth: 180,
                    '& .MuiMenuItem-root': {
                      px: 2,
                      py: 1.5,
                    },
                  },
                }}
              >
                <MenuItem onClick={handleProfileClick}>
                  <SettingsIcon sx={{ mr: 2, fontSize: 20 }} />
                  Profil bearbeiten
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
                  Abmelden
                </MenuItem>
              </Menu>
            </>
          ) : (
            // Loading state
            <Button
              variant="outlined"
              size="small"
              disabled
              sx={{ borderColor: '#4B2E05', color: '#4B2E05' }}
            >
              Lade...
            </Button>
          )}
        </UserSection>
      </Toolbar>
    </AppBarContainer>
  );
}

export default AppBar;