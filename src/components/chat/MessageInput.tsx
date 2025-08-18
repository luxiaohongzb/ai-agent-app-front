import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button, Input, Select, message, InputNumber } from 'antd';
import {
  SendOutlined,
  LoadingOutlined,
  PlusOutlined,
  AudioOutlined,
  ControlOutlined,
} from '@ant-design/icons';
import { useStore } from '../../store';
import { PromptTemplate } from '../../types';
import { createChatStream } from '../../services/chatService';

const { Option } = Select;

interface MessageInputProps {
  promptTemplates: PromptTemplate[];
}

const MessageInput: React.FC<MessageInputProps> = ({ promptTemplates }) => {
  const currentChat = useStore((state) => state.currentChat);
  const currentChatId = useStore((state) => state.currentChatId);
  const createChat = useStore((state) => state.createChat);
  const addMessage = useStore((state) => state.addMessage);
  const updateMessage = useStore((state) => state.updateMessage);
  const selectedAgentId = useStore((state) => state.selectedAgentId);
  const selectedKnowledgeBaseId = useStore((state) => state.selectedKnowledgeBaseId);
  const loading = useStore((state) => state.loading);
  const setLoading = useStore((state) => state.setLoading);
  const [inputValue, setInputValue] = useState('');
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  const [maxStep, setMaxStep] = useState<number>(3);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  // 使用取消句柄替代 EventSource
  const currentAssistantMessageId = useRef<string | null>(null);
  const streamCancelRef = useRef<{ cancel: () => void } | null>(null);

  // 发送消息
  useEffect(() => {
    setCurrentSessionId(uuidv4());
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || loading) return;

    let chatId = currentChatId;
    
    // 如果没有当前聊天，创建新聊天
    if (!chatId) {
      chatId = createChat();
    }

    const userMessage = {
      content: inputValue.trim(),
      isAssistant: false,
      chatId,
    };

    // 添加用户消息
    addMessage(userMessage);

    // 清空输入框
    const messageContent = inputValue.trim();
    setInputValue('');
    setLoading(true);

    // 创建助手消息占位符
    const assistantMessage = {
      content: '',
      isAssistant: true,
      chatId,
    };
    addMessage(assistantMessage);

    // 立即获取刚创建的助手消息ID（Zustand 的 set 是同步的，getState 会返回最新值）
    const stateAfterAdd = useStore.getState();
    const messagesAfterAdd = stateAfterAdd.currentChat?.messages || [];
    const lastMessage = messagesAfterAdd[messagesAfterAdd.length - 1];
    if (lastMessage && lastMessage.isAssistant) {
      currentAssistantMessageId.current = lastMessage.id;
    }

    try {
      // 创建SSE连接
      const streamHandle = createChatStream({
        message: messageContent,
        aiAgentId: selectedAgentId || "3",
        sessionId: currentSessionId || "1",
        maxStep,
        onMessage: (data: string) => {
          // 更新助手消息内容，读取最新store状态，避免闭包导致的过期数据
          if (currentAssistantMessageId.current) {
            const st = useStore.getState();
            const currentMsg = st.currentChat?.messages.find(m => m.id === currentAssistantMessageId.current);
            const currentContent = currentMsg?.content || '';
            updateMessage(currentAssistantMessageId.current, currentContent + data);
          }
        },
        onError: (error) => {
          console.error('Chat stream error:', error);
          message.error('发送消息失败，请重试');
          setLoading(false);
        },
        onComplete: () => {
          setLoading(false);
          currentAssistantMessageId.current = null;
        },
      });

      streamCancelRef.current = streamHandle;
      
    } catch (error) {
      console.error('Failed to send message:', error);
      message.error('发送消息失败，请重试');
      setLoading(false);
    }
  };

  // 停止当前请求
  const handleStopGeneration = () => {
    if (streamCancelRef.current) {
      streamCancelRef.current.cancel();
      streamCancelRef.current = null;
    }
     setLoading(false);
     currentAssistantMessageId.current = null;
  };

  // 处理键盘事件
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 应用提示词模板
  const handlePromptSelect = (promptId: string) => {
    const template = promptTemplates.find(p => p.id === promptId);
    if (template) {
      setInputValue(template.content);
      setSelectedPromptId(promptId);
    }
  };

  const inputComponent = (
    <div className="w-full max-w-3xl relative mx-auto">
      <Input
        size="large"
        placeholder="询问任何问题"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        prefix={<PlusOutlined className="text-gray-400" />}
        suffix={
          <div className="flex items-center gap-2">
            <Button type="text" shape="circle" icon={<AudioOutlined />} />
            <Button 
              type="text" 
              shape="circle" 
              icon={loading ? <LoadingOutlined /> : <SendOutlined />}
              onClick={loading ? handleStopGeneration : handleSendMessage}
              disabled={!inputValue.trim() && !loading}
              className={`${!inputValue.trim() && !loading ? 'text-gray-300' : 'text-blue-500 hover:text-blue-600'}`}
            />
          </div>
        }
        className="rounded-lg shadow-sm"
        disabled={loading}
      />
    </div>
  );

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        {inputComponent}
        <div className="mt-3 flex gap-3">
          {promptTemplates.length > 0 && (
            <Select
              placeholder="选择提示模板"
              value={selectedPromptId}
              onChange={handlePromptSelect}
              className="flex-1"
              allowClear
              size="small"
            >
              {promptTemplates.map((template) => (
                <Option key={template.id} value={template.id}>
                  {template.name}
                </Option>
              ))}
            </Select>
          )}
          {/* <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">最大步数：</span>
            <InputNumber
              size="small"
              min={1}
              max={1000}
              value={maxStep}
              onChange={(value) => setMaxStep(value || 100)}
              className="w-20"
            />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default MessageInput;