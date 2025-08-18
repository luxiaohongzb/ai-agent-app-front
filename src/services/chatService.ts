import apiClient from './api';
import { AIAgent, KnowledgeBase, PromptTemplate } from '../types';

// 获取AI Agent列表
export const getAIAgents = async (): Promise<AIAgent[]> => {
  try {
    const response = await apiClient.post('/ai/admin/agent/queryAllValidAgentOrder');
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch AI agents:', error);
    return [];
  }
};

// 获取知识库列表
export const getKnowledgeBases = async (): Promise<KnowledgeBase[]> => {
  try {
    const response = await apiClient.post('/ai/admin/rag/queryAllValidRagOrder');
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch knowledge bases:', error);
    return [];
  }
};

// 获取提示词模板列表
export const getPromptTemplates = async (): Promise<PromptTemplate[]> => {
  try {
    const response = await apiClient.post('/ai/admin/prompt/queryAllValidPromptOrder');
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch prompt templates:', error);
    return [];
  }
};

// 发送聊天消息
export const sendChatMessage = async (params: {
  message: string;
  agentId?: string;
  ragId?: string;
  promptId?: string;
}) => {
  const { message, agentId, ragId, promptId } = params;
  
  const requestData: any = {
    message,
  };
  
  if (agentId) requestData.agentId = agentId;
  if (ragId) requestData.ragId = ragId;
  if (promptId) requestData.promptId = promptId;
  
  return apiClient.post('/ai/chat/completions', requestData);
};

// 创建SSE连接用于实时聊天（立即返回取消句柄）
export const createChatStream = (params: {
  message: string;
  aiAgentId?: string;
  sessionId?: string;
  maxStep: number;
  onMessage: (data: string) => void;
  onError: (error: Error) => void;
  onComplete: () => void;
}): { cancel: () => void } => {
  const { message, aiAgentId, sessionId, maxStep, onMessage, onError, onComplete } = params;

  const requestBody = {
    message,
    aiAgentId,
    sessionId,
    maxStep,
  };

  const controller = new AbortController();
  const { signal } = controller;

  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'text/event-stream',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // 启动流式请求但不阻塞返回
  fetch(`${apiClient.defaults.baseURL}/agent/auto_agent`, {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody),
    signal,
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader!.read();
        if (done) {
          onComplete();
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter((line) => line.trim() !== '');

        for (const line of lines) {
          try {
            if (line.startsWith('data: ')) {
              const jsonData = JSON.parse(line.slice(6));
              // 处理 OpenAI 格式的响应
              if (
                jsonData.choices &&
                jsonData.choices[0] &&
                jsonData.choices[0].delta
              ) {
                const content = jsonData.choices[0].delta.content;
                if (content) {
                  onMessage(content);
                }
              }
              // 处理包含 completed 字段的 JSON 格式
              else if (jsonData.completed !== undefined && jsonData.content) {
                onMessage(JSON.stringify(jsonData));
              }
              // 处理其他 JSON 格式
              else if (jsonData.content) {
                onMessage(JSON.stringify(jsonData));
              }
            }
          } catch (error) {
            if ((error as any).name === 'AbortError' || controller.signal.aborted) {
              // 被取消了，静默处理
              return;
            }
            console.error('Error parsing SSE data:', error);
          }
        }
      }
    })
    .catch((error) => {
      if (error?.name === 'AbortError' || controller.signal.aborted) {
        // 请求被取消
        return;
      }
      console.error('Stream error:', error);
      onError(error instanceof Error ? error : new Error('Connection error'));
    });

  return {
    cancel: () => controller.abort(),
  };
};