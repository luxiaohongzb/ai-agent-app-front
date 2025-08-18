import React, { useState, useEffect } from 'react';
import { Tabs, Table, Button, message, Tag } from 'antd';
import { queryAiAgentById } from '../../services/adminService';
import { DatabaseOutlined, ToolOutlined, ApiOutlined, MessageOutlined } from '@ant-design/icons';

interface AgentDetailProps {
  agentId: number;
}

const AgentDetailPage: React.FC<AgentDetailProps> = ({ agentId }) => {
  const [loading, setLoading] = useState(false);
  const [agentDetail, setAgentDetail] = useState<any>(null);

  // 模拟数据
  const mockModelConfigs = [
    { id: 1, modelName: 'GPT-4', version: '1.0', status: 1 },
    { id: 2, modelName: 'Claude', version: '2.0', status: 1 },
  ];

  const mockMcpTools = [
    { id: 1, toolName: '文本分析', description: '分析文本内容', status: 1 },
    { id: 2, toolName: '图像处理', description: '处理图像文件', status: 1 },
  ];

  const mockApiProxies = [
    { id: 1, apiName: 'OpenAI API', endpoint: '/api/openai', status: 1 },
    { id: 2, apiName: 'Claude API', endpoint: '/api/claude', status: 1 },
  ];

  const mockPrompts = [
    { id: 1, name: '通用对话', content: '你是一个助手...', status: 1 },
    { id: 2, name: '代码生成', content: '请生成以下代码...', status: 1 },
  ];

  useEffect(() => {
    const fetchAgentDetail = async () => {
      setLoading(true);
      try {
        const response = await queryAiAgentById(agentId);
        setAgentDetail(response);
      } catch (error) {
        console.error('获取智能体详情失败:', error);
        message.error('获取智能体详情失败');
      } finally {
        setLoading(false);
      }
    };

    if (agentId) {
      fetchAgentDetail();
    }
  }, [agentId]);

  const modelColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '模型名称', dataIndex: 'modelName', key: 'modelName' },
    { title: '版本', dataIndex: 'version', key: 'version' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'error'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Button type="link" size="small">编辑</Button>
      ),
    },
  ];

  const mcpToolColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '工具名称', dataIndex: 'toolName', key: 'toolName' },
    { title: '描述', dataIndex: 'description', key: 'description' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'error'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Button type="link" size="small">编辑</Button>
      ),
    },
  ];

  const apiProxyColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'API名称', dataIndex: 'apiName', key: 'apiName' },
    { title: '端点', dataIndex: 'endpoint', key: 'endpoint' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'error'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Button type="link" size="small">编辑</Button>
      ),
    },
  ];

  const promptColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '内容', dataIndex: 'content', key: 'content', ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'error'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Button type="link" size="small">编辑</Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane
          tab={<span><DatabaseOutlined />模型配置</span>}
          key="1"
        >
          <Table
            columns={modelColumns}
            dataSource={mockModelConfigs}
            rowKey="id"
            loading={loading}
            pagination={false}
          />
        </Tabs.TabPane>

        <Tabs.TabPane
          tab={<span><ToolOutlined />MCP工具</span>}
          key="2"
        >
          <Table
            columns={mcpToolColumns}
            dataSource={mockMcpTools}
            rowKey="id"
            loading={loading}
            pagination={false}
          />
        </Tabs.TabPane>

        <Tabs.TabPane
          tab={<span><ApiOutlined />API代理</span>}
          key="3"
        >
          <Table
            columns={apiProxyColumns}
            dataSource={mockApiProxies}
            rowKey="id"
            loading={loading}
            pagination={false}
          />
        </Tabs.TabPane>

        <Tabs.TabPane
          tab={<span><MessageOutlined />提示词</span>}
          key="4"
        >
          <Table
            columns={promptColumns}
            dataSource={mockPrompts}
            rowKey="id"
            loading={loading}
            pagination={false}
          />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default AgentDetailPage;