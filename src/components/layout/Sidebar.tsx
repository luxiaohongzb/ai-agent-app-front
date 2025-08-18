import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal, Input, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Box, List, ListItemButton, ListItemText, IconButton, Divider, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AddIcon from '@mui/icons-material/Add';
import { useStore, useThemeStore } from '../../store';
import { formatTime } from '../../utils/format';
import NavMenu from './NavMenu';

// 重命名 Typography 以避免与 Ant Design 的 Typography 冲突
const MuiTypography = Typography;

interface SidebarProps {}

// 创建自定义侧边栏容器
const GlassSidebar = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isDark',
})<{ isDark: boolean }>(({ theme, isDark }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: isDark ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.5)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  borderRight: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.3)',
  width: '260px',
  overflow: 'hidden',
}));

// 创建自定义聊天项
const ChatItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'isDark',
})<{ isDark: boolean }>(({ theme, isDark }) => ({
  borderRadius: '8px',
  margin: '2px 0',
  padding: '8px 12px',
  '&:hover': {
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
  },
}));

// 创建活跃聊天项
const ActiveChatItem = styled(ChatItem, {
  shouldForwardProp: (prop) => prop !== 'isDark',
})<{ isDark: boolean }>(({ theme, isDark }) => ({
  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
  '&:hover': {
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0, 0, 0, 0.1)',
  },
}));

