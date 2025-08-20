import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Tabs, 
  Table, 
  Button, 
  message, 
  Tag, 
  Breadcrumb, 
  Space,
  Typography,
  Row,
  Col
} from 'antd';
import { 
  ArrowLeftOutlined, 
  SettingOutlined, 
  ApiOutlined,
  BulbOutlined,
  CloudOutlined,
  ExpandOutlined,
  CompressOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { 
  queryAiAgentById, 
  queryAgentClientByAgentId,
  queryApiByClientId,
  queryModelByClientId,
  queryPromptByClientId
} from '../../services/adminService';
import { AiAgentFlowConfig } from '../../types';

const { Title } = Typography;

// =============== Mock 开关与数据 ===============
const USE_MOCK = true; // 接口未调通时，将此值设为 true 使用本地 mock 数据

interface ApiConfig {
  id: number;
  apiId: string;
  baseUrl: string;
  apiKey: string;
  status: number;
  createTime: string;
}

interface ModelConfig {
  id: number;
  modelId: string;
  modelName: string;
  modelType: string;
  status: number;
  createTime: string;
}

interface PromptConfig {
  id: number;
  promptName: string;
  promptContent: string;
  status: number;
  createTime: string;
}

// 根据 URL 参数动态生成部分 mock 内容
const now = new Date().toISOString();

const buildMockAgentDetail = (agentId: string | undefined) => ({
  id: Number(agentId) || 1,
  agentId: Number(agentId) || 1,
  agentName: `智能体-${agentId || 'Demo'}`,
  description: '这是一个用于演示的智能体详情（Mock 数据）',
  status: 1,
  createTime: now,
  updateTime: now,
});

const MOCK_FLOW_CONFIGS: AiAgentFlowConfig[] = [
  { id: 11, clientId: '3101', clientName: '任务分析和优先判断', description: '分析任务并排序（Mock）', status: 1, createTime: now, updateTime: now },
  { id: 12, clientId: '3102', clientName: '具体任务执行',       description: '执行具体任务（Mock）',   status: 1, createTime: now, updateTime: now },
  { id: 13, clientId: '3103', clientName: '质量检查和优化',     description: '监督与优化（Mock）',     status: 0, createTime: now, updateTime: now },
  { id: 14, clientId: '3104', clientName: '负责响应式处理',     description: '响应用户请求（Mock）',   status: 1, createTime: now, updateTime: now },
];

const MOCK_APIS: Record<string, ApiConfig[]> = {
  '3101': [
    { id: 1, apiId: 'api-3101-1', baseUrl: 'https://api.mock/analysis', apiKey: 'sk-xxxx-3101-1', status: 1, createTime: now },
    { id: 2, apiId: 'api-3101-2', baseUrl: 'https://api.mock/common',   apiKey: 'sk-xxxx-3101-2', status: 1, createTime: now },
  ],
  '3102': [
    { id: 3, apiId: 'api-3102-1', baseUrl: 'https://api.mock/execute',  apiKey: 'sk-xxxx-3102-1', status: 1, createTime: now },
  ],
  '3103': [
    { id: 4, apiId: 'api-3103-1', baseUrl: 'https://api.mock/qa',       apiKey: 'sk-xxxx-3103-1', status: 0, createTime: now },
  ],
  '3104': [
    { id: 5, apiId: 'api-3104-1', baseUrl: 'https://api.mock/reactive', apiKey: 'sk-xxxx-3104-1', status: 1, createTime: now },
  ],
};

const MOCK_MODELS: Record<string, ModelConfig[]> = {
  '3101': [
    { id: 1, modelId: 'gpt-4o',    modelName: 'GPT-4o',        modelType: 'LLM', status: 1, createTime: now },
    { id: 2, modelId: 'text-embed', modelName: 'Embedding-2',  modelType: 'Embedding', status: 1, createTime: now },
  ],
  '3102': [
    { id: 3, modelId: 'gpt-4-mini', modelName: 'GPT-4 Mini',   modelType: 'LLM', status: 1, createTime: now },
  ],
  '3103': [
    { id: 4, modelId: 'qacheck-1', modelName: 'QA-Check',      modelType: 'Tool', status: 0, createTime: now },
  ],
  '3104': [
    { id: 5, modelId: 'claude-3',  modelName: 'Claude 3',      modelType: 'LLM', status: 1, createTime: now },
  ],
};

const MOCK_PROMPTS: Record<string, PromptConfig[]> = {
  '3101': [
    { id: 1, promptName: '分析器系统提示', promptContent: '你是资深任务分析师...', status: 1, createTime: now },
  ],
  '3102': [
    { id: 2, promptName: '执行器系统提示', promptContent: '你是可靠的任务执行者...', status: 1, createTime: now },
  ],
  '3103': [
    { id: 3, promptName: '质检系统提示',   promptContent: '你是严谨的质检助手...', status: 0, createTime: now },
  ],
  '3104': [
    { id: 4, promptName: '响应系统提示',   promptContent: '你是高效的响应助手...', status: 1, createTime: now },
  ],
};

// =============== 组件 ===============
const AgentDetailFullPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [agentDetail, setAgentDetail] = useState<any>(null);
  const [flowConfigs, setFlowConfigs] = useState<AiAgentFlowConfig[]>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  // 子表数据状态
  const [clientApis, setClientApis] = useState<Record<string, ApiConfig[]>>({});
  const [clientModels, setClientModels] = useState<Record<string, ModelConfig[]>>({});
  const [clientPrompts, setClientPrompts] = useState<Record<string, PromptConfig[]>>({});
  const [subTableLoading, setSubTableLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (id) {
      fetchAgentDetail();
      fetchFlowConfigs();
    }
  }, [id]);

  const fetchAgentDetail = async () => {
    if (USE_MOCK) {
      setAgentDetail(buildMockAgentDetail(id));
      return;
    }
    setLoading(true);
    try {
      const response = await queryAiAgentById(Number(id));
      setAgentDetail(response);
    } catch (error) {
      console.error('获取智能体详情失败:', error);
      message.warning('接口未调通，使用 Mock 数据');
      setAgentDetail(buildMockAgentDetail(id));
    } finally {
      setLoading(false);
    }
  };

  const fetchFlowConfigs = async () => {
    if (USE_MOCK) {
      setFlowConfigs(MOCK_FLOW_CONFIGS);
      return;
    }
    setLoading(true);
    try {
      const response = await queryAgentClientByAgentId(id!);
      if (Array.isArray(response)) {
        setFlowConfigs(response);
      } else if (response && Array.isArray(response.data)) {
        setFlowConfigs(response.data);
      } else if (response && Array.isArray(response.list)) {
        setFlowConfigs(response.list);
      } else {
        setFlowConfigs([]);
      }
    } catch (error) {
      console.error('获取流程配置失败:', error);
      message.warning('接口未调通，使用 Mock 数据');
      setFlowConfigs(MOCK_FLOW_CONFIGS);
    } finally {
      setLoading(false);
    }
  };

  // 获取客户端对应的子表数据
  const fetchSubTableData = async (clientId: string, type: 'api' | 'model' | 'prompt') => {
    if (USE_MOCK) {
      // 直接使用本地 mock
      switch (type) {
        case 'api':
          setClientApis(prev => ({ ...prev, [clientId]: MOCK_APIS[clientId] || [] }));
          break;
        case 'model':
          setClientModels(prev => ({ ...prev, [clientId]: MOCK_MODELS[clientId] || [] }));
          break;
        case 'prompt':
          setClientPrompts(prev => ({ ...prev, [clientId]: MOCK_PROMPTS[clientId] || [] }));
          break;
      }
      return;
    }

    setSubTableLoading(prev => ({ ...prev, [`${clientId}-${type}`]: true }));
    try {
      let response;
      switch (type) {
        case 'api':
          response = await queryApiByClientId(clientId);
          setClientApis(prev => ({ ...prev, [clientId]: response?.data || [] }));
          break;
        case 'model':
          response = await queryModelByClientId(clientId);
          setClientModels(prev => ({ ...prev, [clientId]: response?.data || [] }));
          break;
        case 'prompt':
          response = await queryPromptByClientId(clientId);
          setClientPrompts(prev => ({ ...prev, [clientId]: response?.data || [] }));
          break;
      }
    } catch (error) {
      console.error(`获取客户端${clientId}的${type}数据失败:`, error);
      message.warning('接口未调通，使用 Mock 数据');
      switch (type) {
        case 'api':
          setClientApis(prev => ({ ...prev, [clientId]: MOCK_APIS[clientId] || [] }));
          break;
        case 'model':
          setClientModels(prev => ({ ...prev, [clientId]: MOCK_MODELS[clientId] || [] }));
          break;
        case 'prompt':
          setClientPrompts(prev => ({ ...prev, [clientId]: MOCK_PROMPTS[clientId] || [] }));
          break;
      }
    } finally {
      setSubTableLoading(prev => ({ ...prev, [`${clientId}-${type}`]: false }));
    }
  };

  // 行展开处理
  const onExpand = (expanded: boolean, record: AiAgentFlowConfig) => {
    if (expanded) {
      setExpandedRowKeys(prev => Array.from(new Set([...prev, record.id])));
      // 预加载子表数据
      fetchSubTableData(record.clientId, 'api');
      fetchSubTableData(record.clientId, 'model');
      fetchSubTableData(record.clientId, 'prompt');
    } else {
      setExpandedRowKeys(prev => prev.filter(key => key !== record.id));
    }
  };

  // API子表列定义
  const apiColumns: ColumnsType<ApiConfig> = [
    { title: 'API ID', dataIndex: 'apiId', key: 'apiId', width: 120 },
    { title: 'Base URL', dataIndex: 'baseUrl', key: 'baseUrl', ellipsis: true },
    { title: 'API Key', dataIndex: 'apiKey', key: 'apiKey', render: (key) => '***' + key?.slice(-4) },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'error'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
  ];

  // 模型子表列定义
  const modelColumns: ColumnsType<ModelConfig> = [
    { title: '模型ID', dataIndex: 'modelId', key: 'modelId', width: 120 },
    { title: '模型名称', dataIndex: 'modelName', key: 'modelName' },
    { title: '模型类型', dataIndex: 'modelType', key: 'modelType', width: 120 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'error'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
  ];

  // 提示词子表列定义
  const promptColumns: ColumnsType<PromptConfig> = [
    { title: '提示词名称', dataIndex: 'promptName', key: 'promptName', width: 150 },
    { title: '提示词内容', dataIndex: 'promptContent', key: 'promptContent', ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'error'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
  ];

  // 渲染展开行的内容
  const expandedRowRender = (record: AiAgentFlowConfig) => {
    const clientId = record.clientId;
    
    return (
      <div style={{ margin: 0, padding: '8px 16px', backgroundColor: '#fafafa' }}>
        <Tabs 
          defaultActiveKey="api" 
          size="small" 
          style={{ marginBottom: 0 }}
          tabBarStyle={{ marginBottom: '8px' }}
        >
          <Tabs.TabPane 
            tab={<span><ApiOutlined />API 配置</span>} 
            key="api"
          >
            <Table
              columns={apiColumns}
              dataSource={clientApis[clientId] || []}
              rowKey="id"
              loading={subTableLoading[`${clientId}-api`]}
              pagination={false}
              size="small"
              style={{ marginBottom: 0 }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane 
            tab={<span><CloudOutlined />模型配置</span>} 
            key="model"
          >
            <Table
              columns={modelColumns}
              dataSource={clientModels[clientId] || []}
              rowKey="id"
              loading={subTableLoading[`${clientId}-model`]}
              pagination={false}
              size="small"
              style={{ marginBottom: 0 }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane 
            tab={<span><BulbOutlined />提示词配置</span>} 
            key="prompt"
          >
            <Table
              columns={promptColumns}
              dataSource={clientPrompts[clientId] || []}
              rowKey="id"
              loading={subTableLoading[`${clientId}-prompt`]}
              pagination={false}
              size="small"
              style={{ marginBottom: 0 }}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  };

  // 主表列定义
  const flowConfigColumns: ColumnsType<AiAgentFlowConfig> = [
    { 
      title: 'ID', 
      dataIndex: 'id', 
      key: 'id', 
      width: 80 
    },
    { 
      title: '客户端ID', 
      dataIndex: 'clientId', 
      key: 'clientId', 
      width: 120 
    },
    { 
      title: '客户端名称', 
      dataIndex: 'clientName', 
      key: 'clientName', 
      width: 200 
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'error'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    { 
      title: '创建时间', 
      dataIndex: 'createTime', 
      key: 'createTime', 
      width: 180 
    },
    { 
      title: '更新时间', 
      dataIndex: 'updateTime', 
      key: 'updateTime', 
      width: 180 
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small">编辑</Button>
          <Button 
            type="link" 
            size="small"
            icon={expandedRowKeys.includes(record.id) ? <CompressOutlined /> : <ExpandOutlined />}
            onClick={() => onExpand(!expandedRowKeys.includes(record.id), record)}
          >
            {expandedRowKeys.includes(record.id) ? '收起' : '展开'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', minHeight: '100vh' }}>
      {/* 顶部导航 */}
      <Card style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space size="large">
              <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate('/admin')}
                type="text"
              >
                返回智能体管理
              </Button>
              <Breadcrumb>
                <Breadcrumb.Item>管理后台</Breadcrumb.Item>
                <Breadcrumb.Item>智能体管理</Breadcrumb.Item>
                <Breadcrumb.Item>智能体详情</Breadcrumb.Item>
              </Breadcrumb>
            </Space>
          </Col>
          <Col>
            <Title level={3} style={{ margin: 0 }}>
              智能体详情 (ID: {id})
            </Title>
          </Col>
        </Row>
      </Card>

      {/* 主要内容 */}
      <Card>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane
            tab={<span><SettingOutlined />流程配置</span>}
            key="1"
          >
            <Table
              columns={flowConfigColumns}
              dataSource={flowConfigs}
              rowKey="id"
              loading={loading}
              expandable={{
                expandedRowRender,
                expandedRowKeys,
                onExpand,
                rowExpandable: () => true,
              }}
              scroll={{ x: 'max-content' }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`
              }}
            />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default AgentDetailFullPage;