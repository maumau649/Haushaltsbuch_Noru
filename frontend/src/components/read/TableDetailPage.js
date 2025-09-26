import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { ArrowBack as BackIcon, Storage as TableIcon } from '@mui/icons-material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { apiFetch } from '../../utils/apiFetch';
import { BackButton } from './styles/readpagestyles';

// Mock-Daten für verschiedene Tabellen (später durch echte API-Calls ersetzen)
const MOCK_TABLE_DATA = {
  'Strains': [
    {
      strain_id: 1,
      name: 'Blue Dream',
      automatic: false,
      type: 'Hybrid',
      percent_sativa: 60,
      percent_indica: 40,
      growth_duration_min: 56,
      growth_duration_max: 70,
      height_min_cm: 90,
      height_max_cm: 200,
      origin: 'Blueberry × Haze'
    },
    {
      strain_id: 2,
      name: 'White Widow',
      automatic: false,
      type: 'Hybrid',
      percent_sativa: 50,
      percent_indica: 50,
      growth_duration_min: 49,
      growth_duration_max: 63,
      height_min_cm: 60,
      height_max_cm: 150,
      origin: 'Brazilian × South Indian'
    }
  ],
  'Anbau Records': [
    {
      record_id: 1,
      strain_name: 'Blue Dream',
      actual_height_cm: 180,
      actual_growth_days: 65,
      actual_flower_days: 56,
      actual_temp_c: 24.5,
      rating: 4,
      harvest_date: '2024-08-15'
    },
    {
      record_id: 2,
      strain_name: 'White Widow',
      actual_height_cm: 120,
      actual_growth_days: 58,
      actual_flower_days: 49,
      actual_temp_c: 23.2,
      rating: 5,
      harvest_date: '2024-09-02'
    }
  ],
  'Terpene': [
    {
      terpene_id: 1,
      name: 'Myrcene',
      description: 'Entspannend, sedierend'
    },
    {
      terpene_id: 2,
      name: 'Limonene',
      description: 'Stimmungsaufhellend, Anti-Stress'
    },
    {
      terpene_id: 3,
      name: 'Pinene',
      description: 'Fokussierend, gedächtnisfördernd'
    }
  ],
  'Dünger Sets': [
    {
      dünger_id: 1,
      manufacturer: 'Advanced Nutrients',
      name: 'pH Perfect Base Nutrients',
      components: ['Grow', 'Micro', 'Bloom']
    },
    {
      dünger_id: 2,
      manufacturer: 'General Hydroponics',
      name: 'Flora Series',
      components: ['FloraGrow', 'FloraMicro', 'FloraBloom']
    }
  ],
  'Shops': [
    {
      shop_id: 1,
      name: 'Growland',
      type: 'Online',
      url: 'https://growland.de'
    },
    {
      shop_id: 2,
      name: 'Hanf & Hanf',
      type: 'Store',
      url: null
    }
  ],
  'Klimazonen': [
    {
      climate_id: 1,
      name: 'warm'
    },
    {
      climate_id: 2,
      name: 'mild'
    },
    {
      climate_id: 3,
      name: 'heiss'
    }
  ]
};

