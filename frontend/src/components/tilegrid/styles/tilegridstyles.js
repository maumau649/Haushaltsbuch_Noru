import { styled } from '@mui/system';
import { Box, Paper } from '@mui/material';

export const TileContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 150px)',
  gridAutoRows: '150px',
  justifyContent: 'center',
  gap: theme.spacing(4),
  width: '100%',
  maxWidth: 700,
  margin: '0 auto',
  paddingTop: theme.spacing(3),
  boxSizing: 'border-box',
}));

export const Tile = styled(Paper)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 3,
  width: 150,
  height: 150,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  userSelect: 'none',
  color: '#4B2E05',
  fontWeight: 'bold',
  fontSize: '1.2rem',
  textAlign: 'center',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
  },
}));
