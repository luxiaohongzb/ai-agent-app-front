import React, { useState, useEffect } from 'react';
import {
  Card,
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
  Row,
  Col,
  Pagination,
  Drawer,
} from 'antd';
import AgentDetailPage from './AgentDetailPage';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  queryAiAgentList,
  addAiAgent,
  updateAiAgent,
  deleteAiAgent,
  queryAiAgentById,
  preheatAgent,
  AgentParams,
  AgentQueryParams,
} from '../../services/adminService';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface Agent {
  id: number;
  agentName: string;
  description?: string;
  status: number;
  createTime: string;
  updateTime: string;
  total?: number;
  pages?: number;
}

const AgentManagePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchName, setSearchName] = useState('');
  const [form] = Form.useForm();
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null);

  // 加载智能体列表
  const loadAgentList = async (page = currentPage, name = searchName) => {
    setLoading(true);
    try {
      const params: AgentQueryParams = {
        pageNum: page,
        pageSize,
        agentName: name || undefined,
      };
      const response = await queryAiAgentList(params);
      if (response && response.list) {
        setAgents(response.list);
        if (response.length > 0 && response[0].total !== undefined) {
          setTotal(response.total || 0);
        }
      } else {
        setAgents([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('加载智能体列表失败:', error);
      message.error('加载智能体列表失败');
      setAgents([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    loadAgentList();
  }, []);

  // 搜索
  const handleSearch = () => {
    setCurrentPage(1);
    loadAgentList(1, searchName);
  };

  // 分页变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadAgentList(page, searchName);
  };

  // 显示新增/编辑模态框
  const showModal = (agent?: Agent) => {
    setEditingAgent(agent || null);
    setModalVisible(true);
    if (agent) {
      form.setFieldsValue({
        agentName: agent.agentName,
        description: agent.description,
        status: agent.status === 1,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ status: true });
    }
  };

  // 编辑智能体
  const handleEdit = async (id: number) => {
    try {
      const response = await queryAiAgentById(id);
      if (response) {
        showModal(response);
      }
    } catch (error) {
      console.error('获取智能体信息失败:', error);
      message.error('获取智能体信息失败');
    }
  };

  // 保存智能体
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const params: AgentParams = {
        agentName: values.agentName,
        description: values.description,
        status: values.status ? 1 : 0,
      };

      if (editingAgent) {
        // 编辑
        params.id = editingAgent.id;
        await updateAiAgent(params);
        message.success('更新成功');
      } else {
        // 新增
        await addAiAgent(params);
        message.success('添加成功');
      }

      setModalVisible(false);
      loadAgentList();
    } catch (error) {
      console.error('保存智能体失败:', error);
      message.error('保存智能体失败');
    }
  };

  // 删除智能体
  const handleDelete = async (id: number) => {
    try {
      await deleteAiAgent(id);
      message.success('删除成功');
      loadAgentList();
    } catch (error) {
      console.error('删除智能体失败:', error);
      message.error('删除智能体失败');
    }
  };

  // 预热智能体
  const handlePreheat = async (id: number) => {
    try {
      await preheatAgent(id);
      message.success('预热成功');
    } catch (error) {
      console.error('预热智能体失败:', error);
      message.error('预热智能体失败');
    }
  };

  // 格式化日期
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('zh-CN');
  };

  // 表格列定义
  const columns: ColumnsType<Agent> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '智能体名称',
      dataIndex: 'agentName',
      key: 'agentName',
      ellipsis: true,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text) => text || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 1 ? 'success' : 'error'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      render: formatDate,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 180,
      render: formatDate,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            onClick={() => {
              setSelectedAgentId(record.id);
              setDetailVisible(true);
            }}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            icon={<ThunderboltOutlined />}
            onClick={() => handlePreheat(record.id)}
          >
            预热
          </Button>
          <Popconfirm
            title="确定要删除这个智能体吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Title level={4}>智能体管理</Title>
        </div>
        
        {/* 搜索和操作栏 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Input
              placeholder="请输入智能体名称"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onPressEnter={handleSearch}
              suffix={<SearchOutlined />}
            />
          </Col>
          <Col>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                搜索
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                新增智能体
              </Button>
            </Space>
          </Col>
        </Row>

        {/* 表格 */}
        <Table
          columns={columns}
          dataSource={agents}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: 1000 }}
        />

        {/* 分页 */}
        {total > 0 && (
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={total}
              onChange={handlePageChange}
              showSizeChanger={false}
              showQuickJumper
              showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`}
            />
          </div>
        )}
      </Card>

      {/* 新增/编辑模态框 */}
      <Modal
        title={editingAgent ? '编辑智能体' : '新增智能体'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: true }}
        >
          <Form.Item
            name="agentName"
            label="智能体名称"
            rules={[{ required: true, message: '请输入智能体名称' }]}
          >
            <Input placeholder="请输入智能体名称" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="描述"
          >
            <TextArea
              placeholder="请输入描述"
              rows={4}
              maxLength={500}
              showCount
            />
          </Form.Item>
          
          <Form.Item
            name="status"
            label="状态"
            valuePropName="checked"
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 智能体详情抽屉 */}
      <Drawer
        title="智能体详情"
        placement="right"
        width={800}
        onClose={() => {
          setDetailVisible(false);
          setSelectedAgentId(null);
        }}
        open={detailVisible}
        destroyOnClose
      >
        {selectedAgentId && <AgentDetailPage agentId={selectedAgentId} />}
      </Drawer>
    </div>
  );
};

export default AgentManagePage;