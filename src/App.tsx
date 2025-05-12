import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider as MuiThemeProvider, StyledEngineProvider, Direction } from '@mui/material/styles';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { useTranslation } from 'react-i18next';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import TransactionsDashboard from './components/transactions/TransactionsDashboard';
import AllTransactions from './components/transactions/AllTransactions';
import BalanceManagement from './components/balance/BalanceManagement';
import Home from './components/home/Home';
import HRDashboard from './components/hr/HRDashboard';
import AuthLayout from './components/layout/AuthLayout';
import './i18n';

const createRtlCache = () => {
  return createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
  });
};

const cacheRtl = createRtlCache();

const createCustomTheme = (direction: Direction) => createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  direction,
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [direction, setDirection] = useState<Direction>('ltr');
  const theme = createCustomTheme(direction);
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    const newDir = newLang === 'ar' ? 'rtl' : 'ltr';
    i18n.changeLanguage(newLang);
    setDirection(newDir);
    document.dir = newDir;
  };

  useEffect(() => {
    // Set initial direction based on current language
    const currentLang = i18n.language;
    const currentDir = currentLang === 'ar' ? 'rtl' : 'ltr';
    setDirection(currentDir);
    document.dir = currentDir;
  }, [i18n.language]);

  useEffect(() => {
    // Check for token on mount
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const handleLanguageChange = () => {
      const dir = document.dir;
      setDirection(dir as Direction);
    };

    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  const PrivateRoute = ({ element }: { element: JSX.Element }) => {
    return isAuthenticated ? (
      <AuthLayout toggleLanguage={toggleLanguage} currentLanguage={i18n.language}>{element}</AuthLayout>
    ) : (
      <Navigate to="/login" />
    );
  };

  return (
    <StyledEngineProvider injectFirst>
      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Routes>
              <Route 
                path="/" 
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/home" />} 
              />
              <Route path="/home" element={<Home />} />
              <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
              />
              <Route
                path="/register"
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register setIsAuthenticated={setIsAuthenticated} />}
              />
              <Route
                path="/dashboard"
                element={<PrivateRoute element={<Dashboard />} />}
              />
              <Route
                path="/transactions"
                element={<PrivateRoute element={<TransactionsDashboard />} />}
              />
              <Route
                path="/transactions/all"
                element={<PrivateRoute element={<AllTransactions />} />}
              />
              <Route
                path="/balance"
                element={<PrivateRoute element={<BalanceManagement />} />}
              />
              <Route
                path="/hr-dashboard"
                element={<PrivateRoute element={<HRDashboard />} />}
              />
            </Routes>
          </Router>
        </ThemeProvider>
      </CacheProvider>
    </StyledEngineProvider>
  );
}

export default App;
