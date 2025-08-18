import React from 'react';
import { Avatar } from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';
import { ChatMessage } from '../../types';
import { useThemeStore } from '../../store';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow, vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm'; // 引入 GFM 插件
import rehypeRaw from 'rehype-raw'; // 引入 rehype-raw 插件
import './MessageBubble.css';

// 阶段类型映射
const stageTypeMap = {
  'analysis': { name: '分析阶段', icon: '🎯', class: 'stage-analysis' },
  'execution': { name: '执行阶段', icon: '⚡', class: 'stage-execution' },
  'supervision': { name: '监督阶段', icon: '🔍', class: 'stage-supervision' },
  'summary': { name: '总结阶段', icon: '📊', class: 'stage-summary' },
  'error': { name: '错误信息', icon: '❌', class: 'stage-error' },
  'complete': { name: '完成', icon: '✅', class: 'stage-summary' },
  'planning': { name: '规划阶段', icon: '📝', class: 'stage-planning' },
  'verification': { name: '验证阶段', icon: '✓', class: 'stage-verification' },
  'completion': { name: '完成阶段', icon: '🏁', class: 'stage-completion' }
};

// 子类型映射
const subTypeMap = {
  'analysis_status': '任务状态',
  'analysis_history': '历史评估',
  'analysis_strategy': '执行策略',
  'analysis_progress': '完成度',
  'analysis_task_status': '任务状态',
  'execution_target': '执行目标',
  'execution_process': '执行过程',
  'execution_result': '执行结果',
  'execution_quality': '质量检查',
  'assessment': '质量评估',
  'issues': '问题识别',
  'suggestions': '改进建议',
  'score': '质量评分',
  'pass': '检查结果',
  'completed_work': '已完成工作',
  'incomplete_reasons': '未完成原因',
  'evaluation': '效果评估',
  'summary_overview': '总结概览'
};

interface MessageBubbleProps {
  message: ChatMessage & {
    stage?: string;
    subType?: string;
    step?: number;
  };
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { content, isAssistant, timestamp, stage, subType, step } = message;
  const theme = useThemeStore((state) => state.theme);

  // 格式化时间
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Markdown组件配置
  const markdownComponents = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={theme === 'dark' ? vscDarkPlus : tomorrow}
          language={match[1]}
          PreTag="div"
          className="rounded-md"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={`px-1 py-0.5 rounded text-sm ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`} {...props}>
          {children}
        </code>
      );
    },
    pre({ children }: any) {
      return <div className="overflow-x-auto">{children}</div>;
    },
  };

  return (
    <div className={`message-bubble ${isAssistant ? 'assistant' : 'user'}`}>
      <Avatar
        icon={isAssistant ? <RobotOutlined /> : <UserOutlined />}
        className="message-avatar"
      />
      <div className="message-content-wrapper">
        <div className="message-header">
          {isAssistant && <span className="assistant-name">AI助手:</span>}
          {isAssistant && stage && (
            <span className={`indicator stage-indicator ${stageTypeMap[stage]?.class || ''}`}>
              {stageTypeMap[stage]?.icon} {stageTypeMap[stage]?.name}
            </span>
          )}
          {isAssistant && subType && subTypeMap[subType] && (
            <span className="indicator sub-type-indicator">
              {subTypeMap[subType]}
            </span>
          )}
          {isAssistant && step && (
            <span className="indicator step-indicator">
              第{step}步
            </span>
          )}
        </div>
        <div className="message-content">
          <ReactMarkdown
            components={markdownComponents}
            remarkPlugins={[remarkGfm]} // 启用 GFM 插件
            rehypePlugins={[rehypeRaw]} // 启用 rehype-raw 插件
          >
            {content}
          </ReactMarkdown>
        </div>
        <div className="message-timestamp">
          {formatTime(timestamp)}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;