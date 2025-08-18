import apiClient from './api';

// 通用分页参数接口
interface PaginationParams {
  pageNum: number;
  pageSize: number;
}

// 智能体相关接口
export interface AgentParams {
  agentId: string;
  agentName: string;
  description?: string;
  channel: string;
  status: number;
  id?: number;
}

export interface AgentQueryParams extends PaginationParams {
  agentName?: string;
}

// 任务调度相关接口
export interface TaskScheduleParams {
  taskName: string;
  agentId: number;
  description?: string;
  taskParam?: string;
  cronExpression?: string;
  status: number;
  id?: number;
}

export interface TaskScheduleQueryParams extends PaginationParams {
  taskName?: string;
}

// 客户端模型相关接口
export interface ClientModelParams {
  modelId: string;
  apiId?: string;
  modelName: string;
  modelType: string;
  status: number;
  id?: number;
}

export interface ClientModelQueryParams extends PaginationParams {
  modelName?: string;
}

// 智能体客户端关联相关接口
export interface AgentClientParams {
  agentId: number;
  clientId: number;
  status: number;
  id?: number;
}

export interface AgentClientQueryParams extends PaginationParams {
  agentId?: number;
  clientId?: number;
}

// RAG订单相关接口
export interface RagOrderParams {
  orderId: string;
  description?: string;
  status: number;
  id?: number;
}

export interface RagOrderQueryParams extends PaginationParams {
  orderId?: string;
}

// 客户端顾问相关接口
export interface ClientAdvisorParams {
  advisorId: string;
  advisorName: string;
  advisorType: string;
  orderNum: number;
  extParam?: string;
  status: number;
  id?: number;
}

export interface ClientAdvisorQueryParams extends PaginationParams {
  advisorName?: string;
}

// 客户端顾问配置相关接口
export interface ClientAdvisorConfigParams {
  clientId: number;
  advisorId: number;
  id?: number;
}

export interface ClientAdvisorConfigQueryParams extends PaginationParams {
  configName?: string;
}

// 工具配置相关接口
export interface ToolConfigParams {
  clientId: number;
  toolType: string;
  toolId: number;
  id?: number;
}

export interface ToolConfigQueryParams extends PaginationParams {
  toolName?: string;
}

// 系统提示词相关接口
export interface SystemPromptParams {
  promptName: string;
  promptContent: string;
  status: number;
  id?: number;
}

export interface SystemPromptQueryParams extends PaginationParams {
  promptName?: string;
}

// ==================== 智能体管理 API ====================

// 查询智能体列表
export const queryAiAgentList = async (params: AgentQueryParams) => {
  return await apiClient.post('/ai/admin/agent/queryAiAgentList', params);
};

// 添加智能体
export const addAiAgent = async (params: AgentParams) => {
  return await apiClient.post('/ai/admin/agent/addAiAgent', params);
};

// 更新智能体
export const updateAiAgent = async (params: AgentParams) => {
  return await apiClient.post('/ai/admin/agent/updateAiAgent', params);
};

// 删除智能体
export const deleteAiAgent = async (id: number) => {
  return await apiClient.post('/ai/admin/agent/deleteAiAgent', { id });
};

// 根据ID查询智能体
export const queryAiAgentById = async (id: number) => {
  return await apiClient.post('/ai/admin/agent/queryAiAgentById', { id });
};

// 预热智能体
export const preheatAgent = async (id: number) => {
  return await apiClient.post('/ai/admin/agent/preheatAgent', { id });
};

// ==================== 任务调度管理 API ====================

// 查询任务调度列表
export const queryTaskScheduleList = async (params: TaskScheduleQueryParams) => {
  return await apiClient.post('/ai/admin/agent/task/queryTaskScheduleList', params);
};

// 添加任务调度
export const addTaskSchedule = async (params: TaskScheduleParams) => {
  return await apiClient.post('/ai/admin/agent/task/addTaskSchedule', params);
};

// 更新任务调度
export const updateTaskSchedule = async (params: TaskScheduleParams) => {
  return await apiClient.post('/ai/admin/agent/task/updateTaskSchedule', params);
};

// 删除任务调度
export const deleteTaskSchedule = async (id: number) => {
  return await apiClient.post('/ai/admin/agent/task/deleteTaskSchedule', { id });
};

// 根据ID查询任务调度
export const queryTaskScheduleById = async (id: number) => {
  return await apiClient.post('/ai/admin/agent/task/queryTaskScheduleById', { id });
};

// ==================== 客户端模型管理 API ====================

// 查询客户端模型列表
export const queryClientModelList = async (params: ClientModelQueryParams) => {
  return await apiClient.post('/ai/admin/client/model/queryClientModelList', params);
};

// 添加客户端模型
export const addClientModel = async (params: ClientModelParams) => {
  return await apiClient.post('/ai/admin/client/model/addClientModel', params);
};

// 更新客户端模型
export const updateClientModel = async (params: ClientModelParams) => {
  return await apiClient.post('/ai/admin/client/model/updateClientModel', params);
};

