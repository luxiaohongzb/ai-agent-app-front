import React, { useState } from 'react';
import {
  Card,
  Tabs,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  message,
  Popconfirm,
  Tag,
  Typography,
  Statistic,
  Row,
  Col,
  Progress,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
  UserOutlined,
  RobotOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  BarChartOutlined,
  ScheduleOutlined,
  ToolOutlined,
  HomeOutlined,
  SunOutlined,
  MoonOutlined,
} from '@ant-design/icons';
import { Box, IconButton, Avatar, Typography as MuiTypography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useThemeStore } from '../../store';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import GradientBackground from '../../components/common/GradientBackground';
import type { ColumnsType } from 'antd/es/table';
import { AIAgent, KnowledgeBase, PromptTemplate, User } from '../../types';
import TaskSchedulePage from './TaskSchedulePage';
import McpManagePage from './McpManagePage';
import ClientConfigPage from './ClientConfigPage';
import AgentManagePage from './AgentManagePage';
import AgentClientManagePage from './AgentClientManagePage';
import ClientModelManagePage from './ClientModelManagePage';
import RagOrderManagePage from './RagOrderManagePage';
import ClientAdvisorManagePage from './ClientAdvisorManagePage';
import ClientAdvisorConfigManagePage from './ClientAdvisorConfigManagePage';
import SystemPromptManagePage from './SystemPromptManagePage';
import ApiManagePage from './ApiManagePage';
import ClientToolMcpManagePage from './ClientToolMcpManagePage';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

// 创建带有高斯模糊效果的内容容器
const GlassContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.08)',
  borderRadius: '20px',
  overflow: 'hidden',
  height: 'calc(100vh - 32px)',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  margin: '16px',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxSizing: 'border-box',
}));

interface AdminPageProps {}

