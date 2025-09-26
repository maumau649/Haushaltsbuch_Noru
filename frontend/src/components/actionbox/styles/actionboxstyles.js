import { styled } from '@mui/system';
import { Box, Card, IconButton, Button } from '@mui/material';

export const ActionContainer = styled(Box)(({ theme }) => ({
  minHeight: 'calc(100vh - 64px)',
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '#f5f1e9',
}));

export const ActionCard = styled(Card)(({ theme }) => ({
  width: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
    transform: 'translateY(-2px)',
  },
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

export const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  textTransform: 'none',
  fontWeight: '600',
  length: '450px',
  height: '50px',
  padding: theme.spacing(1.5, 3),
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
}));