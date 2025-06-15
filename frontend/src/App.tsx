import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { client } from './graphql/client';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import EmployeeList from './components/EmployeeList';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import { ThemeModeProvider, ThemeModeContext } from './theme/ThemeModeContext';

const AppTheme: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { mode } = useContext(ThemeModeContext);
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#6C63FF',
        contrastText: '#fff',
      },
      secondary: {
        main: '#FF6584',
      },
      background: {
        default: mode === 'dark' ? '#181a1b' : '#f4f6fb',
        paper: mode === 'dark' ? 'rgba(30,32,34,0.95)' : 'rgba(255,255,255,0.85)',
      },
    },
    shape: {
      borderRadius: 18,
    },
    typography: {
      fontFamily: 'Inter, Roboto, Arial, sans-serif',
      h1: { fontWeight: 800 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            background: mode === 'dark' ? 'rgba(30,32,34,0.95)' : 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: mode === 'dark'
              ? 'linear-gradient(90deg, #232526 0%, #6C63FF 100%)'
              : 'linear-gradient(90deg, #6C63FF 0%, #FF6584 100%)',
            boxShadow: '0 4px 24px 0 rgba(108,99,255,0.12)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            fontWeight: 600,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 18,
            boxShadow: '0 4px 24px 0 rgba(108,99,255,0.10)',
          },
        },
      },
    },
  });
  return <ThemeProvider theme={theme}><CssBaseline />{children}</ThemeProvider>;
};

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <ThemeModeProvider>
        <AppTheme>
          <AuthProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Dashboard />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/employees"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <EmployeeList />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Settings />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Router>
          </AuthProvider>
        </AppTheme>
      </ThemeModeProvider>
    </ApolloProvider>
  );
};

export default App;
