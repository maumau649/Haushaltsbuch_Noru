import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    background: {
      default: '#e3f2fd', // hellblau
    },
    primary: {
      main: '#1976d2', // Blau für Buttons etc.
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline /> {/* Setzt Hintergrundfarbe global */}
    <App />
  </ThemeProvider>
);
