import React from 'react';
import { Typography, Box, Button, Card, CardContent } from '@mui/material';
import { 
  ArrowBack as BackIcon,
  Delete as DeleteIcon,
  Visibility as ReadIcon,
  Edit as WriteIcon 
} from '@mui/icons-material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ActionCard, BackButton, ActionButton } from './styles/actionboxstyles';

function ActionPage() {
  const { tileName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Farbe aus URL-Parametern extrahieren
  const urlParams = new URLSearchParams(location.search);
  const tileColor = urlParams.get('color') || '#A497E9';

  console.log('🎨 ActionPage - Kachel:', tileName, 'Farbe:', tileColor);

  // Zurück zur Hauptseite
  const handleBack = () => {
    navigate('/main');
  };

  // CRUD Operationen
  const handleDbRead = () => {
    const encodedTileName = encodeURIComponent(tileName);
    const encodedColor = encodeURIComponent(tileColor);
    
    console.log(`Navigiere zu Read-Seite für: ${tileName}`);
    navigate(`/read/${encodedTileName}?color=${encodedColor}`);
  };

  const handleDbWrite = () => {
    alert(`Daten schreiben für "${tileName}"`);
    console.log(`DB Write Operation für: ${tileName}`);
  };

  const handleDbDelete = () => {
    if (window.confirm(`🗑️ Möchtest du wirklich Daten für "${tileName}" löschen?`)) {
      alert(`Daten gelöscht für "${tileName}"`);
      console.log(`DB Delete Operation für: ${tileName}`);
    }
  };

  // Kachel löschen
  const handleDeleteTile = () => {
    if (window.confirm(`Kachel "${tileName}" wirklich löschen?\n\nDies kann nicht rückgängig gemacht werden!`)) {
      alert(`Kachel "${tileName}" wurde gelöscht`);
      console.log(`Kachel gelöscht: ${tileName}`);
      navigate('/main');
    }
  };

  // Container mit der Kachel-Hintergrundfarbe
  const ActionContainer = ({ children }) => (
    <Box sx={{
      minHeight: 'calc(100vh - 64px)',
      padding: 3,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: `linear-gradient(135deg, ${tileColor}15 0%, ${tileColor}25 50%, ${tileColor}15 100%)`,
    }}>
      {children}
    </Box>
  );

  return (
    <ActionContainer>
      {/* Header mit Back Button */}
      <Box display="flex" alignItems="center" width="100%" maxWidth={600} mb={3}>
        <BackButton onClick={handleBack}>
          <BackIcon />
        </BackButton>
        <Box ml={2}>
          <Typography variant="h4" component="h1" sx={{
            fontWeight: 'bold',
            color: '#4B2E05',
            textShadow: '0 1px 3px rgba(255,255,255,0.5)',
          }}>
            {decodeURIComponent(tileName)}
          </Typography>
          <Typography variant="body2" sx={{
            color: '#4B2E05',
            opacity: 0.8,
          }}>
            Verfügbare Aktionen für diese Kachel
          </Typography>
        </Box>
      </Box>

      {/* Action Cards */}
      <Box display="flex" flexDirection="column" gap={3} width="100%" maxWidth={600}>
        
        {/* Datenbank Operationen */}
        <ActionCard sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: `2px solid ${tileColor}40`,
        }}>
          <CardContent sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ 
              color: '#4B2E05', 
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              Datenbank-Operationen
            </Typography>
            
            <Typography variant="body2" color="textSecondary" paragraph>
              Verwalte die Daten für diese Kachel
            </Typography>

            <Box display="flex" gap={2} flexWrap="wrap">
              <ActionButton
                variant="contained"
                startIcon={<ReadIcon />}
                onClick={handleDbRead}
                sx={{
                  backgroundColor: '#4CAF50',
                  '&:hover': { backgroundColor: '#45a049' }
                }}
              >
                Daten lesen
              </ActionButton>

              <ActionButton
                variant="contained"
                startIcon={<WriteIcon />}
                onClick={handleDbWrite}
                sx={{
                  backgroundColor: '#2196F3',
                  '&:hover': { backgroundColor: '#1976D2' }
                }}
              >
                Daten schreiben
              </ActionButton>

              <ActionButton
                variant="contained"
                startIcon={<DeleteIcon />}
                onClick={handleDbDelete}
                sx={{
                  backgroundColor: '#FF9800',
                  '&:hover': { backgroundColor: '#F57C00' }
                }}
              >
                Daten löschen
              </ActionButton>
            </Box>
          </CardContent>
        </ActionCard>

        {/* Kachel Verwaltung */}
        <ActionCard sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: `2px solid ${tileColor}40`,
        }}>
          <CardContent sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ 
              color: '#4B2E05', 
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              Kachel-Verwaltung
            </Typography>
            
            <Typography variant="body2" color="textSecondary" paragraph>
              Verwalte diese Kachel
            </Typography>

            <Box display="flex" gap={2}>
              <ActionButton
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteTile}
                sx={{
                  borderColor: '#f44336',
                  color: '#f44336',
                  '&:hover': { 
                    borderColor: '#d32f2f',
                    backgroundColor: 'rgba(244, 67, 54, 0.04)'
                  }
                }}
              >
                Kachel löschen
              </ActionButton>
            </Box>
          </CardContent>
        </ActionCard>

        {/* Kachel-Info */}
        <ActionCard sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: `2px solid ${tileColor}40`,
        }}>
          <CardContent sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ 
              color: '#4B2E05', 
              fontWeight: 'bold' 
            }}>
              Kachel-Information
            </Typography>
            
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Box sx={{
                width: 30,
                height: 30,
                backgroundColor: tileColor,
                borderRadius: 1,
                border: '2px solid #4B2E05'
              }} />
              <Typography variant="body2" color="textSecondary">
                Farbe: {tileColor}
              </Typography>
            </Box>
            
            <Typography variant="body2" color="textSecondary">
              Hier können weitere spezifische Aktionen für "{decodeURIComponent(tileName)}" hinzugefügt werden.
            </Typography>
          </CardContent>
        </ActionCard>
      </Box>
    </ActionContainer>
  );
}

export default ActionPage;