const Sidebar: React.FC<SidebarProps> = () => {
  const navigate = useNavigate();
  const { chatId } = useParams<{ chatId: string }>();
  const currentChatId = chatId;

  // 使用单独的选择器来避免不必要的重新渲染
  const sidebarOpen = useStore((state) => state.sidebarOpen);
  const setSidebarOpen = useStore((state) => state.setSidebarOpen);
  const chats = useStore((state) => state.chats);
  const createChat = useStore((state) => state.createChat);
  const loadChat = useStore((state) => state.loadChat);
  const deleteChat = useStore((state) => state.deleteChat);
  const renameChat = useStore((state) => state.renameChat);
  
  // 获取主题状态
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [renameChatId, setRenameChatId] = useState<string | null>(null);
  const [newChatTitle, setNewChatTitle] = useState('');
  // 删除确认模态框的状态
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  // 处理聊天重命名
  const handleRename = (chatId: string, currentTitle: string) => {
    setRenameChatId(chatId);
    setNewChatTitle(currentTitle);
    setRenameModalVisible(true);
  };

  // 确认重命名
  const confirmRename = () => {
    if (renameChatId && newChatTitle.trim()) {
      renameChat(renameChatId, newChatTitle.trim());
      message.success('重命名成功');
      setRenameModalVisible(false);
      setRenameChatId(null);
      setNewChatTitle('');
    }
  };

  // 处理聊天删除（打开确认弹窗）
  const handleDelete = (chatId: string) => {
    setPendingDeleteId(chatId);
    setDeleteModalVisible(true);
  };

  // 确认删除
  const confirmDelete = () => {
    if (!pendingDeleteId) return;
    const isCurrentChat = currentChatId === pendingDeleteId;
    const remainingChats = chats.filter(chat => chat.id !== pendingDeleteId);

    deleteChat(pendingDeleteId);

    // 如果删除的是当前聊天，导航到剩余的第一个聊天或首页
    if (isCurrentChat) {
      if (remainingChats.length > 0) {
        navigate(`/autoagent/${remainingChats[0].id}`);
      } else {
        navigate('/autoagent');
      }
    }

    message.success('聊天已删除');
    setDeleteModalVisible(false);
    setPendingDeleteId(null);
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setPendingDeleteId(null);
  };



  // 使用从utils/format导入的formatTime函数

  return (
    <>
      {/* 移动端遮罩层 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Box
        sx={{
          position: { xs: 'fixed', md: 'relative' },
          zIndex: { xs: 50, md: 'auto' },
          height: '100%',
          transform: { xs: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)', md: 'translateX(0)' },
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        <GlassSidebar isDark={isDark}>
          {/* 导航菜单 */}
          <NavMenu />
          
          <Divider sx={{ my: 1, borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)' }} />
          
          <Box sx={{ p: 2, borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <MuiTypography variant="subtitle2" sx={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)', px: 1, py: 0.5, fontSize: '0.75rem' }}>
              聊天记录
            </MuiTypography>
            <IconButton 
              size="small" 
              sx={{ color: 'primary.main' }}
              onClick={createChat}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 1.5 }}>
            {chats.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4, color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary' }}>
                <ChatBubbleOutlineIcon sx={{ fontSize: '2rem', mb: 1 }} />
                <MuiTypography variant="body2" sx={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'inherit' }}>暂无聊天记录</MuiTypography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {chats.map((chat) => (
                  currentChatId === chat.id ? (
                    <ActiveChatItem key={chat.id} isDark={isDark} onClick={() => {
                      loadChat(chat.id);
                      navigate(`/autoagent/${chat.id}`);
                    }}>
                      <ListItemText
                        primary={
                          <MuiTypography variant="body2" noWrap sx={{ fontWeight: 500, color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'inherit' }}>
                            {chat.title}
                          </MuiTypography>
                        }
                        secondary={
                          <MuiTypography variant="caption" noWrap sx={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary' }}>
                            {formatTime(chat.updatedAt)}
                          </MuiTypography>
                        }
                        sx={{ pr: 4 }}
                      />
                      <Box sx={{ display: 'flex', gap: 0.5, position: 'absolute', right: 8, top: 8, opacity: 0, '&:hover': { opacity: 1 }, '.MuiListItemButton-root:hover &': { opacity: 0.7 } }}>
                        <IconButton
                          size="small"
                          sx={{ bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)', '&:hover': { bgcolor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)' } }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRename(chat.id, chat.title);
                          }}
                        >
                          <EditOutlined fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ color: 'error.main', bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)', '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.08)' } }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(chat.id);
                          }}
                        >
                          <DeleteOutlined fontSize="small" />
                        </IconButton>
                      </Box>
                    </ActiveChatItem>
                  ) : (
                    <ChatItem key={chat.id} isDark={isDark} onClick={() => {
                      loadChat(chat.id);
                      navigate(`/autoagent/${chat.id}`);
                    }}>
                      <ListItemText
                        primary={
                          <MuiTypography variant="body2" noWrap sx={{ color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'inherit' }}>
                            {chat.title}
                          </MuiTypography>
                        }
                        secondary={
                          <MuiTypography variant="caption" noWrap sx={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary' }}>
                            {formatTime(chat.updatedAt)}
                          </MuiTypography>
                        }
                        sx={{ pr: 4 }}
                      />
                      <Box sx={{ display: 'flex', gap: 0.5, position: 'absolute', right: 8, top: 8, opacity: 0, '&:hover': { opacity: 1 }, '.MuiListItemButton-root:hover &': { opacity: 0.7 } }}>
                        <IconButton
                          size="small"
                          sx={{ bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)', '&:hover': { bgcolor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)' } }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRename(chat.id, chat.title);
                          }}
                        >
                          <EditOutlined fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ color: 'error.main', bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)', '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.08)' } }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(chat.id);
                          }}
                        >
                          <DeleteOutlined fontSize="small" />
                        </IconButton>
                      </Box>
                    </ChatItem>
                  )
                ))}
              </List>
            )}
          </Box>
          

        </GlassSidebar>
      </Box>

      {/* 重命名模态框 */}
      <Modal
        title="重命名聊天"
        open={renameModalVisible}
        onOk={confirmRename}
        onCancel={() => {
          setRenameModalVisible(false);
          setRenameChatId(null);
          setNewChatTitle('');
        }}
        okText="确认"
        cancelText="取消"
      >
        <Input
          value={newChatTitle}
          onChange={(e) => setNewChatTitle(e.target.value)}
          placeholder="请输入新的聊天标题"
          maxLength={50}
          onPressEnter={confirmRename}
          autoFocus
        />
      </Modal>

      {/* 删除确认模态框（使用受控方式替代 Modal.confirm 以避免某些环境下不显示的问题）*/}
      <Modal
        title="确认删除"
        open={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={cancelDelete}
        okText="删除"
        okButtonProps={{ danger: true }}
        cancelText="取消"
      >
        确定要删除这个聊天吗？此操作不可撤销。
      </Modal>
    </>
  );
};

export default Sidebar;