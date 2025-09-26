import React from 'react';
import { Typography } from '@mui/material';
import { TileContainer, Tile } from './styles/tilegridstyles';

function TileGrid({ tiles, onTileClick }) {
  if (!tiles || tiles.length === 0) {
    return (
      <Typography variant="body1" color="textSecondary" textAlign="center">
        Noch keine Kacheln vorhanden. Klicke auf + um eine neue zu erstellen.
      </Typography>
    );
  }

  return (
    <TileContainer>
      {tiles.map((tile, index) => (
        <Tile
          key={`${tile.name}-${index}`}
          onClick={() => onTileClick(tile.name)}
          sx={{ 
            backgroundColor: tile.color,
            '&:hover': {
              backgroundColor: tile.color,
              filter: 'brightness(1.1)',
            }
          }}
        >
          <Typography variant="h6" component="div" sx={{
            color: '#4B2E05',
            fontWeight: 'bold',
            textAlign: 'center',
            wordBreak: 'break-word',
            hyphens: 'auto',
            lineHeight: 1.2,
          }}>
            {tile.name}
          </Typography>
        </Tile>
      ))}
    </TileContainer>
  );
}

export default TileGrid;