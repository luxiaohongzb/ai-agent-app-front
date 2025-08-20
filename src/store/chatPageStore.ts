import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ChatPage 专用消息结构
export interface ChatPageMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
}

// ChatPage 专用状态管理
interface ChatPageState {
  // 消息相关状态
  messages: ChatPageMessage[];
  selectedRagId: string | undefined;
  
  // Actions
  addMessage: (message: Omit<ChatPageMessage, 'id' | 'timestamp'>) => void;
  updateMessage: (messageId: string, content: string) => void;
  clearMessages: () => void;
  setSelectedRagId: (ragId: string | undefined) => void;
}

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

export const useChatPageStore = create<ChatPageState>()(
  persist(
    (set, get) => ({
      // 初始状态
      messages: [],
      selectedRagId: undefined,
      
      // 添加消息
      addMessage: (message) => {
        const newMessage: ChatPageMessage = {
          ...message,
          id: generateId(),
          timestamp: Date.now(),
        };
        
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      },
      
      // 更新消息内容（用于流式更新）
      updateMessage: (messageId: string, content: string) => {
        set((state) => ({
          messages: state.messages.map(msg => 
            msg.id === messageId ? { ...msg, content } : msg
          ),
        }));
      },
      
      // 清空所有消息
      clearMessages: () => {
        set({ messages: [] });
      },
      
      // 设置选中的 RAG ID
      setSelectedRagId: (ragId) => {
        set({ selectedRagId: ragId });
      },
    }),
    {
      name: 'chatpage-storage', // localStorage key
      partialize: (state) => ({
        messages: state.messages,
        selectedRagId: state.selectedRagId,
      }),
    }
  )
);