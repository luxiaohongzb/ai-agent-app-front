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
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  queryAgentClientList,
  addAgentClient,
  updateAgentClient,
  deleteAgentClient,
  queryAgentClientById,
  queryAllAgentClient,
  queryAgentClientByAgentId,
  queryAgentClientByClientId,
  AgentClientParams,
  AgentClientQueryParams,
} from '../../services/adminService';

const { Title } = Typography;
const { Option } = Select;

interface AgentClient {
  id: number;
  agentId: number;
  clientId: number;
  status: number;
  createTime: string;
  updateTime: string;
  total?: number;
  pages?: number;
}

const AgentClientManagePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAgentClient, setEditingAgentClient] = useState<AgentClient | null>(null);
  const [agentClients, setAgentClients] = useState<AgentClient[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchAgentId, setSearchAgentId] = useState('');
  const [searchClientId, setSearchClientId] = useState('');
  const [form] = Form.useForm();

  // 加载智能体客户端关联列表
  const loadAgentClientList = async (page = currentPage, agentId = searchAgentId, clientId = searchClientId) => {
    setLoading(true);
    try {
      const params: AgentClientQueryParams = {
        pageNum: page,
        pageSize,
      };
      
      // 添加搜索条件
      if (agentId) {
        params.agentId = parseInt(agentId);
      }
      if (clientId) {
        params.clientId = parseInt(clientId);
      }
      
      const response = await queryAgentClientList(params);
      setAgentClients(response.list || []);
      setTotal(response.total || 0);
    } catch (error) {
      console.error('加载智能体客户端关联列表失败:', error);
      message.error('加载智能体客户端关联列表失败');
      setAgentClients([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // 加载所有智能体客户端关联
  const loadAllAgentClient = async () => {
    try {
      const response = await queryAllAgentClient();
      setAgentClients(response.list || []);
      setTotal(response.total || 0);
    } catch (error) {
      console.error('加载所有智能体客户端关联失败:', error);
      message.error('加载所有智能体客户端关联失败');
    }
  };

  // 根据智能体ID查询关联
  const loadAgentClientByAgentId = async (agentId: number) => {
    try {
      const response = await queryAgentClientByAgentId(agentId);
      setAgentClients(response || []);
      setTotal(response.total || 0);
    } catch (error) {
      console.error('根据智能体ID查询关联失败:', error);
      message.error('根据智能体ID查询关联失败');
    }
  };

  // 根据客户端ID查询关联
  const loadAgentClientByClientId = async (clientId: number) => {
    try {
      const response = await queryAgentClientByClientId(clientId);
      setAgentClients(response.list || []);
      setTotal(response.total || 0);
    } catch (error) {
      console.error('根据客户端ID查询关联失败:', error);
      message.error('根据客户端ID查询关联失败');
    }
  };

  // 初始化加载
  useEffect(() => {
    loadAgentClientList();
  }, []);

  // 搜索
  const handleSearch = () => {
    setCurrentPage(1);
    loadAgentClientList(1, searchAgentId, searchClientId);
  };

  // 分页变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadAgentClientList(page, searchAgentId, searchClientId);
  };

  // 显示新增/编辑模态框
  const showModal = (agentClient?: AgentClient) => {
    setEditingAgentClient(agentClient || null);
    setModalVisible(true);
    if (agentClient) {
      form.setFieldsValue({
        agentId: agentClient.agentId,
        clientId: agentClient.clientId,
        status: agentClient.status === 1,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ status: true });
    }
  };

  // 编辑智能体客户端关联
  const handleEdit = async (id: number) => {
    try {
      const response = await queryAgentClientById(id);
      if (response) {
        showModal(response);
      }
    } catch (error) {
      console.error('获取智能体客户端关联信息失败:', error);
      message.error('获取智能体客户端关联信息失败');
    }
  };

  // 保存智能体客户端关联
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const params: AgentClientParams = {
        agentId: values.agentId,
        clientId: values.clientId,
        status: values.status ? 1 : 0,
      };

      if (editingAgentClient) {
        // 编辑
        params.id = editingAgentClient.id;
        await updateAgentClient(params);
        message.success('更新成功');
      } else {
        // 新增
        await addAgentClient(params);
        message.success('添加成功');
      }

      setModalVisible(false);
      loadAgentClientList();
    } catch (error) {
      console.error('保存智能体客户端关联失败:', error);
      message.error('保存智能体客户端关联失败');
    }
  };

  // 删除智能体客户端关联
  const handleDelete = async (id: number) => {
    try {
      await deleteAgentClient(id);
      message.success('删除成功');
      loadAgentClientList();
    } catch (error) {
      console.error('删除智能体客户端关联失败:', error);
      message.error('删除智能体客户端关联失败');
    }
  };

  // 格式化日期
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('zh-CN');
  };

  // 表格列定义
  const columns: ColumnsType<AgentClient> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '智能体ID',
      dataIndex: 'agentId',
      key: 'agentId',
      width: 120,
    },
    {
      title: '客户端ID',
      dataIndex: 'clientId',
      key: 'clientId',
      width: 120,
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
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个关联吗？"
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
          <Title level={4}>智能体客户端关联管理</Title>
        </div>
        
        {/* 搜索和操作栏 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Space>
              <Input
                placeholder="智能体ID"
                value={searchAgentId}
                onChange={(e) => setSearchAgentId(e.target.value)}
                onPressEnter={handleSearch}
                suffix={<SearchOutlined />}
                style={{ width: 150 }}
                type="number"
              />
              <Input
                placeholder="客户端ID"
                value={searchClientId}
                onChange={(e) => setSearchClientId(e.target.value)}
                onPressEnter={handleSearch}
                suffix={<SearchOutlined />}
                style={{ width: 150 }}
                type="number"
              />
            </Space>
          </Col>
          <Col>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                搜索
              </Button>
              <Button 
                onClick={() => {
                  setSearchAgentId('');
                  setSearchClientId('');
                  setCurrentPage(1);
                  loadAgentClientList(1, '', '');
                }}
              >
                重置
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                新增关联
              </Button>
              <Button onClick={loadAllAgentClient}>
                查看所有
              </Button>
            </Space>
          </Col>
        </Row>

        {/* 表格 */}
        <Table
          columns={columns}
          dataSource={agentClients}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: 800 }}
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
        title={editingAgentClient ? '编辑智能体客户端关联' : '新增智能体客户端关联'}
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
            name="agentId"
            label="智能体ID"
            rules={[{ required: true, message: '请输入智能体ID' }]}
          >
            <Input type="number" placeholder="请输入智能体ID" />
          </Form.Item>
          
          <Form.Item
            name="clientId"
            label="客户端ID"
            rules={[{ required: true, message: '请输入客户端ID' }]}
          >
            <Input type="number" placeholder="请输入客户端ID" />
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
    </div>
  );
};

export default AgentClientManagePage;