// 删除客户端模型
export const deleteClientModel = async (id: number) => {
  return await apiClient.post('/ai/admin/client/model/deleteClientModel', { id });
};

// 根据ID查询客户端模型
export const queryClientModelById = async (id: number) => {
  return await apiClient.post('/ai/admin/client/model/queryClientModelById', { id });
};

// ==================== 智能体客户端关联管理 API ====================

// 查询智能体客户端关联列表
export const queryAgentClientList = async (params: AgentClientQueryParams) => {
  return await apiClient.post('/ai/admin/agent/client/queryAgentClientList', params);
};

// 查询所有智能体客户端关联
export const queryAllAgentClient = async () => {
  return await apiClient.post('/ai/admin/agent/client/queryAllAgentClient');
};

// 根据智能体ID查询关联
export const queryAgentClientByAgentId = async (agentId: number) => {
  return await apiClient.post('/ai/admin/agent/client/queryAgentClientByAgentId', { agentId });
};

// 根据客户端ID查询关联
export const queryAgentClientByClientId = async (clientId: number) => {
  return await apiClient.post('/ai/admin/agent/client/queryAgentClientByClientId', { clientId });
};

// 添加智能体客户端关联
export const addAgentClient = async (params: AgentClientParams) => {
  return await apiClient.post('/ai/admin/agent/client/addAgentClient', params);
};

// 更新智能体客户端关联
export const updateAgentClient = async (params: AgentClientParams) => {
  return await apiClient.post('/ai/admin/agent/client/updateAgentClient', params);
};

// 删除智能体客户端关联
export const deleteAgentClient = async (id: number) => {
  return await apiClient.post('/ai/admin/agent/client/deleteAgentClient', { id });
};

// 根据ID查询智能体客户端关联
export const queryAgentClientById = async (id: number) => {
  return await apiClient.post('/ai/admin/agent/client/queryAgentClientById', { id });
};

// ==================== RAG订单管理 API ====================

// 查询RAG订单列表
export const queryRagOrderList = async (params: RagOrderQueryParams) => {
  return await apiClient.post('/ai/admin/rag/order/queryRagOrderList', params);
};

// 添加RAG订单
export const addRagOrder = async (params: RagOrderParams) => {
  return await apiClient.post('/ai/admin/rag/order/addRagOrder', params);
};

// 更新RAG订单
export const updateRagOrder = async (params: RagOrderParams) => {
  return await apiClient.post('/ai/admin/rag/order/updateRagOrder', params);
};

// 删除RAG订单
export const deleteRagOrder = async (id: number) => {
  return await apiClient.post('/ai/admin/rag/order/deleteRagOrder', { id });
};

// 根据ID查询RAG订单
export const queryRagOrderById = async (id: number) => {
  return await apiClient.post('/ai/admin/rag/order/queryRagOrderById', { id });
};

// ==================== 客户端顾问管理 API ====================

// 查询客户端顾问列表
export const queryClientAdvisorList = async (params: ClientAdvisorQueryParams) => {
  return await apiClient.post('/ai/admin/client/advisor/queryClientAdvisorList', params);
};

// 添加客户端顾问
export const addClientAdvisor = async (params: ClientAdvisorParams) => {
  return await apiClient.post('/ai/admin/client/advisor/addClientAdvisor', params);
};

// 更新客户端顾问
export const updateClientAdvisor = async (params: ClientAdvisorParams) => {
  return await apiClient.post('/ai/admin/client/advisor/updateClientAdvisor', params);
};

// 删除客户端顾问
export const deleteClientAdvisor = async (id: number) => {
  return await apiClient.get('/ai/admin/client/advisor/deleteClientAdvisor', { params: { id } });
};

// 根据ID查询客户端顾问
export const queryClientAdvisorById = async (id: number) => {
  return await apiClient.get('/ai/admin/client/advisor/queryClientAdvisorById', { params: { id } });
};

// ==================== 工具配置管理 API ====================

// 查询工具配置列表
export const queryToolConfigList = async (params: ToolConfigQueryParams) => {
  return await apiClient.post('/ai/admin/client/tool/config/queryClientToolConfigList', params);
};

// 添加工具配置
export const addToolConfig = async (params: ToolConfigParams) => {
  return await apiClient.post('/ai/admin/client/tool/config/addClientToolConfig', params);
};

// 更新工具配置
export const updateToolConfig = async (params: ToolConfigParams) => {
  return await apiClient.post('/ai/admin/client/tool/config/updateClientToolConfig', params);
};

// 删除工具配置
export const deleteToolConfig = async (id: number) => {
  return await apiClient.get('/ai/admin/client/tool/config/deleteClientToolConfig', { params: { id } });
};

// 根据ID查询工具配置
export const queryToolConfigById = async (id: number) => {
  return await apiClient.get('/ai/admin/client/tool/config/queryClientToolConfigById', { params: { id } });
};

// ==================== 系统提示词管理 API ====================

