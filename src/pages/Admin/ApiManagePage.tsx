import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Tag,
  DatePicker,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  queryClientApiList,
  addClientApi,
  updateClientApi,
  deleteClientApi,
  queryClientApiById,
  ApiConfig,
  ApiConfigQueryParams,
} from '../../services/adminService';
import type { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const ApiManagePage: React.FC = () => {
  const [apis, setApis] = useState<ApiConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingApi, setEditingApi] = useState<ApiConfig | null>(null);
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useState<ApiConfigQueryParams>({
    pageNum: 1,
    pageSize: 10,
  });
  const [total, setTotal] = useState(0);
  const [apiKeyVisible, setApiKeyVisible] = useState<{[key: number]: boolean}>({});

  // 加载API列表
  const loadApis = async () => {
    try {
      setLoading(true);
      const response = await queryClientApiList(searchParams);
      if (response && response.list) {
        setApis(response.list || []);
        setTotal(response.total || 0);
      }
    } catch (error) {
      message.error('加载API列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApis();
  }, [searchParams]);

  // 处理搜索
  const handleSearch = (values: any) => {
    setSearchParams({
      ...searchParams,
      pageNum: 1,
      apiId: values.apiId,
      status: values.status,
      createTimeStart: values.create_time?.[0]?.format('YYYY-MM-DD HH:mm:ss'),
      createTimeEnd: values.create_time?.[1]?.format('YYYY-MM-DD HH:mm:ss'),
    });
  };

  // 处理分页变化
  const handleTableChange = (pagination: any) => {
    setSearchParams({
      ...searchParams,
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  // 处理新增
  const handleAdd = () => {
    setEditingApi(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 处理编辑
  const handleEdit = async (record: ApiConfig) => {
    try {
      const response = await queryClientApiById(record.id);
      if (response.data) {
        setEditingApi(response.data);
        form.setFieldsValue(response.data);
        setModalVisible(true);
      }
    } catch (error) {
      message.error('加载API详情失败');
    }
  };

  // 处理删除
  const handleDelete = async (id: number) => {
    try {
      await deleteClientApi(id);
      message.success('删除成功');
      loadApis();
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 处理保存
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingApi) {
        await updateClientApi({ ...values, id: editingApi.id });
        message.success('更新成功');
      } else {
        await addClientApi(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      loadApis();
    } catch (error) {
      message.error('保存失败');
    }
  };

  // 切换 API Key 可见性
  const toggleApiKeyVisibility = (id: number) => {
    setApiKeyVisible(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // 表格列定义
  const columns: ColumnsType<ApiConfig> = [
    {
      title: 'API ID',
      dataIndex: 'apiId',
      key: 'apiId',
    },
    {
      title: '基础URL',
      dataIndex: 'baseUrl',
      key: 'baseUrl',
    },
    {
      title: 'API密钥',
      dataIndex: 'apiKey',
      key: 'apiKey',
      render: (text: string, record: ApiConfig) => (
        <Space>
          <span>
            {apiKeyVisible[record.id] ? text : '••••••••'}
          </span>
          <Button
            type="link"
            icon={apiKeyVisible[record.id] ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            onClick={() => toggleApiKeyVisibility(record.id)}
          />
        </Space>
      ),
    },
    {
      title: '对话补全路径',
      dataIndex: 'completionsPath',
      key: 'completionsPath',
    },
    {
      title: '嵌入向量路径',
      dataIndex: 'embeddingsPath',
      key: 'embeddingsPath',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
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
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个API配置吗？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Form layout="inline" onFinish={handleSearch}>
          <Form.Item name="apiId">
            <Input placeholder="API ID" allowClear />
          </Form.Item>
          <Form.Item name="status">
            <Select
              placeholder="状态"
              allowClear
              style={{ width: 120 }}
            >
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="create_time">
            <RangePicker
              showTime
              style={{ width: 380 }}
              placeholder={['开始时间', '结束时间']}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Form.Item>
        </Form>
      </div>

      <Table
        columns={columns}
        dataSource={apis}
        rowKey="id"
        loading={loading}
        pagination={{
          current: searchParams.pageNum,
          pageSize: searchParams.pageSize,
          total: total,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        onChange={handleTableChange}
      />

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAdd}
        style={{ marginTop: 16 }}
      >
        新增API配置
      </Button>

      <Modal
        title={editingApi ? '编辑API配置' : '新增API配置'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="apiId"
            label="API ID"
            rules={[{ required: true, message: '请输入API ID' }]}
          >
            <Input placeholder="请输入API ID" />
          </Form.Item>
          <Form.Item
            name="baseUrl"
            label="基础URL"
            rules={[{ required: true, message: '请输入基础URL' }]}
          >
            <Input placeholder="请输入基础URL" />
          </Form.Item>
          <Form.Item
            name="apiKey"
            label="API密钥"
            rules={[{ required: true, message: '请输入API密钥' }]}
          >
            <Input.Password placeholder="请输入API密钥" />
          </Form.Item>
          <Form.Item
            name="completionsPath"
            label="对话补全路径"
            rules={[{ required: true, message: '请输入对话补全路径' }]}
          >
            <Input placeholder="请输入对话补全路径" />
          </Form.Item>
          <Form.Item
            name="embeddingsPath"
            label="嵌入向量路径"
            rules={[{ required: true, message: '请输入嵌入向量路径' }]}
          >
            <Input placeholder="请输入嵌入向量路径" />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ApiManagePage;