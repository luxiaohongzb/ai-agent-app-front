import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useThemeStore } from './store';
import MainLayout from './components/layout/MainLayout';
import UploadPage from './pages/Upload/UploadPage';
import GitPage from './pages/Git/GitPage';
import AdminPage from './pages/Admin/AdminPage';
import ChatPage from './pages/Chat/ChatPage';
import LoginPage from './pages/Auth/LoginPage';
import AutoAgentLayout from './pages/AutoAgent/AutoAgentLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// 创建QueryClient实例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Ant Design主题配置
const antdTheme = {
  token: {
    colorPrimary: '#0ea5e9',
    borderRadius: 8,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
  },
};

// Material UI主题配置
const createMuiTheme = (isDark: boolean) => createTheme({
  palette: {
    mode: isDark ? 'dark' : 'light',
    primary: {
      main: '#0ea5e9',
    },
    background: {
      default: 'transparent',
      paper: isDark ? '#374151' : '#ffffff',
    },
    text: {
      primary: isDark ? '#f3f4f6' : '#1f2937',
      secondary: isDark ? '#9ca3af' : '#6b7280',
    },
  },
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: isDark ? '#374151' : '#f1f5f9',
          },
          '&::-webkit-scrollbar-thumb': {
            background: isDark ? '#6b7280' : '#cbd5e1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: isDark ? '#9ca3af' : '#94a3b8',
          },
        },
      },
    },
  },
});

function AppContent() {
  const { theme } = useThemeStore();
  const muiTheme = createMuiTheme(theme === 'dark');

  // 应用主题类到document
  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <ConfigProvider locale={zhCN} theme={antdTheme}>
        <Router>
          <div className="App">
            <Routes>
              {/* 公开路由 */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* 受保护的路由 */}
              <Route path="/" element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              } />
              <Route path="/chat" element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              } />
              <Route path="/upload" element={
                <ProtectedRoute>
                  <MainLayout>
                    <UploadPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/git" element={
                <ProtectedRoute>
                  <MainLayout>
                    <GitPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              } />
              <Route path="/autoagent" element={
                <ProtectedRoute>
                  <AutoAgentLayout />
                </ProtectedRoute>
              } />
              <Route path="/autoagent/:chatId" element={
                <ProtectedRoute>
                  <AutoAgentLayout />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </ConfigProvider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
