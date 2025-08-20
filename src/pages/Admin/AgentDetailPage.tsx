import React, { useState, useEffect } from 'react';
import { Tabs, Table, Button, message, Tag } from 'antd';
import { queryAiAgentById, queryAgentClientByAgentId } from '../../services/adminService';
import { AiAgentFlowConfig } from '../../types';
import { DatabaseOutlined, ToolOutlined, ApiOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons';

interface AgentDetailProps {
  agentId: number;
}

const AgentDetailPage: React.FC<AgentDetailProps> = ({ agentId }) => {
  const [loading, setLoading] = useState(false);
  const [agentDetail, setAgentDetail] = useState<any>(null);
  const [flowConfigs, setFlowConfigs] = useState<AiAgentFlowConfig[]>([]);

  // 模拟数据 - 保留原有的其他tab数据
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
        const response = [
          {
            id: 11,
            clientId: "3101",
            clientName: "任务分析和状态判断",
            description: "你是一个专业的任务分析师，名叫 AutoAgent Task Analyzer。",
            status: 1,
            createTime: "2025-06-14T12:43:02",
            updateTime: "2025-07-27T17:00:55"
          },
          {
            id: 12,
            clientId: "3102",
            clientName: "具体任务执行",
            description: "你是一个精准任务执行器，名叫 AutoAgent Precision Executor。",
            status: 1,
            createTime: "2025-06-14T12:43:02",
            updateTime: "2025-07-27T17:01:10"
          },
          {
            id: 13,
            clientId: "3103",
            clientName: "质量检查和优化",
            description: "你是一个专业的质量监督员，名叫 AutoAgent Quality Supervisor。",
            status: 1,
            createTime: "2025-06-14T12:43:02",
            updateTime: "2025-07-27T17:01:23"
          },
          {
            id: 14,
            clientId: "3104",
            clientName: "负责响应式处理",
            description: "你是一个智能响应助手，名叫 AutoAgent React。",
            status: 1,
            createTime: "2025-06-14T12:43:02",
            updateTime: "2025-08-07T14:16:47"
          }
        ];
        console.log(response)
        setAgentDetail(response);
      } catch (error) {
        console.error('获取智能体详情失败:', error);
        message.error('获取智能体详情失败');
      } finally {
        setLoading(false);
      }
    };

    const fetchFlowConfigs = async () => {
      setLoading(true);
      try {
        const response = await queryAgentClientByAgentId(agentId.toString());
        // 由于API返回的是axios响应，数据在response中
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
        message.error('获取流程配置失败');
        setFlowConfigs([]);
      } finally {
        setLoading(false);
      }
    };

    if (agentId) {
      fetchAgentDetail();
      fetchFlowConfigs();
    }
  }, [agentId]);


  // 流程配置表格列定义
  const flowConfigColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '客户端ID', dataIndex: 'clientId', key: 'clientId', width: 120 },
    { title: '客户端名称', dataIndex: 'clientName', key: 'clientName', width: 180 },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: 300,
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
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
    { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: () => (
        <Button type="link" size="small">编辑</Button>
      ),
    },
  ];

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
          tab={<span><SettingOutlined />流程配置</span>}
          key="1"
        >
          <div style={{ overflowX: 'auto' }}>
            <Table
              columns={flowConfigColumns}
              dataSource={flowConfigs}
              rowKey="id"
              loading={loading}
              scroll={{ x: 'max-content' }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`
              }}
            />
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default AgentDetailPage;