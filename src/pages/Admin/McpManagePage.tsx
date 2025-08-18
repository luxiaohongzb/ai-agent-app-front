import React, { useState } from 'react';
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
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface McpTool {
  id: number;
  mcpId: string;
  mcpName: string;
  transportType: string;
  transportConfig: string;
  requestTimeout: number;
  status: number;
  createTime: string;
  updateTime: string;
  total?: number;
  pages?: number;
}

const McpManagePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMcp, setEditingMcp] = useState<McpTool | null>(null);
  const [mcpTools, setMcpTools] = useState<McpTool[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchName, setSearchName] = useState('');
  const [form] = Form.useForm();

  // 加载MCP工具列表
  const loadMcpToolList = async (page = currentPage, name = searchName) => {
    setLoading(true);
    try {
      const params: McpToolQueryParams = {
        pageNum: page,
        pageSize,
        mcpName: name || undefined,
      };
      const response = await queryMcpToolList(params);
      if (response && response.list) {
        setMcpTools(response.list);
        setTotal(response.total || 0);
      } else {
        setMcpTools([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('加载MCP工具列表失败:', error);
      message.error('加载MCP工具列表失败');
      setMcpTools([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    loadMcpToolList();
  }, []);

  // 搜索
  const handleSearch = () => {
    setCurrentPage(1);
    loadMcpToolList(1, searchName);
  };

  // 分页变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadMcpToolList(page, searchName);
  };

    // 显示新增/编辑模态框
  const showModal = (mcp?: McpTool) => {
    setEditingMcp(mcp || null);
    form.resetFields();
    if (mcp) {
      form.setFieldsValue({
        mcpId: mcp.mcpId,
        mcpName: mcp.mcpName,
        transportType: mcp.transportType,
        transportConfig: mcp.transportConfig,
        requestTimeout: mcp.requestTimeout,
        status: mcp.status === 1,
      });
    } else {
      form.setFieldsValue({ status: true });
    }
    setModalVisible(true);
  };

  const columns: ColumnsType<McpTool> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'MCP ID',
      dataIndex: 'mcpId',
      key: 'mcpId',
      width: 120,
    },
    {
      title: 'MCP名称',
      dataIndex: 'mcpName',
      key: 'mcpName',
      width: 150,
    },
    {
      title: '传输类型',
      dataIndex: 'transportType',
      key: 'transportType',
      width: 100,
    },
    {
      title: '传输配置',
      dataIndex: 'transportConfig',
      key: 'transportConfig',
      width: 250,
      ellipsis: true,
      render: (text: string) => {
        if (!text) return '-';
        return (
          <div style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {text}
          </div>
        );
      },
    },
    {
      title: '请求超时(分钟)',
      dataIndex: 'requestTimeout',
      key: 'requestTimeout',
      width: 120,
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
            title="确定要删除这个MCP工具吗？"
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
    showModal();
  };

  const handleEdit = async (id: number) => {
    try {
      const response = await queryMcpToolById(id);
      if (response) {
        showModal(response);
      }
    } catch (error) {
      console.error('获取MCP工具详情失败:', error);
      message.error('获取MCP工具详情失败');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMcpTool(id);
      message.success('删除成功');
      loadMcpToolList(currentPage);
    } catch (error) {
      console.error('删除MCP工具失败:', error);
      message.error('删除MCP工具失败');
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const params: McpToolParams = {
        mcpId: values.mcpId,
        mcpName: values.mcpName,
        transportType: values.transportType,
        transportConfig: values.transportConfig,
        requestTimeout: values.requestTimeout,
        status: values.status ? 1 : 0,
      };

      if (editingMcp) {
        // 编辑
        params.id = editingMcp.id;
        await updateMcpTool(params);
        message.success('更新成功');
      } else {
        // 新增
        await addMcpTool(params);
        message.success('创建成功');
      }

      setModalVisible(false);
      loadMcpToolList();
    } catch (error) {
      console.error('保存MCP工具失败:', error);
      message.error('保存MCP工具失败');
    }
  };

  return (
    <div className="p-8 bg-gray-50 h-full">
      <div className="max-w-7xl mx-auto">
        <Title level={1} className="mb-8 text-gray-800 font-bold">
          <ToolOutlined className="mr-3 text-blue-600" style={{ fontSize: '28px' }} />
          MCP工具管理
        </Title>

        <Card>
          <div className="mb-4 flex justify-between items-center">
            <div>
              <Title level={3} className="mb-2">
                配置任意类型的MCP，
              </Title>
              <Title level={4} className="mb-0 text-orange-600">
                动态的使用MCP来构建AI Agent智能体
              </Title>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              size="large"
            >
              新增MCP
            </Button>
          </div>

          <div className="mb-4">
            <Row gutter={16}>
              <Col span={6}>
                <Input
                  placeholder="请输入MCP名称"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  onPressEnter={handleSearch}
                />
              </Col>
              <Col span={6}>
                <Button type="primary" onClick={handleSearch}>
                  <SearchOutlined /> 搜索
                </Button>
              </Col>
            </Row>
          </div>

          <Table
            loading={loading}
            columns={columns}
            dataSource={mcpTools}
            rowKey="id"
            pagination={{
              current: currentPage,
              pageSize,
              total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
              onChange: handlePageChange,
            }}
            scroll={{ x: 1200 }}
          />
        </Card>

        <Modal
          title={editingMcp ? '编辑MCP工具' : '新增MCP工具'}
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
            }}
          >
            <Form.Item
              name="mcpId"
              label="MCP ID"
              rules={[{ required: true, message: '请输入MCP ID' }]}
            >
              <Input placeholder="请输入MCP ID" />
            </Form.Item>

            <Form.Item
              name="mcpName"
              label="MCP名称"
              rules={[{ required: true, message: '请输入MCP名称' }]}
            >
              <Input placeholder="请输入MCP名称" />
            </Form.Item>

            <Form.Item
              name="transportType"
              label="传输类型"
              rules={[{ required: true, message: '请选择传输类型' }]}
            >
              <Select placeholder="请选择传输类型">
                <Option value="sse">SSE</Option>
                <Option value="stdio">STDIO</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="transportConfig"
              label="传输配置"
              rules={[{ required: true, message: '请输入传输配置' }]}
            >
              <TextArea
                rows={6}
                placeholder="请输入JSON格式的传输配置"
              />
            </Form.Item>

            <Form.Item
              name="requestTimeout"
              label="请求超时时间(分钟)"
              rules={[{ required: true, message: '请输入请求超时时间' }]}
            >
              <InputNumber
                min={1}
                max={60}
                placeholder="请输入请求超时时间"
                style={{ width: '100%' }}
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

export default McpManagePage;