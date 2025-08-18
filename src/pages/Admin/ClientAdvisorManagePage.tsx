import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
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
  queryClientAdvisorList,
  addClientAdvisor,
  updateClientAdvisor,
  deleteClientAdvisor,
  queryClientAdvisorById,
  ClientAdvisorParams,
  ClientAdvisorQueryParams,
} from '../../services/adminService';

const { Title } = Typography;
const { TextArea } = Input;

interface ClientAdvisor {
  id: number;
  advisorName: string;
  description?: string;
  status: number;
  createTime: string;
  updateTime: string;
  total?: number;
  pages?: number;
}

const ClientAdvisorManagePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAdvisor, setEditingAdvisor] = useState<ClientAdvisor | null>(null);
  const [advisors, setAdvisors] = useState<ClientAdvisor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchName, setSearchName] = useState('');
  const [form] = Form.useForm();

  // 加载客户端顾问列表
  const loadClientAdvisorList = async (page = currentPage, name = searchName) => {
    setLoading(true);
    try {
      const params: ClientAdvisorQueryParams = {
        pageNum: page,
        pageSize,
        advisorName: name || undefined,
      };
      const response = await queryClientAdvisorList(params);
      if (response && response.list) {
        setAdvisors(response.list);
        setTotal(response.total || 0);
      } else {
        setAdvisors([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('加载客户端顾问列表失败:', error);
      message.error('加载客户端顾问列表失败');
      setAdvisors([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    loadClientAdvisorList();
  }, []);

  // 搜索
  const handleSearch = () => {
    setCurrentPage(1);
    loadClientAdvisorList(1, searchName);
  };

  // 分页变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadClientAdvisorList(page, searchName);
  };

  // 显示新增/编辑模态框
  const showModal = (advisor?: ClientAdvisor) => {
    setEditingAdvisor(advisor || null);
    setModalVisible(true);
    if (advisor) {
      form.setFieldsValue({
        advisorName: advisor.advisorName,
        description: advisor.description,
        status: advisor.status === 1,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ status: true });
    }
  };

  // 编辑客户端顾问
  const handleEdit = async (id: number) => {
    try {
      const response = await queryClientAdvisorById(id);
      if (response) {
        showModal(response);
      }
    } catch (error) {
      console.error('获取客户端顾问信息失败:', error);
      message.error('获取客户端顾问信息失败');
    }
  };

  // 保存客户端顾问
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const params: ClientAdvisorParams = {
        advisorName: values.advisorName,
        description: values.description,
        status: values.status ? 1 : 0,
      };

      if (editingAdvisor) {
        // 编辑
        params.id = editingAdvisor.id;
        await updateClientAdvisor(params);
        message.success('更新成功');
      } else {
        // 新增
        await addClientAdvisor(params);
        message.success('添加成功');
      }

      setModalVisible(false);
      loadClientAdvisorList();
    } catch (error) {
      console.error('保存客户端顾问失败:', error);
      message.error('保存客户端顾问失败');
    }
  };

  // 删除客户端顾问
  const handleDelete = async (id: number) => {
    try {
      await deleteClientAdvisor(id);
      message.success('删除成功');
      loadClientAdvisorList();
    } catch (error) {
      console.error('删除客户端顾问失败:', error);
      message.error('删除客户端顾问失败');
    }
  };

  // 格式化日期
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('zh-CN');
  };

  const columns: ColumnsType<ClientAdvisor> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '顾问名称',
      dataIndex: 'advisorName',
      key: 'advisorName',
      width: 200,
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
            title="确定要删除这个客户端顾问吗？"
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
              客户端顾问管理
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              新增客户端顾问
            </Button>
          </div>
        }
      >
        <div className="mb-4">
          <Row gutter={16}>
            <Col span={8}>
              <Input
                placeholder="请输入顾问名称"
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
          dataSource={advisors}
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
        title={editingAdvisor ? '编辑客户端顾问' : '新增客户端顾问'}
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
            name="advisorName"
            label="顾问名称"
            rules={[{ required: true, message: '请输入顾问名称' }]}
          >
            <Input placeholder="请输入顾问名称" />
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

export default ClientAdvisorManagePage;