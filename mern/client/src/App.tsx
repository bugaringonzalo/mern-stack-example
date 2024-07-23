import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext.tsx';
// Removed the problematic import of theme
import Navbar from './components/NavBar.tsx';
// Corrected the import paths for Login and Register
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Dashboard from './components/Dashboard.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import BookingSystem from './components/BookingSystem.tsx';
import PrivateRoute from './components/PrivateRoute.tsx';
import AdminRoute from './components/AdminRoute.tsx';

// Use a different variable name for the created theme to avoid conflict
const appTheme = createTheme();

const App: React.FC = () => {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
        <AuthProvider>
          <Router>
            <Navbar />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
                <Route path="/booking" element={<PrivateRoute><BookingSystem /></PrivateRoute>} />
                <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              </Routes>
          </Router>
        </AuthProvider>
    </ThemeProvider>
  );
}

export default App;