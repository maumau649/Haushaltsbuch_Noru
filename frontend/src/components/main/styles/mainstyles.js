import { styled } from '@mui/system';
import { Box } from '@mui/material';

export const MainContainer = styled(Box)(({ theme }) => ({
  minHeight: 'calc(100vh - 64px)',
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '#f5f1e9',
}));


export const TileSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flex: 1,
  width: '100%',
  maxWidth: 800,
}));
