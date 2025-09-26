import { styled } from '@mui/system';
import { Box, IconButton } from '@mui/material';

export const ReadContainer = styled(Box)(({ theme }) => ({
  minHeight: 'calc(100vh - 64px)',
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '#f5f1e9',
}));

export const BackButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(164, 151, 233, 0.1)',
  color: '#A497E9',
  border: '1px solid rgba(164, 151, 233, 0.3)',
  '&:hover': {
    backgroundColor: 'rgba(164, 151, 233, 0.2)',
    transform: 'translateX(-2px)',
  },
  transition: 'all 0.2s ease',
}));