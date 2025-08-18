import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { Box, Typography, Paper, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MessageBubble from '../../components/chat/MessageBubble';
import { ChatMessage } from '../../types';

// ChatPage 独立数据模型（不依赖 store）
interface LocalMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
}

// 持久化存储键（仅 ChatPage 使用，不进入全局 store）
const STORAGE_KEY = 'chatpage-local-messages';

const ChatPage: React.FC = () => {
  // 使用本地状态维护消息，确保与 store 历史消息完全解耦
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [input, setInput] = useState('');

  // 将本地消息映射为通用的 ChatMessage，供 MessageBubble 使用
  const toBubbleMessage = (m: LocalMessage): ChatMessage => ({
    id: m.id,
    content: m.content,
    isAssistant: m.role !== 'user',
    timestamp: m.timestamp,
    chatId: 'chatpage-local',
  });

  // 首次加载时从 localStorage 恢复
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setMessages(parsed as LocalMessage[]);
        }
      }
    } catch (e) {
      console.warn('Failed to load ChatPage messages from localStorage:', e);
    }
  }, []);

  // 消息变更时写入 localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed to save ChatPage messages to localStorage:', e);
    }
  }, [messages]);
  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: LocalMessage = {
      id: 'u-' + Date.now(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // 简单模拟一条 AI 回复，强调该页与 AgentPage 的数据不同且未对接 store
    const aiMsg: LocalMessage = {
      id: 'a-' + Date.now(),
      role: 'ai',
      content: '这是 ChatPage 的独立会话区域（未对接 store 历史消息），用于展示与 AgentPage 不同的数据流。',
      timestamp: Date.now(),
    };
    setTimeout(() => setMessages((prev) => [...prev, aiMsg]), 150);
  };

  const handleClear = () => {
    setMessages([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  return (
    <MainLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
        {/* 头部说明区 */}
        <Paper elevation={0} sx={{ p: 2, borderRadius: 2, background: 'rgba(0,0,0,0.03)' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            独立聊天（与 AgentPage 解耦）
          </Typography>
          <Typography variant="body2" color="text.secondary">
            本页面不读取或写入全局 store 的历史消息，展示的数据与智能体页（AgentPage）不同，用于并行的独立体验或数据源演示。
          </Typography>
        </Paper>

        {/* 消息列表 */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2, display: 'flex', flexDirection: 'column' }}>
          {messages.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              还没有消息，随便说点什么吧~（此处的数据不会出现在历史会话中）
            </Typography>
          ) : (
            messages.map((m) => (
              <MessageBubble key={m.id} message={toBubbleMessage(m)} />
            ))
          )}
        </Box>

        {/* 底部输入区（独立，不使用 MessageInput） */}
        <Paper elevation={0} sx={{ p: 1.5, borderRadius: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            fullWidth
            size="small"
            placeholder="在这里输入消息（不会写入 store 历史）"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <IconButton color="primary" onClick={handleSend}>
            <SendIcon />
          </IconButton>
          <IconButton onClick={handleClear} title="清空（仅清除本页本地状态）">
            🧹
          </IconButton>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default ChatPage;