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
  queryRagOrderList,
  addRagOrder,
  updateRagOrder,
  deleteRagOrder,
  queryRagOrderById,
  RagOrderParams,
  RagOrderQueryParams,
} from '../../services/adminService';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface RagOrder {
  id: number;
  orderId: string;
  description?: string;
  status: number;
  createTime: string;
  updateTime: string;
  total?: number;
  pages?: number;
}

const RagOrderManagePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState<RagOrder | null>(null);
  const [orders, setOrders] = useState<RagOrder[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchOrderId, setSearchOrderId] = useState('');
  const [form] = Form.useForm();

  // 加载RAG订单列表
  const loadRagOrderList = async (page = currentPage, orderId = searchOrderId) => {
    setLoading(true);
    try {
      const params: RagOrderQueryParams = {
        pageNum: page,
        pageSize,
        orderId: orderId || undefined,
      };
      const response = await queryRagOrderList(params);
      if (response && response.list) {
        setOrders(response.list);
        setTotal(response.total || 0);
      } else {
        setOrders([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('加载RAG订单列表失败:', error);
      message.error('加载RAG订单列表失败');
      setOrders([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    loadRagOrderList();
  }, []);

  // 搜索
  const handleSearch = () => {
    setCurrentPage(1);
    loadRagOrderList(1, searchOrderId);
  };

  // 分页变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadRagOrderList(page, searchOrderId);
  };

  // 显示新增/编辑模态框
  const showModal = (order?: RagOrder) => {
    setEditingOrder(order || null);
    setModalVisible(true);
    if (order) {
      form.setFieldsValue({
        orderId: order.orderId,
        description: order.description,
        status: order.status === 1,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ status: true });
    }
  };

  // 编辑RAG订单
  const handleEdit = async (id: number) => {
    try {
      const response = await queryRagOrderById(id);
      if (response) {
        showModal(response);
      }
    } catch (error) {
      console.error('获取RAG订单信息失败:', error);
      message.error('获取RAG订单信息失败');
    }
  };

  // 保存RAG订单
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const params: RagOrderParams = {
        orderId: values.orderId,
        description: values.description,
        status: values.status ? 1 : 0,
      };

      if (editingOrder) {
        // 编辑
        params.id = editingOrder.id;
        await updateRagOrder(params);
        message.success('更新成功');
      } else {
        // 新增
        await addRagOrder(params);
        message.success('添加成功');
      }

      setModalVisible(false);
      loadRagOrderList();
    } catch (error) {
      console.error('保存RAG订单失败:', error);
      message.error('保存RAG订单失败');
    }
  };

  // 删除RAG订单
  const handleDelete = async (id: number) => {
    try {
      await deleteRagOrder(id);
      message.success('删除成功');
      loadRagOrderList();
    } catch (error) {
      console.error('删除RAG订单失败:', error);
      message.error('删除RAG订单失败');
    }
  };

  // 格式化状态
  const formatStatus = (status: number) => {
    const statusMap: { [key: number]: { text: string; color: string } } = {
      0: { text: '禁用', color: 'error' },
      1: { text: '启用', color: 'success' },
      2: { text: '处理中', color: 'processing' },
      3: { text: '已完成', color: 'success' },
      4: { text: '已取消', color: 'default' },
    };
    const statusInfo = statusMap[status] || { text: '未知', color: 'default' };
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
  };

  // 格式化日期
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('zh-CN');
  };

  // 表格列定义
  const columns: ColumnsType<RagOrder> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '订单ID',
      dataIndex: 'orderId',
      key: 'orderId',
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
      render: formatStatus,
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
            title="确定要删除这个RAG订单吗？"
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
          <Title level={4}>RAG订单管理</Title>
        </div>
        
        {/* 搜索和操作栏 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Input
              placeholder="请输入订单ID"
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
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
                新增订单
              </Button>
            </Space>
          </Col>
        </Row>

        {/* 表格 */}
        <Table
          columns={columns}
          dataSource={orders}
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
        title={editingOrder ? '编辑RAG订单' : '新增RAG订单'}
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
            name="orderId"
            label="订单ID"
            rules={[{ required: true, message: '请输入订单ID' }]}
          >
            <Input placeholder="请输入订单ID" />
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

export default RagOrderManagePage;