import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
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
  queryClientAdvisorConfigList,
  addClientAdvisorConfig,
  updateClientAdvisorConfig,
  deleteClientAdvisorConfig,
  queryClientAdvisorConfigById,
  ClientAdvisorConfigParams,
  ClientAdvisorConfigQueryParams,
} from '../../services/adminService';

const { Title } = Typography;
const { TextArea } = Input;

interface ClientAdvisorConfig {
  id: number;
  configName: string;
  configValue?: string;
  description?: string;
  status: number;
  createTime: string;
  updateTime: string;
  total?: number;
  pages?: number;
}

const ClientAdvisorConfigManagePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingConfig, setEditingConfig] = useState<ClientAdvisorConfig | null>(null);
  const [configs, setConfigs] = useState<ClientAdvisorConfig[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchName, setSearchName] = useState('');
  const [form] = Form.useForm();

  // 加载客户端顾问配置列表
  const loadClientAdvisorConfigList = async (page = currentPage, name = searchName) => {
    setLoading(true);
    try {
      const params: ClientAdvisorConfigQueryParams = {
        pageNum: page,
        pageSize,
        configName: name || undefined,
      };
      const response = await queryClientAdvisorConfigList(params);
      if (response && response.list) {
        setConfigs(response.list);
        setTotal(response.total || 0);
      } else {
        setConfigs([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('加载客户端顾问配置列表失败:', error);
      message.error('加载客户端顾问配置列表失败');
      setConfigs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    loadClientAdvisorConfigList();
  }, []);

  // 搜索
  const handleSearch = () => {
    setCurrentPage(1);
    loadClientAdvisorConfigList(1, searchName);
  };

  // 分页变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadClientAdvisorConfigList(page, searchName);
  };

  // 显示新增/编辑模态框
  const showModal = (config?: ClientAdvisorConfig) => {
    setEditingConfig(config || null);
    setModalVisible(true);
    if (config) {
      form.setFieldsValue({
        configName: config.configName,
        configValue: config.configValue,
        description: config.description,
        status: config.status === 1,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ status: true });
    }
  };

  // 编辑客户端顾问配置
  const handleEdit = async (id: number) => {
    try {
      const response = await queryClientAdvisorConfigById(id);
      if (response) {
        showModal(response);
      }
    } catch (error) {
      console.error('获取客户端顾问配置信息失败:', error);
      message.error('获取客户端顾问配置信息失败');
    }
  };

  // 保存客户端顾问配置
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const params: ClientAdvisorConfigParams = {
        configName: values.configName,
        configValue: values.configValue,
        description: values.description,
        status: values.status ? 1 : 0,
      };

      if (editingConfig) {
        // 编辑
        params.id = editingConfig.id;
        await updateClientAdvisorConfig(params);
        message.success('更新成功');
      } else {
        // 新增
        await addClientAdvisorConfig(params);
        message.success('添加成功');
      }

      setModalVisible(false);
      loadClientAdvisorConfigList();
    } catch (error) {
      console.error('保存客户端顾问配置失败:', error);
      message.error('保存客户端顾问配置失败');
    }
  };

  // 删除客户端顾问配置
  const handleDelete = async (id: number) => {
    try {
      await deleteClientAdvisorConfig(id);
      message.success('删除成功');
      loadClientAdvisorConfigList();
    } catch (error) {
      console.error('删除客户端顾问配置失败:', error);
      message.error('删除客户端顾问配置失败');
    }
  };

  // 格式化日期
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('zh-CN');
  };

  const columns: ColumnsType<ClientAdvisorConfig> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '配置名称',
      dataIndex: 'configName',
      key: 'configName',
      width: 200,
    },
    {
      title: '配置值',
      dataIndex: 'configValue',
      key: 'configValue',
      width: 200,
      ellipsis: true,
      render: (text: string) => text || '-',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string) => text || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      render: (text: string) => formatDate(text),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个配置吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    showModal();
  };

  return (
    <div>
      <Card
        title={
          <div className="flex items-center justify-between">
            <Title level={4} className="mb-0">
              客户端顾问配置管理
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              新增配置
            </Button>
          </div>
        }
      >
        <div className="mb-4">
          <Row gutter={16}>
            <Col span={8}>
              <Input
                placeholder="请输入配置名称"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                onPressEnter={handleSearch}
                prefix={<SearchOutlined />}
              />
            </Col>
            <Col span={4}>
              <Button type="primary" onClick={handleSearch}>
                搜索
              </Button>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={configs}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: 1200 }}
        />

        <div className="mt-4 text-right">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={handlePageChange}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total) => `共 ${total} 条记录`}
          />
        </div>
      </Card>

      {/* 新增/编辑模态框 */}
      <Modal
        title={editingConfig ? '编辑客户端顾问配置' : '新增客户端顾问配置'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: true }}
        >
          <Form.Item
            name="configName"
            label="配置名称"
            rules={[{ required: true, message: '请输入配置名称' }]}
          >
            <Input placeholder="请输入配置名称" />
          </Form.Item>

          <Form.Item
            name="configValue"
            label="配置值"
          >
            <TextArea rows={3} placeholder="请输入配置值" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <TextArea rows={3} placeholder="请输入描述" />
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

export default ClientAdvisorConfigManagePage;