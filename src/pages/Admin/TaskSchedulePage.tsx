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
  PlayCircleOutlined,
  PauseCircleOutlined,
  ClockCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  queryTaskScheduleList,
  addTaskSchedule,
  updateTaskSchedule,
  deleteTaskSchedule,
  queryTaskScheduleById,
  TaskScheduleParams,
  TaskScheduleQueryParams,
} from '../../services/adminService';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface TaskSchedule {
  id: number;
  taskName: string;
  agentId: number;
  description?: string;
  taskParam?: string;
  cronExpression?: string;
  status: number;
  createTime: string;
  updateTime: string;
  total?: number;
  pages?: number;
}

const TaskSchedulePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskSchedule | null>(null);
  const [tasks, setTasks] = useState<TaskSchedule[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchName, setSearchName] = useState('');
  const [form] = Form.useForm();

  // 加载任务调度列表
  const loadTaskScheduleList = async (page = currentPage, name = searchName) => {
    setLoading(true);
    try {
      const params: TaskScheduleQueryParams = {
        pageNum: page,
        pageSize,
        taskName: name || undefined,
      };
      const response = await queryTaskScheduleList(params);
      if (response && response.list) {
        setTasks(response.list);
        setTotal(response.total || 0);
      } else {
        setTasks([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('加载任务调度列表失败:', error);
      message.error('加载任务调度列表失败');
      setTasks([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    loadTaskScheduleList();
  }, []);

  // 搜索
  const handleSearch = () => {
    setCurrentPage(1);
    loadTaskScheduleList(1, searchName);
  };

  // 分页变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadTaskScheduleList(page, searchName);
  };

  // 显示新增/编辑模态框
  const showModal = (task?: TaskSchedule) => {
    setEditingTask(task || null);
    setModalVisible(true);
    if (task) {
      form.setFieldsValue({
        taskName: task.taskName,
        agentId: task.agentId,
        description: task.description,
        taskParam: task.taskParam,
        cronExpression: task.cronExpression,
        status: task.status === 1,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ status: true });
    }
  };

  // 编辑任务调度
  const handleEdit = async (id: number) => {
    try {
      const response = await queryTaskScheduleById(id);
      if (response) {
        showModal(response);
      }
    } catch (error) {
      console.error('获取任务调度信息失败:', error);
      message.error('获取任务调度信息失败');
    }
  };

  // 保存任务调度
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const params: TaskScheduleParams = {
        taskName: values.taskName,
        agentId: values.agentId,
        description: values.description,
        taskParam: values.taskParam,
        cronExpression: values.cronExpression,
        status: values.status ? 1 : 0,
      };

      if (editingTask) {
        // 编辑
        params.id = editingTask.id;
        await updateTaskSchedule(params);
        message.success('更新成功');
      } else {
        // 新增
        await addTaskSchedule(params);
        message.success('添加成功');
      }

      setModalVisible(false);
      loadTaskScheduleList();
    } catch (error) {
      console.error('保存任务调度失败:', error);
      message.error('保存任务调度失败');
    }
  };

  // 删除任务调度
  const handleDelete = async (id: number) => {
    try {
      await deleteTaskSchedule(id);
      message.success('删除成功');
      loadTaskScheduleList();
    } catch (error) {
      console.error('删除任务调度失败:', error);
      message.error('删除任务调度失败');
    }
  };

  // 格式化日期
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('zh-CN');
  };



  const columns: ColumnsType<TaskSchedule> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
      width: 150,
    },
    {
      title: 'Agent ID',
      dataIndex: 'agentId',
      key: 'agentId',
      width: 120,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string) => text || '-',
    },
    {
      title: 'Cron表达式',
      dataIndex: 'cronExpression',
      key: 'cronExpression',
      width: 120,
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
            title="确定要删除这个任务吗？"
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
    <div className="p-8 bg-gray-50 h-full">
      <div className="max-w-7xl mx-auto">
        <Title level={1} className="mb-8 text-gray-800 font-bold">
          <ClockCircleOutlined className="mr-3 text-blue-600" style={{ fontSize: '28px' }} />
          AI代理任务调度
        </Title>

        <Card>
          <div className="mb-4 flex justify-between items-center">
            <Title level={3} className="mb-0">
              任务列表
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              size="large"
            >
              新增任务
            </Button>
          </div>

          <div className="mb-4">
            <Row gutter={16}>
              <Col span={8}>
                <Input
                  placeholder="请输入任务名称"
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
            dataSource={tasks}
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

        <Modal
          title={editingTask ? '编辑任务调度' : '新增任务调度'}
          open={modalVisible}
          onOk={handleSave}
          onCancel={() => setModalVisible(false)}
          width={600}
          okText="保存"
          cancelText="取消"
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              status: 'enabled',
              cronExpression: '0 0/30 * * * ?',
            }}
          >
            <Form.Item
              name="taskName"
              label="任务名称"
              rules={[{ required: true, message: '请输入任务名称' }]}
            >
              <Input placeholder="请输入任务名称" />
            </Form.Item>

            <Form.Item
              name="agentId"
              label="智能体ID"
              rules={[{ required: true, message: '请输入智能体ID' }]}
            >
              <Input placeholder="请输入智能体ID" />
            </Form.Item>

            <Form.Item
              name="description"
              label="描述"
              rules={[{ required: true, message: '请输入描述' }]}
            >
              <TextArea
                rows={3}
                placeholder="请输入任务描述"
              />
            </Form.Item>

            <Form.Item
              name="taskParam"
              label="任务参数"
            >
              <TextArea
                rows={3}
                placeholder="请输入任务参数（JSON格式）"
              />
            </Form.Item>

            <Form.Item
              name="cronExpression"
              label="Cron表达式"
            >
              <Input placeholder="例如：0 0 2 * * ?" />
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

export default TaskSchedulePage;