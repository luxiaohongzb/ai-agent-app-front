import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Form,
  Input,
  Select,
  message,
  Tag,
  Typography,
  Row,
  Col,
  Pagination,
  DatePicker,
} from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  queryClientConfigList,
  ClientConfigQueryParams,
} from '../../services/adminService';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface ClientConfigRecord {
  id: number;
  sourceType: string;
  sourceId: string;
  targetType: string;
  targetId: string;
  extParam: string;
  status: number;
  createTime: string;
  updateTime: string;
}

// 工具函数：格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleString('zh-CN');
};

const AgentClientManagePage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ClientConfigRecord[]>([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [pages, setPages] = useState<number>(1);

  // 获取数据的接口调用
  const fetchData = async (params: Partial<ClientConfigQueryParams> = {}) => {
    setLoading(true);
    try {
      const requestParams: ClientConfigQueryParams = {
        pageNum,
        pageSize,
        ...params,
      };

      const response = await queryClientConfigList(requestParams);
      if (response && response.list) {
        setData(response.list);
        setTotal(response.total || 0);
        setPages(response.pages || 1);
        setPageNum(response.pageNum || 1);
        setPageSize(response.pageSize || 10);
      } else {
        setData([]);
        setTotal(0);
        setPages(1);
      }
    } catch (error) {
      console.error('查询失败:', error);
      message.error('查询失败');
      setData([]);
      setTotal(0);
      setPages(1);
    } finally {
      setLoading(false);
    }
  };

  // 初始化载入数据
  useEffect(() => {
    fetchData({ orderBy: 'id desc' });
  }, []);

  const handleSearch = async () => {
    const values = await form.validateFields().catch(() => ({}));
    const { createTimeRange, ...restValues } = values;

    let createTimeStart: string | undefined;
    let createTimeEnd: string | undefined;

    if (Array.isArray(createTimeRange) && createTimeRange.length === 2) {
      createTimeStart = createTimeRange[0]?.format('YYYY-MM-DD HH:mm:ss');
      createTimeEnd = createTimeRange[1]?.format('YYYY-MM-DD HH:mm:ss');
    }

    const searchParams: Partial<ClientConfigQueryParams> = {
      ...restValues,
      createTimeStart,
      createTimeEnd,
      orderBy: restValues.orderBy || 'id desc',
      pageNum: 1,
      pageSize,
    };

    setPageNum(1);
    await fetchData(searchParams);
  };

  const handleReset = () => {
    form.resetFields();
    setPageNum(1);
    fetchData({ orderBy: 'id desc', pageNum: 1, pageSize });
  };

  const handlePageChange = (page: number, size?: number) => {
    const currentValues = form.getFieldsValue();
    const { createTimeRange, ...restValues } = currentValues;
    
    let createTimeStart: string | undefined;
    let createTimeEnd: string | undefined;

    if (Array.isArray(createTimeRange) && createTimeRange.length === 2) {
      createTimeStart = createTimeRange[0]?.format('YYYY-MM-DD HH:mm:ss');
      createTimeEnd = createTimeRange[1]?.format('YYYY-MM-DD HH:mm:ss');
    }

    const pageParams: Partial<ClientConfigQueryParams> = {
      ...restValues,
      createTimeStart,
      createTimeEnd,
      pageNum: page,
      pageSize: size || pageSize,
    };

    setPageNum(page);
    if (size && size !== pageSize) {
      setPageSize(size);
    }
    fetchData(pageParams);
  };

  const columns: ColumnsType<ClientConfigRecord> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '源类型', dataIndex: 'sourceType', key: 'sourceType', width: 120 },
    { title: '源ID', dataIndex: 'sourceId', key: 'sourceId', width: 120 },
    { title: '目标类型', dataIndex: 'targetType', key: 'targetType', width: 120 },
    { title: '目标ID', dataIndex: 'targetId', key: 'targetId', width: 120 },
    { title: '扩展参数', dataIndex: 'extParam', key: 'extParam', width: 120 },
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
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180, render: formatDate },
    { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', width: 180, render: formatDate },
  ];

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Title level={4}>客户端配置关系列表</Title>
        </div>

        {/* 动态查询表单 */}
        <Form form={form} layout="inline" onFinish={handleSearch} style={{ marginBottom: 12 }}>
          <Row gutter={12} style={{ width: '100%' }}>
            <Col>
              <Form.Item name="id" label="ID">
                <Input placeholder="= 精确匹配" style={{ width: 140 }} />
              </Form.Item>
            </Col>

            <Col>
              <Form.Item name="status" label="状态">
                <Select allowClear placeholder="全部" style={{ width: 120 }}>
                  <Option value={1}>启用</Option>
                  <Option value={0}>禁用</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col>
              <Form.Item name="sourceType" label="源类型">
                <Select allowClear placeholder="选择" style={{ width: 140 }}>
                  <Option value="client">client</Option>
                  <Option value="model">model</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col>
              <Form.Item name="sourceId" label="源ID">
                <Input placeholder="支持包含匹配" style={{ width: 160 }} />
              </Form.Item>
            </Col>

            <Col>
              <Form.Item name="targetType" label="目标类型">
                <Select allowClear placeholder="选择" style={{ width: 140 }}>
                  <Option value="advisor">advisor</Option>
                  <Option value="prompt">prompt</Option>
                  <Option value="model">model</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col>
              <Form.Item name="targetId" label="目标ID">
                <Input placeholder="支持包含匹配" style={{ width: 160 }} />
              </Form.Item>
            </Col>

            <Col>
              <Form.Item name="createTimeRange" label="创建时间">
                <RangePicker showTime style={{ width: 280 }} />
              </Form.Item>
            </Col>

            <Col>
              <Form.Item name="orderBy" label="排序">
                <Input placeholder="如: id desc" style={{ width: 160 }} />
              </Form.Item>
            </Col>

            <Col flex="auto">
              <Space>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>搜索</Button>
                <Button onClick={handleReset} icon={<ReloadOutlined />}>重置</Button>
              </Space>
            </Col>
          </Row>
        </Form>

        {/* 表格 */}
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: 1000 }}
        />

        {/* 分页 */}
        {total > 0 && (
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Pagination
              current={pageNum}
              pageSize={pageSize}
              total={total}
              showSizeChanger
              onChange={handlePageChange}
              onShowSizeChange={handlePageChange}
              showQuickJumper
              showTotal={(t, range) => `第 ${range[0]}-${range[1]} 条/共 ${t} 条（共 ${pages} 页）`}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default AgentClientManagePage;