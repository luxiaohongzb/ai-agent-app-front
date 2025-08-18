import React, { useEffect } from 'react';
import { Box, IconButton, Avatar, Typography as MuiTypography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { MenuOutlined, SunOutlined, MoonOutlined, LogoutOutlined } from '@ant-design/icons';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import { useStore } from '../../store';
import GradientBackground from '../common/GradientBackground';
import Sidebar from './Sidebar';
import ChatArea from '../chat/ChatArea';
import MessageInput from '../chat/MessageInput';

// 创建带有高斯模糊效果的内容容器
const GlassContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.08)',
  borderRadius: '20px',
  overflow: 'hidden',
  height: 'calc(100vh - 32px)',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  margin: '16px',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
}));

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useThemeStore();
  const { logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useStore();

  // 响应式处理
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);

  const handleLogout = () => {
    logout();
  };

  return (
    <GradientBackground>
      <GlassContainer>
        {/* 顶部导航栏 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, md: 2 },
            padding: { xs: '0 16px', md: '0 24px' },
            height: { xs: 56, md: 64 },
            position: 'sticky',
            top: 0,
            zIndex: 30,
            borderBottom: theme === 'dark' ? '1px solid #4b5563' : '1px solid rgba(0, 0, 0, 0.06)',
            backdropFilter: 'blur(8px)',
            backgroundColor: theme === 'dark' ? '#374151' : 'rgba(255, 255, 255, 0.5)',
          }}
        >
          {/* 侧边栏切换按钮 */}
          <IconButton
            onClick={toggleSidebar}
            sx={{
              borderRadius: 2,
              p: 1,
              color: 'text.secondary',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
              transition: 'all 0.2s',
            }}
            title="切换侧边栏"
          >
            <MenuOutlined />
          </IconButton>

          {/* 标题 */}
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <MuiTypography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: theme === 'dark' ? '#f3f4f6' : '#1f2937',
                margin: 0,
              }}
            >
              AI Agent Station
            </MuiTypography>
          </Box>

          {/* 右侧用户信息和操作 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* 用户头像和信息 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 1 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: theme === 'dark' ? '#60a5fa' : '#3b82f6',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                管
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <MuiTypography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    color: theme === 'dark' ? '#f3f4f6' : '#1f2937',
                    lineHeight: 1,
                  }}
                >
                  管理员
                </MuiTypography>
              </Box>
            </Box>

            {/* 主题切换按钮 */}
            <IconButton
              onClick={toggleTheme}
              sx={{
                borderRadius: 2,
                p: 1,
                color: 'text.secondary',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
                transition: 'all 0.2s',
              }}
              title={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
            >
              {theme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
            </IconButton>

            {/* 退出登录按钮 */}
            <IconButton
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                p: 1,
                color: 'text.secondary',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
                transition: 'all 0.2s',
              }}
              title="退出登录"
            >
              <LogoutOutlined />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* 侧边栏 */}
          <Sidebar />

          {/* 主内容区域 */}
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            {/* 如果有 children，渲染 children，否则渲染默认的聊天区域 */}
            {children ? (
              <Box sx={{ flex: 1, overflow: 'auto', p: { xs: 2, md: 3 } }}>
                {children}
              </Box>
            ) : (
              <>
                {/* 聊天区域 */}
                <Box sx={{ flex: 1, overflow: 'auto', p: { xs: 2, md: 3 } }}>
                  <ChatArea />
                </Box>
                
                {/* 底部消息输入区域 */}
                <Box sx={{ p: { xs: 2, md: 3 }, borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                  <Box sx={{ maxWidth: '4xl', mx: 'auto' }}>
                    <MessageInput />
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </GlassContainer>
    </GradientBackground>
  );
};

export default MainLayout;