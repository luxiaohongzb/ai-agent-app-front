import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Chat, ChatMessage, AIAgent, KnowledgeBase } from '../types';

interface ChatState {
  // 聊天相关状态
  chats: Chat[];
  currentChatId: string | null;
  currentChat: Chat | null;
  
  // AI Agent和知识库
  aiAgents: AIAgent[];
  knowledgeBases: KnowledgeBase[];
  selectedAgentId: string | null;
  selectedKnowledgeBaseId: string | null;
  
  // UI状态
  sidebarOpen: boolean;
  loading: boolean;
  
  // Actions
  createChat: () => string;
  deleteChat: (chatId: string) => void;
  loadChat: (chatId: string) => void;
  renameChat: (chatId: string, newTitle: string) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  updateMessage: (messageId: string, content: string) => void;
  clearAllChats: () => void;
  
  // AI Agent和知识库操作
  setAIAgents: (agents: AIAgent[]) => void;
  setKnowledgeBases: (bases: KnowledgeBase[]) => void;
  selectAgent: (agentId: string | null) => void;
  selectKnowledgeBase: (baseId: string | null) => void;
  
  // UI操作
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
}

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

export const useStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // 初始状态
      chats: [],
      currentChatId: null,
      currentChat: null,
      aiAgents: [],
      knowledgeBases: [],
      selectedAgentId: null,
      selectedKnowledgeBaseId: null,
      sidebarOpen: true,
      loading: false,
      
      // 聊天操作
      createChat: () => {
        const chatId = generateId();
        const newChat: Chat = {
          id: chatId,
          title: '新对话',
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        
        set((state) => ({
          chats: [newChat, ...state.chats],
          currentChatId: chatId,
          currentChat: newChat,
        }));
        
        return chatId;
      },
      
      deleteChat: (chatId: string) => {
        set((state) => {
          const newChats = state.chats.filter(chat => chat.id !== chatId);
          const isCurrentChat = state.currentChatId === chatId;
          
          return {
            chats: newChats,
            currentChatId: isCurrentChat ? (newChats[0]?.id || null) : state.currentChatId,
            currentChat: isCurrentChat ? (newChats[0] || null) : state.currentChat,
          };
        });
      },
      
      loadChat: (chatId: string) => {
        const chat = get().chats.find(c => c.id === chatId);
        if (chat) {
          set({
            currentChatId: chatId,
            currentChat: chat,
          });
        }
      },

      renameChat: (chatId: string, newTitle: string) => {
        set((state) => {
          const updatedChats = state.chats.map(chat => 
            chat.id === chatId ? { ...chat, title: newTitle } : chat
          );
          
          const updatedCurrentChat = 
            state.currentChatId === chatId && state.currentChat 
              ? { ...state.currentChat, title: newTitle } 
              : state.currentChat;
          
          return {
            chats: updatedChats,
            currentChat: updatedCurrentChat,
          };
        });
      },
      
      addMessage: (message) => {
        const state = get();
        const { currentChatId } = state;
        // 仅当显式传入 chatId 或当前已有激活会话时才允许写入
        const targetChatId = (message as any).chatId || currentChatId;
        if (!targetChatId) return; // 无法确定目标会话，直接忽略

        // 在现有会话列表中查找目标会话
        const targetChat = state.chats.find(c => c.id === targetChatId);
        if (!targetChat) return; // 目标会话不存在则忽略
        
        const newMessage: ChatMessage = {
          ...message,
          id: generateId(),
          timestamp: Date.now(),
          chatId: targetChatId,
        } as ChatMessage;

        const updatedChat: Chat = {
          ...targetChat,
          messages: [...(targetChat.messages || []), newMessage],
          updatedAt: Date.now(),
          title: (targetChat.messages?.length || 0) === 0 && !message.isAssistant
            ? message.content.slice(0, 20) + (message.content.length > 20 ? '...' : '')
            : targetChat.title,
        };

        // 仅更新对应会话；不要自动切换 currentChatId，以避免 UI 串台
        set((s) => ({
          chats: s.chats.map(chat => chat.id === targetChatId ? updatedChat : chat),
          currentChat: s.currentChatId === targetChatId ? updatedChat : s.currentChat,
        }));
      },
      
      updateMessage: (messageId: string, content: string) => {
        const { currentChatId, currentChat } = get();
        if (!currentChatId || !currentChat) return;
        
        set((state) => {
          const updatedChat = {
            ...currentChat,
            messages: currentChat.messages.map(msg => 
              msg.id === messageId ? { ...msg, content } : msg
            ),
            updatedAt: Date.now(),
          };
          
          return {
            chats: state.chats.map(chat => 
              chat.id === currentChatId ? updatedChat : chat
            ),
            currentChat: updatedChat,
          };
        });
      },
      
      clearAllChats: () => {
        set({
          chats: [],
          currentChatId: null,
          currentChat: null,
        });
      },
      
      // AI Agent和知识库操作
      setAIAgents: (agents) => set({ aiAgents: agents }),
      setKnowledgeBases: (bases) => set({ knowledgeBases: bases }),
      selectAgent: (agentId) => set({ selectedAgentId: agentId }),
      selectKnowledgeBase: (baseId) => set({ selectedKnowledgeBaseId: baseId }),
      
      // UI操作
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        chats: state.chats,
        currentChatId: state.currentChatId,
        selectedAgentId: state.selectedAgentId,
        selectedKnowledgeBaseId: state.selectedKnowledgeBaseId,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);

// 重新导出themeStore和authStore
export { useThemeStore } from './themeStore';
export { useAuthStore } from './authStore';