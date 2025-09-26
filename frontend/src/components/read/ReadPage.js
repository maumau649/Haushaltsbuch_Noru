import React, { useState } from 'react';
import { Typography, Box } from '@mui/material';
import { ArrowBack as BackIcon } from '@mui/icons-material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import TileGrid from '../tilegrid/TileGrid';
import { ReadContainer, BackButton } from './styles/readpagestyles';

// Tabellen-Definitionen für verschiedene Kacheln
const DATABASE_TABLES = {
  'Pflanzen': [
    { name: 'Strains', color: '#4CAF50', description: 'Grunddaten der Cannabis-Sorten' },
    { name: 'Anbau Records', color: '#2196F3', description: 'Anbauerfahrungen und Ergebnisse' },
    { name: 'Terpene', color: '#FF9800', description: 'Aromastoffe und Eigenschaften' },
    { name: 'Dünger Sets', color: '#9C27B0', description: 'Verwendete Düngemittel' },
    { name: 'Shops', color: '#F44336', description: 'Bezugsquellen und Händler' },
    { name: 'Klimazonen', color: '#00BCD4', description: 'Herkunftsklimate' },
  ],
  'Autos': [
    { name: 'Fahrzeuge', color: '#3F51B5', description: 'Fahrzeugdaten' },
    { name: 'Wartung', color: '#4CAF50', description: 'Wartungseinträge' },
    { name: 'Reparaturen', color: '#FF9800', description: 'Reparaturhistorie' },
  ],
  'Einkauf': [
    { name: 'Produkte', color: '#E91E63', description: 'Gekaufte Artikel' },
    { name: 'Kategorien', color: '#9C27B0', description: 'Produktkategorien' },
  ],
  // Weitere Kacheln können hier ergänzt werden
};

function ReadPage() {
  const { tileName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Farbe aus URL-Parametern extrahieren
  const urlParams = new URLSearchParams(location.search);
  const tileColor = urlParams.get('color') || '#A497E9';
  
  const decodedTileName = decodeURIComponent(tileName);
  
  // Tabellen für diese Kachel laden
  const tables = DATABASE_TABLES[decodedTileName] || [
    { name: 'Keine Tabellen', color: '#9E9E9E', description: 'Für diese Kachel sind noch keine Tabellen definiert' }
  ];

  console.log('ReadPage - Kachel:', decodedTileName, 'Tabellen:', tables.length);

  // Zurück zur Action-Seite
  const handleBack = () => {
    const encodedTileName = encodeURIComponent(tileName);
    const encodedColor = encodeURIComponent(tileColor);
    navigate(`/action/${encodedTileName}?color=${encodedColor}`);
  };

  // Tabelle anklicken -> zur Tabellen-Detail-Seite
  const handleTableClick = (tableName) => {
    const encodedTileName = encodeURIComponent(tileName);
    const encodedTableName = encodeURIComponent(tableName);
    const encodedColor = encodeURIComponent(tileColor);
    
    console.log('Tabelle angeklickt:', tableName);
    navigate(`/table/${encodedTileName}/${encodedTableName}?color=${encodedColor}`);
  };

  // Container mit der Kachel-Hintergrundfarbe
  const ReadContainer = ({ children }) => (
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
    <ReadContainer>
      {/* Header mit Back Button */}
      <Box display="flex" alignItems="center" width="100%" maxWidth={800} mb={3}>
        <BackButton 
          onClick={handleBack}
          sx={{
            backgroundColor: `${tileColor}20`,
            color: tileColor,
            border: `1px solid ${tileColor}60`,
            '&:hover': {
              backgroundColor: `${tileColor}30`,
              transform: 'translateX(-2px)',
              boxShadow: `0 2px 8px ${tileColor}40`,
            },
          }}
        >
          <BackIcon />
        </BackButton>
        <Box ml={2}>
          <Typography variant="h4" component="h1" sx={{
            fontWeight: 'bold',
            color: '#4B2E05',
            textShadow: '0 1px 3px rgba(255,255,255,0.5)',
          }}>
            {decodedTileName} - Daten lesen
          </Typography>
        </Box>
      </Box>

      {/* Tabellen Grid */}
      <Box sx={{ width: '100%', maxWidth: 800 }}>
        <TileGrid 
          tiles={tables} 
          onTileClick={handleTableClick}
        />
      </Box>
    </ReadContainer>
  );
}

export default ReadPage;