const AdminPage: React.FC<AdminPageProps> = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'agent' | 'knowledge' | 'template' | 'user'>('agent');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form] = Form.useForm();
  
  const { theme, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const handleBackToMain = () => {
    navigate('/');
  };
  
  // Mock头像URL
  const mockAvatarUrl = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (user?.username || 'admin');

  // 模拟数据
  const [agents, setAgents] = useState<AIAgent[]>([
    {
      id: '1',
      name: 'GPT-4 助手',
      description: '基于GPT-4的智能助手',
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2048,
      systemPrompt: '你是一个有用的AI助手',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ]);

  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([
    {
      id: '1',
      name: '技术文档',
      description: '技术相关文档知识库',
      fileCount: 25,
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ]);

  const [templates, setTemplates] = useState<PromptTemplate[]>([
    {
      id: '1',
      name: '代码审查',
      content: '请帮我审查以下代码，指出潜在问题和改进建议：\n\n{code}',
      category: '开发',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ]);

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      username: 'admin',
      email: 'admin@example.com',
      role: 'admin',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      lastLoginAt: '2024-01-01T00:00:00Z',
    },
  ]);

  // 统计数据
  const stats = {
    totalChats: 156,
    totalMessages: 1234,
    activeUsers: 23,
    totalAgents: agents.length,
    totalKnowledgeBases: knowledgeBases.length,
    totalTemplates: templates.length,
  };

  // 表格列定义
  const agentColumns: ColumnsType<AIAgent> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '模型',
      dataIndex: 'model',
      key: 'model',
      render: (model) => <Tag color="blue">{model}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit('agent', record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个AI代理吗？"
            onConfirm={() => handleDelete('agent', record.id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const knowledgeColumns: ColumnsType<KnowledgeBase> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '文件数量',
      dataIndex: 'fileCount',
      key: 'fileCount',
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit('knowledge', record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个知识库吗？"
            onConfirm={() => handleDelete('knowledge', record.id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const templateColumns: ColumnsType<PromptTemplate> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag>{category}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit('template', record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个模板吗？"
            onConfirm={() => handleDelete('template', record.id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const userColumns: ColumnsType<User> = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role === 'admin' ? '管理员' : '用户'}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '最后登录',
      dataIndex: 'lastLoginAt',
      key: 'lastLoginAt',
      render: (date) => date ? new Date(date).toLocaleDateString() : '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit('user', record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个用户吗？"
            onConfirm={() => handleDelete('user', record.id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 处理新增
  const handleAdd = (type: typeof modalType) => {
    setModalType(type);
    setEditingItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 处理编辑
  const handleEdit = (type: typeof modalType, item: any) => {
    setModalType(type);
    setEditingItem(item);
    form.setFieldsValue(item);
    setModalVisible(true);
  };

  // 处理删除
  const handleDelete = (type: string, id: string) => {
    switch (type) {
      case 'agent':
        setAgents(agents.filter(item => item.id !== id));
        break;
      case 'knowledge':
        setKnowledgeBases(knowledgeBases.filter(item => item.id !== id));
        break;
      case 'template':
        setTemplates(templates.filter(item => item.id !== id));
        break;
      case 'user':
        setUsers(users.filter(item => item.id !== id));
        break;
    }
    message.success('删除成功');
  };

  // 处理保存
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const now = new Date().toISOString();
      
      if (editingItem) {
        // 编辑
        const updatedItem = { ...editingItem, ...values, updatedAt: now };
        switch (modalType) {
          case 'agent':
            setAgents(agents.map(item => item.id === editingItem.id ? updatedItem : item));
            break;
          case 'knowledge':
            setKnowledgeBases(knowledgeBases.map(item => item.id === editingItem.id ? updatedItem : item));
            break;
          case 'template':
            setTemplates(templates.map(item => item.id === editingItem.id ? updatedItem : item));
            break;
          case 'user':
            setUsers(users.map(item => item.id === editingItem.id ? updatedItem : item));
            break;
        }
        message.success('更新成功');
      } else {
        // 新增
        const newItem = {
          ...values,
          id: Date.now().toString(),
          createdAt: now,
          updatedAt: now,
        };
        switch (modalType) {
          case 'agent':
            setAgents([...agents, newItem]);
            break;
          case 'knowledge':
            setKnowledgeBases([...knowledgeBases, { ...newItem, fileCount: 0 }]);
            break;
          case 'template':
            setTemplates([...templates, newItem]);
            break;
          case 'user':
            setUsers([...users, newItem]);
            break;
        }
        message.success('创建成功');
      }
      
      setModalVisible(false);
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  // 获取模态框标题
  const getModalTitle = () => {
    const action = editingItem ? '编辑' : '新增';
    const typeMap = {
      agent: 'AI代理',
      knowledge: '知识库',
      template: '提示模板',
      user: '用户',
    };
    return `${action}${typeMap[modalType]}`;
  };

  // 渲染表单内容
  const renderFormContent = () => {
    switch (modalType) {
      case 'agent':
        return (
          <>
            <Form.Item
              label="名称"
              name="name"
              rules={[{ required: true, message: '请输入名称' }]}
            >
              <Input placeholder="输入AI代理名称" />
            </Form.Item>
            <Form.Item
              label="描述"
              name="description"
            >
              <TextArea placeholder="输入描述" rows={3} />
            </Form.Item>
            <Form.Item
              label="模型"
              name="model"
              rules={[{ required: true, message: '请选择模型' }]}
            >
              <Select placeholder="选择模型">
                <Select.Option value="gpt-4">GPT-4</Select.Option>
                <Select.Option value="gpt-3.5-turbo">GPT-3.5 Turbo</Select.Option>
                <Select.Option value="claude-3">Claude 3</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="系统提示"
              name="systemPrompt"
            >
              <TextArea placeholder="输入系统提示" rows={4} />
            </Form.Item>
            <Form.Item
              label="启用"
              name="isActive"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </>
        );
      case 'knowledge':
        return (
          <>
            <Form.Item
              label="名称"
              name="name"
              rules={[{ required: true, message: '请输入名称' }]}
            >
              <Input placeholder="输入知识库名称" />
            </Form.Item>
            <Form.Item
              label="描述"
              name="description"
            >
              <TextArea placeholder="输入描述" rows={3} />
            </Form.Item>
            <Form.Item
              label="启用"
              name="isActive"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </>
        );
      case 'template':
        return (
          <>
            <Form.Item
              label="名称"
              name="name"
              rules={[{ required: true, message: '请输入名称' }]}
            >
              <Input placeholder="输入模板名称" />
            </Form.Item>
            <Form.Item
              label="分类"
              name="category"
            >
              <Input placeholder="输入分类" />
            </Form.Item>
            <Form.Item
              label="内容"
              name="content"
              rules={[{ required: true, message: '请输入模板内容' }]}
            >
              <TextArea placeholder="输入模板内容" rows={6} />
            </Form.Item>
            <Form.Item
              label="启用"
              name="isActive"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </>
        );
      case 'user':
        return (
          <>
            <Form.Item
              label="用户名"
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="输入用户名" />
            </Form.Item>
            <Form.Item
              label="邮箱"
              name="email"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' },
              ]}
            >
              <Input placeholder="输入邮箱" />
            </Form.Item>
            <Form.Item
              label="角色"
              name="role"
              rules={[{ required: true, message: '请选择角色' }]}
            >
              <Select placeholder="选择角色">
                <Select.Option value="admin">管理员</Select.Option>
                <Select.Option value="user">用户</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="启用"
              name="isActive"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <GradientBackground>
      <GlassContainer>
        {/* 顶部导航栏 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, md: 2 },
            padding: { xs: '0 16px', md: '0 24px' },
            height: { xs: 56, md: 64 },
            position: 'sticky',
            top: 0,
            zIndex: 30,
            borderBottom: theme === 'dark' ? '1px solid #4b5563' : '1px solid rgba(0, 0, 0, 0.06)',
            backdropFilter: 'blur(8px)',
            backgroundColor: theme === 'dark' ? '#374151' : 'rgba(255, 255, 255, 0.5)',
          }}
        >
          {/* 返回主界面按钮 */}
          <IconButton
            onClick={handleBackToMain}
            sx={{
              borderRadius: 2,
              p: 1,
              color: 'text.secondary',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
              transition: 'all 0.2s',
            }}
            title="返回主界面"
          >
            <HomeOutlined />
          </IconButton>

          {/* 标题 */}
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <SettingOutlined style={{ fontSize: '24px', color: theme === 'dark' ? '#60a5fa' : '#3b82f6' }} />
            <MuiTypography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: theme === 'dark' ? '#f3f4f6' : '#1f2937',
                margin: 0,
              }}
            >
              系统管理
            </MuiTypography>
          </Box>

          {/* 用户头像和信息 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mx: 1 }}>
            <Avatar
              src={mockAvatarUrl}
              sx={{
                width: 32,
                height: 32,
                border: theme === 'dark' ? '2px solid #4b5563' : '2px solid #e5e7eb',
                backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
                color: theme === 'dark' ? '#f3f4f6' : '#374151',
              }}
            >
              <UserOutlined style={{ color: theme === 'dark' ? '#f3f4f6' : '#374151' }} />
            </Avatar>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <MuiTypography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: theme === 'dark' ? '#f3f4f6' : '#374151',
                  lineHeight: 1.2,
                }}
              >
                {user?.username || 'Admin'}
              </MuiTypography>
              <MuiTypography
                variant="caption"
                sx={{
                  color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                  lineHeight: 1,
                }}
              >
                管理员
              </MuiTypography>
            </Box>
          </Box>

          {/* 主题切换按钮 */}
          <IconButton
            onClick={toggleTheme}
            sx={{
              borderRadius: 2,
              p: 1,
              color: 'text.secondary',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
              transition: 'all 0.2s',
            }}
            title={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
          >
            {theme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
          </IconButton>
        </Box>

        {/* 主内容区域 */}
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto', 
          p: { xs: 2, md: 3 },
          minHeight: 'calc(100vh - 120px)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            size="large"
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            tabBarStyle={{
              marginBottom: '24px',
              borderBottom: theme === 'dark' ? '1px solid #4b5563' : '1px solid #e5e7eb',
              backgroundColor: theme === 'dark' ? 'rgba(55, 65, 81, 0.3)' : 'rgba(255, 255, 255, 0.3)',
              borderRadius: '12px 12px 0 0',
              padding: '8px 16px 0',
              backdropFilter: 'blur(4px)',
              flexShrink: 0
            }}
            tabBarGutter={24}
          >
          <TabPane tab="📊 概览" key="overview">
            <Box sx={{ padding: '24px' }}>
              <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
                <Col xs={24} sm={12} lg={6}>
                  <Card 
                    style={{ 
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      border: 'none',
                      height: '120px'
                    }}
                    bodyStyle={{ padding: '20px' }}
                  >
                    <Statistic
                      title="总对话数"
                      value={stats.totalChats}
                      prefix={<BarChartOutlined style={{ color: '#1890ff' }} />}
                      valueStyle={{ fontSize: '24px', fontWeight: 'bold' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card 
                    style={{ 
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      border: 'none',
                      height: '120px'
                    }}
                    bodyStyle={{ padding: '20px' }}
                  >
                    <Statistic
                      title="总消息数"
                      value={stats.totalMessages}
                      prefix={<FileTextOutlined style={{ color: '#52c41a' }} />}
                      valueStyle={{ fontSize: '24px', fontWeight: 'bold' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card 
                    style={{ 
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      border: 'none',
                      height: '120px'
                    }}
                    bodyStyle={{ padding: '20px' }}
                  >
                    <Statistic
                      title="活跃用户"
                      value={stats.activeUsers}
                      prefix={<UserOutlined style={{ color: '#fa8c16' }} />}
                      valueStyle={{ fontSize: '24px', fontWeight: 'bold' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card 
                    style={{ 
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      border: 'none',
                      height: '120px'
                    }}
                    bodyStyle={{ padding: '20px' }}
                  >
                    <Statistic
                      title="AI代理数"
                      value={stats.totalAgents}
                      prefix={<RobotOutlined style={{ color: '#eb2f96' }} />}
                      valueStyle={{ fontSize: '24px', fontWeight: 'bold' }}
                    />
                  </Card>
                </Col>
              </Row>

              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  <Card 
                    title="系统使用情况" 
                    style={{ 
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      border: 'none',
                      height: '320px'
                    }}
                    headStyle={{ 
                      borderBottom: '1px solid #f0f0f0',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                    bodyStyle={{ padding: '24px' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div>
                        <Text style={{ fontSize: '14px', marginBottom: '8px', display: 'block' }}>CPU 使用率</Text>
                        <Progress percent={65} status="active" strokeColor="#1890ff" />
                      </div>
                      <div>
                        <Text style={{ fontSize: '14px', marginBottom: '8px', display: 'block' }}>内存使用率</Text>
                        <Progress percent={45} strokeColor="#52c41a" />
                      </div>
                      <div>
                        <Text style={{ fontSize: '14px', marginBottom: '8px', display: 'block' }}>存储使用率</Text>
                        <Progress percent={30} strokeColor="#fa8c16" />
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card 
                    title="最近活动" 
                    style={{ 
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      border: 'none',
                      height: '320px'
                    }}
                    headStyle={{ 
                      borderBottom: '1px solid #f0f0f0',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                    bodyStyle={{ padding: '24px' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                        <Text style={{ fontSize: '14px' }}>用户登录</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>2分钟前</Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                        <Text style={{ fontSize: '14px' }}>新建对话</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>5分钟前</Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                        <Text style={{ fontSize: '14px' }}>上传文件</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>10分钟前</Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                        <Text style={{ fontSize: '14px' }}>创建知识库</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>1小时前</Text>
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Box>
          </TabPane>

       
          <TabPane tab="📚 知识库" key="knowledge">
            <Card
              title="知识库管理"
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => handleAdd('knowledge')}
                >
                  新增知识库
                </Button>
              }
            >
              <Table
                columns={knowledgeColumns}
                dataSource={knowledgeBases}
                rowKey="id"
                pagination={{ pageSize: 10 }}
              />
            </Card>
          </TabPane>

          {/* <TabPane tab="📝 提示模板" key="templates">
            <Card
              title="提示模板管理"
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => handleAdd('template')}
                >
                  新增模板
                </Button>
              }
            >
              <Table
                columns={templateColumns}
                dataSource={templates}
                rowKey="id"
                pagination={{ pageSize: 10 }}
              />
            </Card>
          </TabPane> */}

          <TabPane tab="👥 用户管理" key="users">
            <Card
              title="用户管理"
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => handleAdd('user')}
                >
                  新增用户
                </Button>
              }
            >
              <Table
                columns={userColumns}
                dataSource={users}
                rowKey="id"
                pagination={{ pageSize: 10 }}
              />
            </Card>
          </TabPane>

          <TabPane tab="⏰ 任务调度" key="tasks">
            <Box sx={{ 
               backgroundColor: theme === 'dark' ? 'rgba(55, 65, 81, 0.2)' : 'rgba(255, 255, 255, 0.2)',
               borderRadius: '12px',
               padding: '24px',
               backdropFilter: 'blur(4px)',
               minHeight: '600px',
               flex: 1,
               display: 'flex',
               flexDirection: 'column',
               gap: '16px'
             }}>
              <TaskSchedulePage key={activeTab} />
            </Box>
          </TabPane>

          <TabPane tab="🔧 MCP工具" key="mcp">
             <Box sx={{ 
               backgroundColor: theme === 'dark' ? 'rgba(55, 65, 81, 0.2)' : 'rgba(255, 255, 255, 0.2)',
               borderRadius: '12px',
               padding: '24px',
               backdropFilter: 'blur(4px)',
               minHeight: '600px',
               flex: 1,
               display: 'flex',
               flexDirection: 'column',
               gap: '16px'
             }}>
              <ClientToolMcpManagePage key={activeTab} />
             </Box>
           </TabPane>

           {/* <TabPane tab="⚙️ 客户端配置" key="client-config">
             <Box sx={{ 
               backgroundColor: theme === 'dark' ? 'rgba(55, 65, 81, 0.2)' : 'rgba(255, 255, 255, 0.2)',
               borderRadius: '12px',
               padding: '24px',
               backdropFilter: 'blur(4px)',
               minHeight: '600px',
               flex: 1,
               display: 'flex',
               flexDirection: 'column',
               gap: '16px'
             }}>
               <ClientConfigPage key={activeTab} />
             </Box>
           </TabPane> */}

          <TabPane tab="🎯 智能体管理" key="agent-manage">
             <Box sx={{ 
               backgroundColor: theme === 'dark' ? 'rgba(55, 65, 81, 0.2)' : 'rgba(255, 255, 255, 0.2)',
               borderRadius: '12px',
               padding: '24px',
               backdropFilter: 'blur(4px)',
               minHeight: '600px',
               flex: 1,
               display: 'flex',
               flexDirection: 'column',
               gap: '16px'
             }}>
               <AgentManagePage key={activeTab} />
             </Box>
           </TabPane>

           <TabPane tab="💻 智能体客户端关联" key="agent-client">
             <Box sx={{ 
               backgroundColor: theme === 'dark' ? 'rgba(55, 65, 81, 0.2)' : 'rgba(255, 255, 255, 0.2)',
               borderRadius: '12px',
               padding: '24px',
               backdropFilter: 'blur(4px)',
               minHeight: '600px',
               flex: 1,
               display: 'flex',
               flexDirection: 'column',
               gap: '16px'
             }}>
               <AgentClientManagePage key={activeTab} />
             </Box>
           </TabPane>

           <TabPane tab="🧠 客户端模型" key="client-model">
             <Box sx={{ 
               backgroundColor: theme === 'dark' ? 'rgba(55, 65, 81, 0.2)' : 'rgba(255, 255, 255, 0.2)',
               borderRadius: '12px',
               padding: '24px',
               backdropFilter: 'blur(4px)',
               minHeight: '600px',
               flex: 1,
               display: 'flex',
               flexDirection: 'column',
               gap: '16px'
             }}>
               <ClientModelManagePage key={activeTab} />
             </Box>
           </TabPane>

          <TabPane tab="📋 RAG订单" key="rag-order">
             <Box sx={{ 
               backgroundColor: theme === 'dark' ? 'rgba(55, 65, 81, 0.2)' : 'rgba(255, 255, 255, 0.2)',
               borderRadius: '12px',
               padding: '24px',
               backdropFilter: 'blur(4px)',
               minHeight: '600px',
               flex: 1,
               display: 'flex',
               flexDirection: 'column',
               gap: '16px'
             }}>
               <RagOrderManagePage key={activeTab} />
             </Box>
           </TabPane>
{/* 
           <TabPane tab="👨‍💼 客户端顾问" key="client-advisor">
             <Box sx={{ 
               backgroundColor: theme === 'dark' ? 'rgba(55, 65, 81, 0.2)' : 'rgba(255, 255, 255, 0.2)',
               borderRadius: '12px',
               padding: '24px',
               backdropFilter: 'blur(4px)',
               minHeight: '600px',
               flex: 1,
               display: 'flex',
               flexDirection: 'column',
               gap: '16px'
             }}>
               <ClientAdvisorManagePage key={activeTab} />
             </Box>
           </TabPane> */}

           <TabPane tab="🔧 顾问配置" key="client-advisor-config">
             <Box sx={{ 
               backgroundColor: theme === 'dark' ? 'rgba(55, 65, 81, 0.2)' : 'rgba(255, 255, 255, 0.2)',
               borderRadius: '12px',
               padding: '24px',
               backdropFilter: 'blur(4px)',
               minHeight: '600px',
               flex: 1,
               display: 'flex',
               flexDirection: 'column',
               gap: '16px'
             }}>
               <ClientAdvisorConfigManagePage key={activeTab} />
             </Box>
           </TabPane>

          <TabPane tab="💬 系统提示" key="system-prompt">
            <Box sx={{ 
              backgroundColor: theme === 'dark' ? 'rgba(55, 65, 81, 0.2)' : 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '24px',
              backdropFilter: 'blur(4px)',
              minHeight: '600px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <SystemPromptManagePage key={activeTab} />
            </Box>
          </TabPane>

          <TabPane tab="🛠️ API管理" key="client-tool-config">
            <Box sx={{ 
              backgroundColor: theme === 'dark' ? 'rgba(55, 65, 81, 0.2)' : 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '24px',
              backdropFilter: 'blur(4px)',
              minHeight: '600px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <ApiManagePage key={activeTab} />
            </Box>
          </TabPane>

          {/* <TabPane tab="🔩 MCP工具配置" key="client-tool-mcp">
            <Box sx={{ 
              backgroundColor: theme === 'dark' ? 'rgba(55, 65, 81, 0.2)' : 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '24px',
              backdropFilter: 'blur(4px)',
              minHeight: '600px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <ClientToolMcpManagePage key={activeTab} />
            </Box>
          </TabPane> */}
          </Tabs>

          {/* 编辑模态框 */}
          <Modal
            title={getModalTitle()}
            open={modalVisible}
            onOk={handleSave}
            onCancel={() => setModalVisible(false)}
            width={600}
          >
            <Form
              form={form}
              layout="vertical"
              initialValues={{ isActive: true }}
            >
              {renderFormContent()}
            </Form>
          </Modal>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            borderTop: theme === 'dark' ? '1px solid #4b5563' : '1px solid rgba(0, 0, 0, 0.06)',
            backdropFilter: 'blur(8px)',
            backgroundColor: theme === 'dark' ? '#374151' : 'rgba(255, 255, 255, 0.5)',
            padding: '12px 24px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <MuiTypography
            variant="body2"
            sx={{
              color: theme === 'dark' ? '#9ca3af' : '#6b7280',
              textAlign: 'center',
            }}
          >
            © 2024 AI Agent Station. All rights reserved.
          </MuiTypography>
        </Box>
      </GlassContainer>
    </GradientBackground>
  );
};

export default AdminPage;