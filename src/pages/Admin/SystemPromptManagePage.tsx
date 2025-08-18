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
  querySystemPromptList,
  addSystemPrompt,
  updateSystemPrompt,
  deleteSystemPrompt,
  querySystemPromptById,
  SystemPromptParams,
  SystemPromptQueryParams,
} from '../../services/adminService';

const { Title } = Typography;
const { TextArea } = Input;

interface SystemPrompt {
  id: number;
  promptName: string;
  promptContent?: string;
  description?: string;
  status: number;
  createTime: string;
  updateTime: string;
  total?: number;
  pages?: number;
}

const SystemPromptManagePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<SystemPrompt | null>(null);
  const [prompts, setPrompts] = useState<SystemPrompt[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchName, setSearchName] = useState('');
  const [form] = Form.useForm();

  // 加载系统提示词列表
  const loadSystemPromptList = async (page = currentPage, name = searchName) => {
    setLoading(true);
    try {
      const params: SystemPromptQueryParams = {
        pageNum: page,
        pageSize,
        promptName: name || undefined,
      };
      const response = await querySystemPromptList(params);
      if (response && response.list) {
        setPrompts(response.list);
        setTotal(response.total || 0);
      } else {
        setPrompts([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('加载系统提示词列表失败:', error);
      message.error('加载系统提示词列表失败');
      setPrompts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    loadSystemPromptList();
  }, []);

  // 搜索
  const handleSearch = () => {
    setCurrentPage(1);
    loadSystemPromptList(1, searchName);
  };

  // 分页变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadSystemPromptList(page, searchName);
  };

  // 显示新增/编辑模态框
  const showModal = (prompt?: SystemPrompt) => {
    setEditingPrompt(prompt || null);
    setModalVisible(true);
    if (prompt) {
      form.setFieldsValue({
        promptName: prompt.promptName,
        promptContent: prompt.promptContent,
        description: prompt.description,
        status: prompt.status === 1,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ status: true });
    }
  };

  // 编辑系统提示词
  const handleEdit = async (id: number) => {
    try {
      const response = await querySystemPromptById(id);
      if (response) {
        showModal(response);
      }
    } catch (error) {
      console.error('获取系统提示词信息失败:', error);
      message.error('获取系统提示词信息失败');
    }
  };

  // 保存系统提示词
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const params: SystemPromptParams = {
        promptName: values.promptName,
        promptContent: values.promptContent,
        description: values.description,
        status: values.status ? 1 : 0,
      };

      if (editingPrompt) {
        // 编辑
        params.id = editingPrompt.id;
        await updateSystemPrompt(params);
        message.success('更新成功');
      } else {
        // 新增
        await addSystemPrompt(params);
        message.success('添加成功');
      }

      setModalVisible(false);
      loadSystemPromptList();
    } catch (error) {
      console.error('保存系统提示词失败:', error);
      message.error('保存系统提示词失败');
    }
  };

  // 删除系统提示词
  const handleDelete = async (id: number) => {
    try {
      await deleteSystemPrompt(id);
      message.success('删除成功');
      loadSystemPromptList();
    } catch (error) {
      console.error('删除系统提示词失败:', error);
      message.error('删除系统提示词失败');
    }
  };

  // 格式化日期
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('zh-CN');
  };

  const columns: ColumnsType<SystemPrompt> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '提示词名称',
      dataIndex: 'promptName',
      key: 'promptName',
      width: 200,
    },
    {
      title: '提示词内容',
      dataIndex: 'promptContent',
      key: 'promptContent',
      width: 300,
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
            title="确定要删除这个系统提示词吗？"
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
              系统提示词管理
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              新增系统提示词
            </Button>
          </div>
        }
      >
        <div className="mb-4">
          <Row gutter={16}>
            <Col span={8}>
              <Input
                placeholder="请输入提示词名称"
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
          dataSource={prompts}
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
        title={editingPrompt ? '编辑系统提示词' : '新增系统提示词'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: true }}
        >
          <Form.Item
            name="promptName"
            label="提示词名称"
            rules={[{ required: true, message: '请输入提示词名称' }]}
          >
            <Input placeholder="请输入提示词名称" />
          </Form.Item>

          <Form.Item
            name="promptContent"
            label="提示词内容"
            rules={[{ required: true, message: '请输入提示词内容' }]}
          >
            <TextArea rows={6} placeholder="请输入提示词内容" />
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

export default SystemPromptManagePage;