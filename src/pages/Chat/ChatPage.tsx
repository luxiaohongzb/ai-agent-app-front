import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Input, Typography, Avatar, Select, message } from 'antd';
import { SendOutlined, RobotOutlined, ClearOutlined, PlusOutlined } from '@ant-design/icons';
import MessageBubble from '../../components/chat/MessageBubble';
import { ChatMessage } from '../../types';
import apiClient from '../../services/api';
import { getKnowledgeBases, parseSSEDataPayload } from '../../services/chatService';
import { useChatPageStore } from '../../store/chatPageStore';

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
  // 使用 store 管理消息与 RAG 选择
  const messages = useChatPageStore((s) => s.messages);
  const addMessage = useChatPageStore((s) => s.addMessage);
  const updateMessage = useChatPageStore((s) => s.updateMessage);
  const clearMessages = useChatPageStore((s) => s.clearMessages);
  const selectedRagId = useChatPageStore((s) => s.selectedRagId);
  const setSelectedRagId = useChatPageStore((s) => s.setSelectedRagId);

  // 输入与运行时控制仍用本地状态
  const [input, setInput] = useState('');
  const [knowledgeBases, setKnowledgeBases] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const aiMsgIdRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const { Title, Paragraph } = Typography;

  // 将 store 中的消息映射为通用的 ChatMessage，供 MessageBubble 使用
  const toBubbleMessage = (m: LocalMessage): ChatMessage => ({
    id: m.id,
    content: m.content,
    isAssistant: m.role !== 'user',
    timestamp: m.timestamp,
    chatId: 'chatpage-local',
  });

  // 首次加载时删除旧版 localStorage 残留（迁移清理）
  useEffect(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  // 加载知识库列表（RAG）
  useEffect(() => {
    (async () => {
      try {
        const response = await getKnowledgeBases();
        setKnowledgeBases(Array.isArray(response) ? response : []);
        console.log(response)
      } catch (e) {
        console.error('Failed to load knowledge bases', e);
      }
    })();
  }, []);

  // 组件卸载时中断可能存在的流
  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
        abortRef.current = null;
      }
    };
  }, []);

  // 消息变更时自动滚动到底部
  useEffect(() => {
    const el = listRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  // 发送并对接流式接口
  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    // 追加用户消息
    addMessage({ role: 'user', content: text } as any);
    setInput('');

    // 准备 AI 占位消息（先插入，再记住其 id 以便流式更新）
    addMessage({ role: 'ai', content: '' } as any);
    // 读取刚插入的最后一条消息作为占位 id
    const last = useChatPageStore.getState().messages.slice(-1)[0];
    aiMsgIdRef.current = last?.id || null;

    // 若上一个流未结束，先中断
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }

    setLoading(true);

    try {
      const controller = new AbortController();
      abortRef.current = controller;
      const { signal } = controller;

      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
      const headers: Record<string, string> = {
        'Accept': 'text/event-stream',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const base = apiClient.defaults.baseURL; // e.g. http://localhost:8091/ai-agent-station/api/v1
      const qs = new URLSearchParams({ aiAgentId: '2', message: text });
      if (selectedRagId) qs.append('ragId', selectedRagId);
      const url = `${base}/agent/chat_stream?${qs.toString()}`;

      const resp = await fetch(url, { method: 'GET', headers, signal });
      if (!resp.ok || !resp.body) {
        throw new Error(`HTTP ${resp.status}`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const parts = buffer.split('\n');
        for (let i = 0; i < parts.length - 1; i++) {
          const line = parts[i].trim();
          if (!line) continue;
          try {
            let content = '';
            if (line.startsWith('data:')) {
              const payload = line.replace(/^data:\s*/, '');
              content = parseSSEDataPayload(payload);
            } else if (line.startsWith('event:') || line.startsWith(':')) {
              // 忽略注释或其他事件类型
              continue;
            } else {
              content = line;
            }
            if (content && aiMsgIdRef.current) {
              const st = useChatPageStore.getState();
              const currentAi = st.messages.find(m => m.id === aiMsgIdRef.current);
              const merged = (currentAi?.content || '') + content;
              updateMessage(aiMsgIdRef.current, merged);
            }
          } catch (err) {
            console.warn('parse line error:', err);
          }
        }
        // 将尾部不完整行留在缓冲区
        buffer = parts[parts.length - 1];
      }

      // 处理缓冲区残留
      const tail = buffer.trim();
      if (tail) {
        let content = '';
        if (tail.startsWith('data:')) {
          const payload = tail.replace(/^data:\s*/, '');
          content = parseSSEDataPayload(payload);
        } else {
          content = tail;
        }
        if (content && aiMsgIdRef.current) {
          const st = useChatPageStore.getState();
          const currentAi = st.messages.find(m => m.id === aiMsgIdRef.current);
          const merged = (currentAi?.content || '') + content;
          updateMessage(aiMsgIdRef.current, merged);
        }
      }

      setLoading(false);
      aiMsgIdRef.current = null;
      abortRef.current = null;
    } catch (error) {
      console.error('Stream error:', error);
      setLoading(false);
      aiMsgIdRef.current = null;
      abortRef.current = null;
      message.error('发送失败或网络错误');
      // 给出错误提示消息
      addMessage({ role: 'ai', content: '网络错误，已结束本次会话。请稍后重试。' } as any);
    }
  };

  const handleClear = () => {
    // 中断可能的流
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    clearMessages();
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        background: 'transparent',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      <Card
        bordered={false}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 0,
          boxShadow: 'none',
          display: 'flex',
          flexDirection: 'column',
        }}
        bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        {/* 顶部标题区 */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #f0f0f0',
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            gap: 12,
            flexShrink: 0,
          }}
        >
          {/* 左侧占位，保证中间内容绝对居中 */}
          <div />

          {/* 中间：图标 + 标题，整体居中 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifySelf: 'center' }}>
            <Avatar size={28} icon={<RobotOutlined />} />
            <Title level={5} style={{ margin: 0 }}>AI Chat</Title>
          </div>

          {/* 右侧：RAG 选择器，靠右对齐 */}
          <div style={{ minWidth: 220, justifySelf: 'end' }}>
            <Select
              allowClear
              placeholder="选择RAG（可选）"
              value={selectedRagId}
              onChange={(val) => setSelectedRagId(val || undefined)}
              style={{ width: 260 }}
              size="small"
              options={knowledgeBases.map((kb: any) => ({
                value: kb.ragId || '',
                label: kb.ragName || '未命名知识库'
              }))}
            />
          </div>
        </div>

        {/* 内容区 */}
        <div ref={listRef} style={{ flex: 1, overflow: 'auto', padding: 16, minHeight: 0 }}>
          {messages.length === 0 ? (
            <div
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Card
                bordered
                style={{ width: 360, borderRadius: 14, textAlign: 'center' }}
                bodyStyle={{ padding: 20 }}
              >
                <Avatar size={48} icon={<RobotOutlined />} style={{ background: '#f0f5ff', color: '#2f54eb' }} />
                <Title level={5} style={{ marginTop: 12, marginBottom: 6 }}>AI Agent 正在待命</Title>
                <Paragraph type="secondary" style={{ marginBottom: 16 }}>
                  欢迎开启 AI 智能对话
                </Paragraph>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setInput('你好')}>
                  开始新的对话
                </Button>
              </Card>
            </div>
          ) : (
            messages.map((m) => <MessageBubble key={m.id} message={toBubbleMessage(m)} />)
          )}
        </div>

        {/* 底部输入区 */}
        <div
          style={{
            padding: 12,
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            gap: 8,
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            flexShrink: 0,
          }}
        >
          <Input.TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="在这里输入消息（已写入 store 持久化）"
            autoSize={{ minRows: 1, maxRows: 4 }}
            style={{ flex: 1, minWidth: 220 }}
            disabled={loading}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <Button type="primary" icon={<SendOutlined />} onClick={handleSend} loading={loading}>
              发送
            </Button>
            <Button icon={<ClearOutlined />} onClick={handleClear} disabled={loading}>
              清空
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatPage;