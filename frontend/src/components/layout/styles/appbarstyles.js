import { styled } from '@mui/system';
import { AppBar, Box, Button } from '@mui/material';

export const AppBarContainer = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(90deg, #A497E9, #7DABF7, #92D8D8, #F2C6D9)',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  zIndex: theme.zIndex.appBar,
  '& .MuiToolbar-root': {
    minHeight: 64,
  }
}));

export const Logo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

export const UserSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const UserButton = styled(Button)(({ theme }) => ({
  color: '#4B2E05',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(75, 46, 5, 0.2)',
  borderRadius: theme.shape.borderRadius * 2,
  textTransform: 'none',
  padding: theme.spacing(0.5, 1.5),
  minWidth: 'auto',
  transition: 'all 0.2s ease',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(75, 46, 5, 0.4)',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(1),
    marginLeft: 0,
  },
}));