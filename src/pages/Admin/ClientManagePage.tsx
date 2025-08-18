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
  InputNumber,
  Tabs,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
  ApiOutlined,
  DatabaseOutlined,
  ToolOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { 
  queryClientAdvisorConfigList, 
  addClientAdvisorConfig, 
  updateClientAdvisorConfig, 
  deleteClientAdvisorConfig,
  queryClientModelList as queryClientModelConfigList, 
  addClientModel as addClientModelConfig, 
  updateClientModel as updateClientModelConfig, 
  deleteClientModel as deleteClientModelConfig,
  queryToolConfigList, 
  addToolConfig, 
  updateToolConfig, 
  deleteToolConfig 
} from '../../services/adminService';



const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

interface ClientConfig {
  id: number;
  configName: string;
  configValue: string;
  description?: string;
  status: number;
  createTime: string;
  updateTime: string;
  total?: number;
  pages?: number;
}

interface ConfigQueryParams {
  pageNum: number;
  pageSize: number;
  configName?: string;
}

const ClientConfigPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('advisor');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingConfig, setEditingConfig] = useState<ClientConfig | null>(null);
  const [configs, setConfigs] = useState<ClientConfig[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchName, setSearchName] = useState('');
  const [form] = Form.useForm();

  // 加载配置列表
  const loadConfigList = async (page = currentPage, name = searchName) => {
    setLoading(true);
    try {
      const params: ConfigQueryParams = {
        pageNum: page,
        pageSize,
        configName: name || undefined,
      };
      
      let response;
      switch (activeTab) {
        case 'advisor':
          response = await queryClientAdvisorConfigList(params);
          break;
        case 'model':
          response = await queryClientModelConfigList(params);
          break;
        case 'tool':
          response = await queryToolConfigList(params);
          break;
        default:
          response = { list: [], total: 0, pages: 0, pageNum: 1, hasNextPage: false, hasPreviousPage: false };
      }

      if (response && response.list) {
        setConfigs(response.list);
        setTotal(response.total || 0);
        setCurrentPage(response.pageNum || 1);
      } else {
        setConfigs([]);
        setTotal(0);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('加载配置列表失败:', error);
      message.error('加载配置列表失败');
      setConfigs([]);
      setTotal(0);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    loadConfigList();
  }, [activeTab]);

  // 搜索
  const handleSearch = () => {
    setCurrentPage(1);
    loadConfigList(1, searchName);
  };

  // 分页变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadConfigList(page, searchName);
  };

  

  // 搜索框和按钮
  const SearchBar = () => (
    <div className="mb-4 flex items-center gap-4">
      <Input
        placeholder="请输入配置名称"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        onPressEnter={handleSearch}
        style={{ width: 200 }}
      />
      <Button type="primary" onClick={handleSearch}>
        搜索
      </Button>
    </div>
  );

  const columns: ColumnsType<ClientConfig> = [
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
      title: '配置内容',
      dataIndex: 'configValue',
      key: 'configValue',
      ellipsis: true,
      width: 300,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: 200,
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
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个配置吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingConfig(null);
    form.resetFields();
    form.setFieldsValue({ type: activeTab, status: 'enabled' });
    setModalVisible(true);
  };

  const handleEdit = (config: ClientConfig) => {
    setEditingConfig(config);
    form.setFieldsValue({
      configName: config.configName,
      configValue: config.configValue,
      description: config.description,
      status: config.status === 1
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      let response;
      switch (activeTab) {
        case 'advisor':
          response = await deleteClientAdvisorConfig(id);
          break;
        case 'model':
          response = await deleteClientModelConfig(id);
          break;
        case 'tool':
          response = await deleteToolConfig(id);
          break;
        default:
          return;
      }
      message.success('删除成功');
      loadConfigList(currentPage, searchName);
    } catch (error) {
      console.error('删除配置失败:', error);
      message.error('删除配置失败');
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const params = {
        configName: values.configName,
        configValue: values.configValue,
        description: values.description,
        status: values.status ? 1 : 0,
      };
      
      if (editingConfig) {
        // 编辑
        const updateParams = { ...params, id: editingConfig.id };
        switch (activeTab) {
          case 'advisor':
            await updateClientAdvisorConfig(updateParams);
            break;
          case 'model':
            await updateClientModelConfig(updateParams);
            break;
          case 'tool':
            await updateToolConfig(updateParams);
            break;
          default:
            return;
        }
        message.success('更新成功');
      } else {
        // 新增
        switch (activeTab) {
          case 'advisor':
            await addClientAdvisorConfig(params);
            break;
          case 'model':
            await addClientModelConfig(params);
            break;
          case 'tool':
            await addToolConfig(params);
            break;
          default:
            return;
        }
        message.success('创建成功');
      }
      
      setModalVisible(false);
      loadConfigList(currentPage, searchName);
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败');
    }
  };

  const getTabIcon = (type: string) => {
    switch (type) {
      case 'advisor':
        return <ApiOutlined />;
      case 'model':
        return <DatabaseOutlined />;
      case 'tool':
        return <ToolOutlined />;
      default:
        return <SettingOutlined />;
    }
  };

  const getTabTitle = (type: string) => {
    switch (type) {
      case 'advisor':
        return '顾问配置';
      case 'model':
        return '模型配置';
      case 'tool':
        return '工具配置';
      default:
        return '配置';
    }
  };

  return (
    <div className="p-8 bg-gray-50 h-full">
      <div className="max-w-7xl mx-auto">
        <Title level={1} className="mb-8 text-gray-800 font-bold">
          <SettingOutlined className="mr-3 text-blue-600" style={{ fontSize: '28px' }} />
          客户端配置管理
        </Title>

        <Card>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane
              tab={
                <span>
                  <ApiOutlined />
                  顾问配置
                </span>
              }
              key="advisor"
            >
              <div className="mb-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <Title level={3} className="mb-2">
                      AI顾问配置管理
                    </Title>
                    <Title level={4} className="mb-0 text-orange-600">
                      配置不同的AI模型作为智能顾问
                    </Title>
                  </div>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                    size="large"
                  >
                    新增配置
                  </Button>
                </div>
                <SearchBar />
              </div>

              <Table
                columns={columns}
                dataSource={configs}
                rowKey="id"
                loading={loading}
                pagination={{
                  current: currentPage,
                  pageSize,
                  total,
                  onChange: handlePageChange,
                  showSizeChanger: false,
                  showQuickJumper: true,
                  showTotal: (total) => `共 ${total} 条记录`,
                  hideOnSinglePage: true
                }}
                scroll={{ x: 1300 }}
              />
            </TabPane>

            <TabPane
              tab={
                <span>
                  <DatabaseOutlined />
                  模型配置
                </span>
              }
              key="model"
            >
              <div className="mb-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <Title level={3} className="mb-2">
                      AI模型配置管理
                    </Title>
                    <Title level={4} className="mb-0 text-orange-600">
                      配置嵌入模型、语音模型等专用模型
                    </Title>
                  </div>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                    size="large"
                  >
                    新增配置
                  </Button>
                </div>
                <SearchBar />
              </div>

              <Table
                columns={columns}
                dataSource={configs}
                rowKey="id"
                loading={loading}
                pagination={{
                  current: currentPage,
                  pageSize,
                  total,
                  onChange: handlePageChange,
                  showSizeChanger: false,
                  showQuickJumper: true,
                  showTotal: (total) => `共 ${total} 条记录`,
                  hideOnSinglePage: true
                }}
                scroll={{ x: 1400 }}
              />
            </TabPane>

            <TabPane
              tab={
                <span>
                  <ToolOutlined />
                  工具配置
                </span>
              }
              key="tool"
            >
              <div className="mb-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <Title level={3} className="mb-2">
                      工具配置管理
                    </Title>
                    <Title level={4} className="mb-0 text-orange-600">
                      配置搜索、API调用等外部工具
                    </Title>
                  </div>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                    size="large"
                  >
                    新增配置
                  </Button>
                </div>
                <SearchBar />
              </div>

              <Table
                columns={columns}
                dataSource={configs}
                rowKey="id"
                loading={loading}
                pagination={{
                  current: currentPage,
                  pageSize,
                  total,
                  onChange: handlePageChange,
                  showSizeChanger: false,
                  showQuickJumper: true,
                  showTotal: (total) => `共 ${total} 条记录`,
                  hideOnSinglePage: true
                }}
                scroll={{ x: 1400 }}
              />
            </TabPane>
          </Tabs>
        </Card>

        <Modal
          title={`${editingConfig ? '编辑' : '新增'}${getTabTitle(activeTab)}`}
          open={modalVisible}
          onOk={handleSave}
          onCancel={() => setModalVisible(false)}
          width={700}
          okText="保存"
          cancelText="取消"
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              status: true,
              type: activeTab,
            }}
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
              label="配置内容"
              rules={[{ required: true, message: '请输入配置内容' }]}
            >
              <TextArea
                rows={8}
                placeholder="请输入JSON格式的配置内容"
                showCount
                maxLength={1000}
              />
            </Form.Item>

            <Form.Item
              name="description"
              label="描述"
            >
              <TextArea
                rows={3}
                placeholder="请输入配置描述信息"
                showCount
                maxLength={200}
              />
            </Form.Item>

            <Form.Item
              name="status"
              label="状态"
              valuePropName="checked"
            >
              <Switch
                checkedChildren="启用"
                unCheckedChildren="禁用"
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ClientConfigPage;