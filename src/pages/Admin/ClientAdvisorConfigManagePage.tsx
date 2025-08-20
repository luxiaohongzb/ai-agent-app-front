import React, { useEffect, useState } from 'react';
import { Card, Col, Input, Pagination, Row, Table, Tag, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import { queryClientAdvisorList, ClientAdvisorQueryParams } from '../../services/adminService';

const { Title } = Typography;

interface ClientAdvisor {
  id: number;
  advisorId: string;
  advisorName: string;
  advisorType: string;
  orderNum: number;
  extParam?: string;
  status: number;
  createTime: string;
  updateTime: string;
}

const ClientAdvisorConfigManagePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<ClientAdvisor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchName, setSearchName] = useState('');

  const loadList = async (page = currentPage, name = searchName) => {
    setLoading(true);
    try {
      const params: ClientAdvisorQueryParams = {
        pageNum: page,
        pageSize,
        advisorName: name || undefined,
      };
      const response = await queryClientAdvisorList(params);
      if (response && response.list) {
        setList(response.list as ClientAdvisor[]);
        setTotal(response.total ?? 0);
      } else {
        setList([]);
        setTotal(0);
      }
    } catch (e) {
      console.error('加载客户端顾问列表失败:', e);
      message.error('加载客户端顾问列表失败');
      setList([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    setCurrentPage(1);
    loadList(1, searchName);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadList(page, searchName);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleString('zh-CN');
  };

  const columns: ColumnsType<ClientAdvisor> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '顾问ID', dataIndex: 'advisorId', key: 'advisorId', width: 120 },
    { title: '顾问名称', dataIndex: 'advisorName', key: 'advisorName', width: 160 },
    { title: '顾问类型', dataIndex: 'advisorType', key: 'advisorType', width: 160 },
    { title: '排序', dataIndex: 'orderNum', key: 'orderNum', width: 100 },
    {
      title: '扩展参数',
      dataIndex: 'extParam',
      key: 'extParam',
      ellipsis: true,
      render: (text: string) => <span style={{ fontFamily: 'monospace' }}>{text || '-'}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => (
        <Tag color={status === 1 ? 'green' : 'red'}>{status === 1 ? '启用' : '禁用'}</Tag>
      ),
    },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180, render: (t: string) => formatDate(t) },
    { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', width: 180, render: (t: string) => formatDate(t) },
  ];

  return (
    <div>
      <Card
        title={
          <div className="flex items-center justify-between">
            <Title level={4} className="mb-0">
              客户端顾问管理
            </Title>
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
                allowClear
              />
            </Col>
            <Col span={4}>
              <button className="ant-btn ant-btn-primary" onClick={handleSearch}>
                <span>搜索</span>
              </button>
            </Col>
          </Row>
        </div>

        <Table<ClientAdvisor>
          columns={columns}
          dataSource={list}
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
            showTotal={(t) => `共 ${t} 条记录`}
          />
        </div>
      </Card>
    </div>
  );
};

export default ClientAdvisorConfigManagePage;