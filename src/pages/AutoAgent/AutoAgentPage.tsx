import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Select, InputNumber, message, Spin, Tooltip } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined, PlusOutlined, DeleteOutlined, LoadingOutlined, DownOutlined } from '@ant-design/icons';
import { createChatStream, getAIAgents } from '../../services/chatService';
import './AutoAgent.css';
import MessageBubble from '../../components/chat/MessageBubble';
import { AIAgent } from '../../types';
import { useStore } from '../../store';
import { useParams, useNavigate } from 'react-router-dom';

const { TextArea } = Input;
const { Option } = Select;

interface Message {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: number;
  stage?: string;
  subType?: string;
  step?: number;
}

const AutoAgentPage: React.FC = () => {
  const navigate = useNavigate();
  const { chatId } = useParams<{ chatId: string }>();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [thinkingMessages, setThinkingMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiAgentId, setAiAgentId] = useState<string>('3');
  const [maxStep, setMaxStep] = useState<number>(3);
  const [sessionId, setSessionId] = useState<string>('session-' + Math.random().toString(36).substring(2, 10));
  const [aiAgents, setAiAgents] = useState<AIAgent[]>([]);
  const [promptCase, setPromptCase] = useState<string | undefined>(undefined);

  const inputRef = useRef<any>(null);
  const thinkingMessagesRef = useRef<HTMLDivElement>(null);
  const resultMessagesRef = useRef<HTMLDivElement>(null);
  const streamCancelRef = useRef<{ cancel: () => void } | null>(null);
  // 新增：流式超时定时器与超时阈值（毫秒）
  const STREAM_TIMEOUT_MS = 20000;
  const streamTimeoutRef = useRef<number | null>(null);

  // 从 store 获取状态和方法
  const currentChat = useStore((state) => state.currentChat);
  const createChat = useStore((state) => state.createChat);
  const loadChat = useStore((state) => state.loadChat);
  const addMessage = useStore((state) => state.addMessage);
  const deleteChat = useStore((state) => state.deleteChat);
  const clearAllChats = useStore((state) => state.clearAllChats);
  
  // 当 chatId 变化时，加载对应的聊天
  useEffect(() => {
   // 切换会话时，先中断旧的流
   if (streamCancelRef.current) {
     streamCancelRef.current.cancel();
     streamCancelRef.current = null;
   }
    if (chatId) {
      // 仅当 store 中确实存在该 chat 时才加载，避免误显示上一个会话
      const { chats } = useStore.getState();
      const exists = chats.some(c => c.id === chatId);
      if (exists) {
        loadChat(chatId);
      } else {
        // chatId 不存在时，清空消息
        setMessages([]);
        setThinkingMessages([]);
      }
    } else {
      // 没有 chatId 时，清空消息
      setMessages([]);
      setThinkingMessages([]);
    }
    return () => {
     // 组件卸载或依赖变更时也中断流
     if (streamCancelRef.current) {
       streamCancelRef.current.cancel();
       streamCancelRef.current = null;
     }
     // 同时清理超时定时器
     if (streamTimeoutRef.current) {
       clearTimeout(streamTimeoutRef.current);
       streamTimeoutRef.current = null;
     }
    };
  }, [chatId, loadChat]);

  // 当 currentChat 变化时，同步消息到本地状态
  useEffect(() => {
    if (currentChat && currentChat.id === chatId) {
      // 确保 currentChat 与当前 chatId 一致
      const chatMessages = (currentChat.messages || []).map(msg => ({
        id: msg.id,
        content: msg.content,
        type: msg.isAssistant ? 'ai' : 'user',
        timestamp: msg.timestamp,
        stage: (msg as any).stage,
        subType: (msg as any).subType,
        step: (msg as any).step,
      }));

      // 左侧"思考执行过程"：展示用户消息 + 执行过程中的AI消息（非最终结果）
      const thinkingMsgs = chatMessages.filter(m => 
        m.type === 'user' || 
        (m.type === 'ai' && m.stage && m.stage !== 'complete' && m.stage !== 'summary')
      );
      setThinkingMessages(thinkingMsgs);
      
      // 右侧"最终执行结果"：仅展示最终结果阶段的AI消息
      const resultMsgs = chatMessages.filter(m => 
        m.type === 'ai' && m.stage && (m.stage === 'complete' || m.stage === 'summary')
      );
      setMessages(resultMsgs);
    } else if (!currentChat) {
      // 当前没有有效会话时清空
      setMessages([]);
      setThinkingMessages([]);
    } else if (currentChat && currentChat.id !== chatId) {
      // 存在 currentChat 但与路由 chatId 不一致时，清空以避免短暂显示上一个会话内容
      setMessages([]);
      setThinkingMessages([]);
    }
  }, [currentChat, chatId]);

  // 消息更新后自动滚动到底部，保证总是看到最新消息
  useEffect(() => {
    const el = thinkingMessagesRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [thinkingMessages, loading]);

  useEffect(() => {
    const el = resultMessagesRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, loading]);
  
  useEffect(() => {
    const fetchAIAgents = async () => {
      try {
        const agents = await getAIAgents();
        setAiAgents(agents);
      } catch (error) {
        console.error('Failed to fetch AI agents:', error);
        message.error('获取AI智能体列表失败');
      }
    };
    
    fetchAIAgents();
  }, []);

  const addAiMessage = (stage: string, subType: string, content: string, step: number, targetChatId?: string) => {
    const aiMessage: Message = {
      id: 'ai-' + Date.now(),
      content,
      type: 'ai',
      timestamp: Date.now(),
      stage,
      subType,
      step
    };

    if (stage === 'complete' || stage === 'summary') {
      setMessages(prev => [...prev, aiMessage]);
      // 将消息添加到 store，包含阶段信息，且显式指定 chatId
      addMessage({
        content: aiMessage.content,
        isAssistant: true,
        stage,
        subType,
        step,
        chatId: targetChatId || currentChat?.id || useStore.getState().currentChatId || undefined,
      } as any);
    } else {
      setThinkingMessages(prev => [...prev, aiMessage]);
      // 将思考过程消息也持久化到 store，显式指定 chatId
      addMessage({
        content: aiMessage.content,
        isAssistant: true,
        stage,
        subType,
        step,
        chatId: targetChatId || currentChat?.id || useStore.getState().currentChatId || undefined,
      } as any);
    }
  };

  const sendMessage = () => {
    if (!input.trim() || loading) return;
   // 开启新流前，优先取消旧流
   if (streamCancelRef.current) {
     streamCancelRef.current.cancel();
     streamCancelRef.current = null;
   }
    
    // 清理可能残留的超时定时器
    if (streamTimeoutRef.current) {
      clearTimeout(streamTimeoutRef.current);
      streamTimeoutRef.current = null;
    }

    // 计算目标 chatId，如无则创建
    let targetChatId = currentChat?.id || chatId || undefined;

    // 如果没有当前聊天，创建一个新的
    if (!currentChat) {
      const newChatId = createChat();
      targetChatId = newChatId;
      if (newChatId) {
        navigate(`/autoagent/${newChatId}`);
      } else {
        message.error('创建新对话失败');
        return;
      }
    }
    
    const userMessage: Message = {
      id: 'user-' + Date.now(),
      content: input.trim(),
      type: 'user',
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setThinkingMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    // 发送后保持焦点在输入框，防止“输入框不见了”的错觉
    setTimeout(() => inputRef.current?.focus?.(), 0);
    
    // 将用户消息添加到 store（显式指定 chatId）
    addMessage({
      content: userMessage.content,
      isAssistant: false,
      chatId: targetChatId,
    });
    
    // 封装统一的超时设置函数（每次收到消息重置）
    const setupStreamTimeout = () => {
      if (streamTimeoutRef.current) clearTimeout(streamTimeoutRef.current);
      streamTimeoutRef.current = window.setTimeout(() => {
        // 触发超时：取消流，提示错误，并结束会话
        if (streamCancelRef.current) {
          streamCancelRef.current.cancel();
          streamCancelRef.current = null;
        }
        addAiMessage('error', 'network_timeout', '网络错误：请求超时，请稍后重试', 1, targetChatId);
        setLoading(false);
        message.error('网络连接超时');
      }, STREAM_TIMEOUT_MS);
    };
    
    streamCancelRef.current = createChatStream({
      message: userMessage.content,
      aiAgentId: aiAgentId,
      sessionId: sessionId,
      maxStep: maxStep,
      onMessage: (content) => {
        // 每次收到内容都重置超时计时器
        setupStreamTimeout();
        try {
          const data = JSON.parse(content);
          if (data.type && (data.type === 'execution' || data.type === 'analysis' || 
              data.type === 'supervision' || data.type === 'summary' || 
              data.type === 'error' || data.type === 'complete')) {
            addAiMessage(data.type, data.subType || 'execution_process', data.content, data.step || 1, targetChatId);
          } else if (data.stage && data.subType) {
            addAiMessage(data.stage, data.subType, data.content, data.step || 1, targetChatId);
          } else if (data.completed !== undefined) {
            setLoading(false);
          }
        } catch (error) {
          console.error('Failed to parse message:', error);
        }
      },
      onError: (error) => {
        // 出错时清理超时定时器
        if (streamTimeoutRef.current) {
          clearTimeout(streamTimeoutRef.current);
          streamTimeoutRef.current = null;
        }
        console.error('Stream error:', error);
        // 在对话中提示网络错误
        addAiMessage('error', 'network_error', '网络错误：连接失败或中断，请稍后重试', 1, targetChatId);
        message.error('发生错误，请重试');
        setLoading(false);
      },
      onComplete: () => {
        // 完成时清理超时定时器
        if (streamTimeoutRef.current) {
          clearTimeout(streamTimeoutRef.current);
          streamTimeoutRef.current = null;
        }
        setLoading(false);
      }
    });
    
    // 启动初始超时计时器（等待首个数据片段）
    setupStreamTimeout();
  };

  const handleNewChat = () => {
    setMessages([]);
    setThinkingMessages([]);
    setSessionId('session-' + Math.random().toString(36).substring(2, 10));
    const newChatId = createChat();
    if (newChatId) {
      // 添加一个初始消息作为标题
      addMessage({
        content: '开始一段新的对话吧',
        isAssistant: false,
        chatId:newChatId
      });
      // 导航到新对话页面
      navigate(`/autoagent/${newChatId}`);
      message.success('已创建新对话');
    }
  };
  
  const handleClearAllChats = () => {
    clearAllChats();
    setMessages([]);
    setThinkingMessages([]);
    navigate('/autoagent');
    message.success('已清空所有对话');
  };

  const handleDeleteChat = () => {
    if (chatId) {
      deleteChat(chatId);
      navigate('/autoagent');
      message.success('已删除当前对话');
    }
  };

  const handlePromptCaseChange = (value: string) => {
    setPromptCase(value);
    setInput(value);
  };

  return (
    <div className="auto-agent-page">
      {/* 顶部标题栏 */}
      <header className="header">
        <div className="logo-title">
          <span className="logo-text">上善若水</span>
          <div className="status-indicator"></div>
          <span className="sub-title">智能对话助手 - 实时流式交互体验</span>
        </div>
        <div className="header-actions">
            <Select
            value={aiAgentId}
            onChange={setAiAgentId}
            className="toolbar-item agent-select"
            suffixIcon={<DownOutlined />}
          >
            {aiAgents.map((agent) => (
              <Option key={agent.id} value={agent.id}>
                {agent.agentName}
              </Option>
            ))}
            </Select>
          <div className="toolbar-item max-steps">
            <span>最大执行步数</span>
            <InputNumber min={1} max={10} value={maxStep} onChange={(v) => setMaxStep(v || 1)} />
          </div>
          <Select
            placeholder="请选择提问案例"
            value={promptCase}
            onChange={handlePromptCaseChange}
            className="toolbar-item prompt-case-select"
            suffixIcon={<DownOutlined />}
          >
            <Option value="查看今天北京的天气">查看今天北京的天气</Option>
            <Option value="帮我写一个快速排序算法">帮我写一个快速排序算法</Option>
          </Select>
          <Button
            icon={<PlusOutlined />}
            onClick={handleNewChat}
          >
            新建对话
          </Button>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="main-content">
        {/* 左侧：AI思考过程 */}
        <div className="content-column">
          <div className="column-header">
            <RobotOutlined />
            <span>AI思考执行过程</span>
          </div>
          <div ref={thinkingMessagesRef} className="message-list custom-scrollbar">
            {thinkingMessages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={{
                  id: msg.id,
                  content: msg.content,
                  isAssistant: msg.type === 'ai',
                  timestamp: msg.timestamp,
                  stage: msg.stage,
                  subType: msg.subType,
                  step: msg.step
                }}
              />
            ))}
            {thinkingMessages.length === 0 && !loading && (
              <div className="empty-state">
                <RobotOutlined />
                <p>AI将在这里展示思考过程</p>
              </div>
            )}
          </div>
        </div>

        {/* 右侧：最终结果 */}
        <div className="content-column">
          <div className="column-header">
            <UserOutlined />
            <span>最终执行结果</span>
          </div>
          <div ref={resultMessagesRef} className="message-list custom-scrollbar">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={{
                  id: msg.id,
                  content: msg.content,
                  isAssistant: msg.type === 'ai',
                  timestamp: msg.timestamp,
                  stage: msg.stage,
                  subType: msg.subType,
                  step: msg.step
                }}
              />
            ))}
            {messages.length === 0 && !loading && (
              <div className="empty-state">
                <RobotOutlined />
                <p>AI将在这里展示最终结果</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* 底部控制区域 */}
      <footer className="footer">
        <div className="input-toolbar">
 
          {/* </Select> */}
        </div>
        <div className="input-area">
          <TextArea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="请输入您的问题..."
            rows={1}
            className="input-box"
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={sendMessage}
            loading={loading}
            className="send-button"
          >
            发送
          </Button>
        </div>
        {loading && (
          <div className="loading-indicator">
            <Spin size="small" />
            <span>AI正在思考中...</span>
          </div>
        )}
        <div className="session-id">
          会话ID: {sessionId}
        </div>
      </footer>
    </div>
  );
};

export default AutoAgentPage;