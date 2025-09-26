import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

// Pages
import Login from './components/login/Login';
import MainPage from './components/main/MainPage';
import ActionPage from './components/actionbox/ActionBoxPage';
import ProfilePage from './components/profile/Profile';

// Neue Read-Pages
import ReadPage from './components/read/ReadPage';
import TableDetailPage from './components/read/TableDetailPage';

// Layout Components
import AppBar from './components/layout/AppBar';
import PrivateRoute from './components/privateroute/PrivateRoute';

/**
 * Layout Wrapper für Seiten mit AppBar
 */
const AppLayout = ({ children }) => (
  <Box sx={{ minHeight: '100vh', bgcolor: '#f5f1e9' }}>
    <AppBar />
    <Box sx={{ paddingTop: '64px' }}> {/* AppBar height offset */}
      {children}
    </Box>
  </Box>
);

/**
 * Hauptkomponente - Router und Layout Manager
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Route - ohne AppBar */}
        <Route path="/login" element={<Login />} />
        
        {/* Geschützte Routen - mit AppBar Layout */}
        <Route
          path="/main"
          element={
            <PrivateRoute>
              <AppLayout>
                <MainPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/action/:tileName"
          element={
            <PrivateRoute>
              <AppLayout>
                <ActionPage />
              </AppLayout>
            </PrivateRoute>
          }
        />

        {/* Neue Read-Routen */}
        <Route
          path="/read/:tileName"
          element={
            <PrivateRoute>
              <AppLayout>
                <ReadPage />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/table/:tileName/:tableName"
          element={
            <PrivateRoute>
              <AppLayout>
                <TableDetailPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <AppLayout>
                <ProfilePage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        
        {/* Default Redirects */}
        <Route 
          path="/" 
          element={<Navigate to="/login" replace />} 
        />
        
        <Route 
          path="*" 
          element={<Navigate to="/main" replace />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;