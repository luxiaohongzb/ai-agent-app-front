import React from 'react';
import { Button, Card, Empty } from 'antd';
import { PlusOutlined, RobotOutlined } from '@ant-design/icons';
import { useStore, useThemeStore } from '../../store';
import MessageBubble from './MessageBubble';

const ChatArea: React.FC = () => {
  const currentChat = useStore((state) => state.currentChat);
  const createChat = useStore((state) => state.createChat);
  const theme = useThemeStore((state) => state.theme);

  // 欢迎页面
  const WelcomeMessage = () => (
    <div className="flex items-center justify-center h-full">
      <Card className={`text-center max-w-md transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
        theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white'
      }`}>
        <div className={`flex items-center gap-3 justify-center mb-6 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
          <span className="font-medium">AI Agent 正在运行</span>
          <span className="text-xl">🐏</span>
        </div>
        
        <h3 className={`text-xl font-semibold mb-3 ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          欢迎使用 AI 智能体
        </h3>
        
        <p className={`mb-4 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          选择一个知识库或开始一个新的对话
        </p>
        
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={createChat}
          className="flex items-center gap-2 mx-auto"
        >
          开始新对话
        </Button>
      </Card>
    </div>
  );

  // 空聊天状态
  const EmptyChat = () => (
    <div className="flex items-center justify-center h-full">
      <Empty
        image={<RobotOutlined className={`text-6xl ${
          theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
        }`} />}
        description={
          <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
            <div className="mb-2">开始与 AI 助手对话</div>
            <div className="text-sm">在下方输入框中输入您的问题</div>
          </div>
        }
      />
    </div>
  );

  // 如果没有当前聊天，显示欢迎页面
  if (!currentChat) {
    return <WelcomeMessage />;
  }

  // 如果聊天没有消息，显示空状态
  if (currentChat.messages.length === 0) {
    return <EmptyChat />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {currentChat.messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatArea;