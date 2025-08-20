export interface AIAgent {
  id: string;
  name: string;
  description?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface KnowledgeBase {
  id: string;
  name: string;
  description?: string;
  status?: 'active' | 'inactive';
  fileCount?: number;
  isActive?: boolean;
  createdAt?: string | number;
  updatedAt?: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  content: string;
  category?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  role: 'admin' | 'user';
  isActive?: boolean;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  isAssistant: boolean;
  timestamp: number;
  chatId: string;
  // 可选：用于展示执行阶段、子类型和步骤等历史信息
  stage?: string;
  subType?: string;
  step?: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface UploadFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'success' | 'error';
  progress?: number;
  url?: string;
}

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  success: boolean;
}

export interface SystemConfig {
  siteName: string;
  siteDescription: string;
  maxFileSize: number;
  allowedFileTypes: string[];
  enableRegistration: boolean;
}

export interface GitRepository {
  id: string;
  url: string;
  name: string;
  branch?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress?: number;
  createdAt: number;
}
