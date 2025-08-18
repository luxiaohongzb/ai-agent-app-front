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
  queryClientModelList,
  addClientModel,
  updateClientModel,
  deleteClientModel,
  queryClientModelById,
  ClientModelParams,
  ClientModelQueryParams,
} from '../../services/adminService';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface ClientModel {
  id: number;
  modelName: string;
  description?: string;
  status: number;
  createTime: string;
  updateTime: string;
  total?: number;
  pages?: number;
}

const ClientModelManagePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingModel, setEditingModel] = useState<ClientModel | null>(null);
  const [models, setModels] = useState<ClientModel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchName, setSearchName] = useState('');
  const [form] = Form.useForm();

  // 加载客户端模型列表
  const loadClientModelList = async (page = currentPage, name = searchName) => {
    setLoading(true);
    try {
      const params: ClientModelQueryParams = {
        pageNum: page,
        pageSize,
        modelName: name || undefined,
      };
      const response = await queryClientModelList(params);
      if (response && response.list) {
        setModels(response.list);
        setTotal(response.total || 0);
      } else {
        setModels([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('加载客户端模型列表失败:', error);
      message.error('加载客户端模型列表失败');
      setModels([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    loadClientModelList();
  }, []);

  // 搜索
  const handleSearch = () => {
    setCurrentPage(1);
    loadClientModelList(1, searchName);
  };

  // 分页变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadClientModelList(page, searchName);
  };

  // 显示新增/编辑模态框
  const showModal = (model?: ClientModel) => {
    setEditingModel(model || null);
    setModalVisible(true);
    if (model) {
      form.setFieldsValue({
        modelName: model.modelName,
        description: model.description,
        status: model.status === 1,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ status: true });
    }
  };

  // 编辑客户端模型
  const handleEdit = async (id: number) => {
    try {
      const response = await queryClientModelById(id);
      if (response) {
        showModal(response);
      }
    } catch (error) {
      console.error('获取客户端模型信息失败:', error);
      message.error('获取客户端模型信息失败');
    }
  };

  // 保存客户端模型
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const params: ClientModelParams = {
        modelName: values.modelName,
        description: values.description,
        status: values.status ? 1 : 0,
      };

      if (editingModel) {
        // 编辑
        params.id = editingModel.id;
        await updateClientModel(params);
        message.success('更新成功');
      } else {
        // 新增
        await addClientModel(params);
        message.success('添加成功');
      }

      setModalVisible(false);
      loadClientModelList();
    } catch (error) {
      console.error('保存客户端模型失败:', error);
      message.error('保存客户端模型失败');
    }
  };

  // 删除客户端模型
  const handleDelete = async (id: number) => {
    try {
      await deleteClientModel(id);
      message.success('删除成功');
      loadClientModelList();
    } catch (error) {
      console.error('删除客户端模型失败:', error);
      message.error('删除客户端模型失败');
    }
  };

  // 格式化日期
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('zh-CN');
  };

  // 表格列定义
  const columns: ColumnsType<ClientModel> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '模型名称',
      dataIndex: 'modelName',
      key: 'modelName',
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
            title="确定要删除这个客户端模型吗？"
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
          <Title level={4}>客户端模型管理</Title>
        </div>
        
        {/* 搜索和操作栏 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Input
              placeholder="请输入模型名称"
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
                新增模型
              </Button>
            </Space>
          </Col>
        </Row>

        {/* 表格 */}
        <Table
          columns={columns}
          dataSource={models}
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
        title={editingModel ? '编辑客户端模型' : '新增客户端模型'}
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
            name="modelName"
            label="模型名称"
            rules={[{ required: true, message: '请输入模型名称' }]}
          >
            <Input placeholder="请输入模型名称" />
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
    </div>
  );
};

export default ClientModelManagePage;