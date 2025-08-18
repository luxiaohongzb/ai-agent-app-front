import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useThemeStore } from '../../store';
import {
  MessageOutlined,
  RobotOutlined,
  UploadOutlined,
  GithubOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const NavItem = styled(ListItemButton)(({ theme, active, isdark }: any) => ({
  borderRadius: '8px',
  marginBottom: '4px',
  backgroundColor: active
    ? isdark
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.04)'
    : 'transparent',
  '&:hover': {
    backgroundColor: isdark
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(0, 0, 0, 0.02)',
  },
}));

const NavMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const navItems = [
    {
      text: '聊天',
      icon: <MessageOutlined />,
      path: '/chat',
    },
    {
      text: 'AI自动代理',
      icon: <RobotOutlined />,
      path: '/autoagent',
    },
    {
      text: '上传文件',
      icon: <UploadOutlined />,
      path: '/upload',
    },
    {
      text: 'Git仓库',
      icon: <GithubOutlined />,
      path: '/git',
    },
    {
      text: '系统管理',
      icon: <SettingOutlined />,
      path: '/admin',
    },
  ];

  return (
    <Box sx={{ p: 1.5 }}>
      <List sx={{ p: 0 }}>
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <ListItem key={item.path} disablePadding>
              <NavItem
                active={isActive ? 1 : 0}
                isdark={isDark ? 1 : 0}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive
                      ? 'primary.main'
                      : isDark
                      ? 'rgba(255, 255, 255, 0.7)'
                      : 'rgba(0, 0, 0, 0.6)',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 500 : 400,
                    color: isActive
                      ? 'primary.main'
                      : isDark
                      ? 'rgba(255, 255, 255, 0.9)'
                      : 'inherit',
                  }}
                />
              </NavItem>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default NavMenu;