import { styled } from '@mui/system';
import { Box, Paper, Typography } from '@mui/material';

export const ProfileContainer = styled(Box)(({ theme }) => ({
  minHeight: 'calc(100vh - 64px)',
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '#f5f1e9',
  gap: theme.spacing(3),
}));

export const ProfileCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 600,
  width: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
    transform: 'translateY(-2px)',
  },
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  color: '#4B2E05',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));