// 查询系统提示词列表
export const querySystemPromptList = async (params: SystemPromptQueryParams) => {
  return await apiClient.post('/ai/admin/client/system/prompt/querySystemPromptList', params);
};

// 添加系统提示词
export const addSystemPrompt = async (params: SystemPromptParams) => {
  return await apiClient.post('/ai/admin/client/system/prompt/addSystemPrompt', params);
};

// 更新系统提示词
export const updateSystemPrompt = async (params: SystemPromptParams) => {
  return await apiClient.post('/ai/admin/client/system/prompt/updateSystemPrompt', params);
};

// 删除系统提示词
export const deleteSystemPrompt = async (id: number) => {
  return await apiClient.post('/ai/admin/client/system/prompt/deleteSystemPrompt', { id });
};

// 根据ID查询系统提示词
export const querySystemPromptById = async (id: number) => {
  return await apiClient.post('/ai/admin/client/system/prompt/querySystemPromptById', { id });
};

// MCP工具相关接口
export interface McpToolParams {
  id?: number;
  mcpId: string;
  mcpName: string;
  transportType: string;
  transportConfig: string;
  requestTimeout: number;
  status: number;
  createTime?: string;
  updateTime?: string;
}

export interface McpToolQueryParams extends PaginationParams {
  mcpName?: string;
}

// ==================== 客户端顾问配置管理 API ====================

// 查询客户端顾问配置列表
export const queryClientAdvisorConfigList = async (params: ClientAdvisorConfigQueryParams) => {
  return await apiClient.post('/ai/admin/client/advisor/config/queryClientAdvisorConfigList', params);
};

// 添加客户端顾问配置
export const addClientAdvisorConfig = async (params: ClientAdvisorConfigParams) => {
  return await apiClient.post('/ai/admin/client/advisor/config/addClientAdvisorConfig', params);
};

// 更新客户端顾问配置
export const updateClientAdvisorConfig = async (params: ClientAdvisorConfigParams) => {
  return await apiClient.post('/ai/admin/client/advisor/config/updateClientAdvisorConfig', params);
};

// 删除客户端顾问配置
export const deleteClientAdvisorConfig = async (id: number) => {
  return await apiClient.get('/ai/admin/client/advisor/config/deleteClientAdvisorConfig', { params: { id } });
};

// 根据ID查询客户端顾问配置
export const queryClientAdvisorConfigById = async (id: number) => {
  return await apiClient.get('/ai/admin/client/advisor/config/queryClientAdvisorConfigById', { params: { id } });
};

// ==================== MCP工具管理 API ====================

// 查询MCP工具列表
export const queryMcpToolList = async (params: McpToolQueryParams) => {
  return await apiClient.post('/ai/admin/client/tool/mcp/queryMcpList', params);
};

// 添加MCP工具
export const addMcpTool = async (params: McpToolParams) => {
  return await apiClient.post('/ai/admin/client/tool/mcp/addMcpTool', params);
};

// 更新MCP工具
export const updateMcpTool = async (params: McpToolParams) => {
  return await apiClient.post('/ai/admin/client/tool/mcp/updateMcpTool', params);
};

// 删除MCP工具
export const deleteMcpTool = async (id: number) => {
  return await apiClient.post('/ai/admin/tool/mcp/deleteMcpTool', { id });
};

// 根据ID查询MCP工具
export const queryMcpToolById = async (id: number) => {
  return await apiClient.post('/ai/admin/tool/mcp/queryMcpToolById', { id });
};


//------------------------api管理相关------------------------

// API配置相关接口
export interface ApiConfig {
  id: number;
  apiId: string;
  baseUrl: string;
  apiKey: string;
  completionsPath: string;
  embeddingsPath: string;
  status: number;
  createTime: string;
  updateTime: string;
}

export interface ApiConfigQueryParams extends PaginationParams {
  status?: number;
  createTimeStart?: string;
  createTimeEnd?: string;
}

// 查询API配置列表
export const queryClientApiList = async (params: ApiConfigQueryParams) => {
  return await apiClient.post('/ai/admin/client/api/queryClientApiList', params);
};

// 添加API配置
export const addClientApi = async (params: ApiConfig) => {
  return await apiClient.post('/ai/admin/client/api/addClientApi', params);
};

// 更新API配置
export const updateClientApi = async (params: ApiConfig) => {
  return await apiClient.post('/ai/admin/client/api/updateClientApi', params);
};

// 删除API配置
export const deleteClientApi = async (id: number) => {
  return await apiClient.get('/ai/admin/client/api/deleteClientApi', { params: { id } });
};

// 根据ID查询API配置
export const queryClientApiById = async (id: number) => {
  return await apiClient.get('/ai/admin/client/api/queryClientApiById', { params: { id } });
};

// 根据API ID查询API配置
export const queryClientApiByApiId = async (apiId: string) => {
  return await apiClient.get('/ai/admin/client/api/queryClientApiByApiId', { params: { apiId } });
};