function TableDetailPage() {
  const { tileName, tableName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Farbe aus URL-Parametern extrahieren
  const urlParams = new URLSearchParams(location.search);
  const tileColor = urlParams.get('color') || '#A497E9';
  
  const decodedTileName = decodeURIComponent(tileName);
  const decodedTableName = decodeURIComponent(tableName);

  console.log('📊 TableDetailPage - Kachel:', decodedTileName, 'Tabelle:', decodedTableName);

  // Tabellendaten laden
  useEffect(() => {
    const fetchTableData = async () => {
      setLoading(true);
      setError(null);

      try {
        // TODO: Echte API-Calls implementieren
        // const data = await apiFetch(`/api/tables/${tileName}/${tableName}`);
        
        // Für jetzt Mock-Daten verwenden
        const mockData = MOCK_TABLE_DATA[decodedTableName] || [];
        
        // Simuliere API-Verzögerung
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setTableData(mockData);
        console.log('Tabellendaten geladen:', mockData.length, 'Einträge');
        
      } catch (err) {
        console.error('Fehler beim Laden der Tabellendaten:', err);
        setError('Fehler beim Laden der Tabellendaten');
      } finally {
        setLoading(false);
      }
    };

    fetchTableData();
  }, [tileName, tableName, decodedTableName]);

  // Zurück zur Read-Seite
  const handleBack = () => {
    const encodedTileName = encodeURIComponent(tileName);
    const encodedColor = encodeURIComponent(tileColor);
    navigate(`/read/${encodedTileName}?color=${encodedColor}`);
  };

  // Tabellenspalten dynamisch generieren
  const renderTableHeaders = () => {
    if (tableData.length === 0) return null;
    
    const columns = Object.keys(tableData[0]);
    return (
      <TableRow>
        {columns.map(column => (
          <TableCell 
            key={column}
            sx={{ 
              fontWeight: 'bold',
              backgroundColor: `${tileColor}15`,
              color: '#4B2E05'
            }}
          >
            {column.replace(/_/g, ' ').toUpperCase()}
          </TableCell>
        ))}
      </TableRow>
    );
  };

  // Tabellendaten rendern
  const renderTableData = () => {
    return tableData.map((row, index) => (
      <TableRow key={index} hover>
        {Object.entries(row).map(([key, value]) => (
          <TableCell key={key}>
            {renderCellValue(key, value)}
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  // Zelleninhalt formatieren
  const renderCellValue = (key, value) => {
    // Boolean-Werte
    if (typeof value === 'boolean') {
      return (
        <Chip 
          label={value ? 'Ja' : 'Nein'} 
          color={value ? 'success' : 'default'}
          size="small"
        />
      );
    }

    // Arrays (z.B. components)
    if (Array.isArray(value)) {
      return value.join(', ');
    }

    // Rating-Sterne
    if (key === 'rating' && typeof value === 'number') {
      return '⭐'.repeat(value) + '☆'.repeat(5 - value);
    }

    // Prozent-Werte
    if (key.includes('percent') && typeof value === 'number') {
      return `${value}%`;
    }

    // Temperatur
    if (key.includes('temp') && typeof value === 'number') {
      return `${value}°C`;
    }

    // URLs
    if (key === 'url' && value) {
      return (
        <Typography 
          component="a" 
          href={value} 
          target="_blank" 
          sx={{ color: tileColor, textDecoration: 'underline' }}
        >
          {value}
        </Typography>
      );
    }

    // Default
    return value?.toString() || '-';
  };

  // Container mit der Kachel-Hintergrundfarbe
  const TableContainer = ({ children }) => (
    <Box sx={{
      minHeight: 'calc(100vh - 64px)',
      padding: 3,
      display: 'flex',
      flexDirection: 'column',
      background: `linear-gradient(135deg, ${tileColor}10 0%, ${tileColor}20 50%, ${tileColor}10 100%)`,
    }}>
      {children}
    </Box>
  );

  return (
    <TableContainer>
      {/* Header mit Back Button */}
      <Box display="flex" alignItems="center" width="100%" mb={3}>
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
          }}>
            <TableIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            {decodedTableName}
          </Typography>
          <Typography variant="body2" sx={{
            color: '#4B2E05',
            opacity: 0.8,
          }}>
            {decodedTileName} › Tabellendaten
          </Typography>
        </Box>
      </Box>

      {/* Inhalt */}
      <Box sx={{ width: '100%' }}>
        {loading && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress sx={{ color: tileColor }} />
            <Typography sx={{ ml: 2, color: '#4B2E05' }}>
              Lade Tabellendaten...
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && tableData.length === 0 && (
          <Card sx={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            py: 4
          }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Keine Daten vorhanden
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Die Tabelle "{decodedTableName}" enthält noch keine Einträge.
              </Typography>
            </CardContent>
          </Card>
        )}

        {!loading && !error && tableData.length > 0 && (
          <Card sx={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: `2px solid ${tileColor}40`,
            boxShadow: `0 4px 20px ${tileColor}20`
          }}>
            <CardContent sx={{ p: 0 }}>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    {renderTableHeaders()}
                  </TableHead>
                  <TableBody>
                    {renderTableData()}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </Box>
    </TableContainer>
  );
}

export default TableDetailPage;