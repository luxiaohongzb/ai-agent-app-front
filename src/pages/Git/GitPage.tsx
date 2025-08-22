import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Progress,
  Typography,
  Space,
  Spin,
  Alert,
} from 'antd';
import {
  GithubOutlined,
  LinkOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  BranchesOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import apiClient from '../../services/api';

const { Title, Text, Paragraph } = Typography;

interface GitFormData {
  userName: string;
  repoUrl: string;
  branch?: string;
  token?: string;
}

const GitPage: React.FC = () => {
  const [form] = Form.useForm();
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // 处理Git仓库解析
  const handleSubmit = async (values: GitFormData) => {
    setProcessing(true);
    setStatus('processing');
    setErrorMessage('');

    try {
      const response = await apiClient.post('/agent/rag/analyzeGitRepository', null, {
        params: {
          repoUrl: values.repoUrl,
          userName: values.userName,
          token: values.token || '',
          branch: values.branch || 'master'
        }
      });

      if (response ==  "上传成功") {
        setStatus('success');
        message.success('Git仓库解析成功！');
        form.resetFields();
      } else {
        throw new Error(response || '解析失败');
      }
    } catch (error: any) {
      console.error('Git parse error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Git仓库解析失败，请检查仓库地址是否正确');
      message.error('Git仓库解析失败');
    } finally {
      setProcessing(false);
    }
  };

  // 验证Git URL格式
  const validateGitUrl = (_: any, value: string) => {
    if (!value) {
      return Promise.resolve();
    }
    
    const gitUrlPattern = /^(https?:\/\/)?(www\.)?(github\.com|gitlab\.com|gitee\.com|bitbucket\.org)\/.+\/.+(\.git)?$/;
    
    if (!gitUrlPattern.test(value)) {
      return Promise.reject(new Error('请输入有效的Git仓库地址'));
    }
    
    return Promise.resolve();
  };

  // 获取状态图标
  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <Spin size="small" />;
      case 'success':
        return <CheckCircleOutlined className="text-green-500" />;
      case 'error':
        return <ExclamationCircleOutlined className="text-red-500" />;
      default:
        return <GithubOutlined className="text-blue-500" />;
    }
  };

  // 获取状态文本
  const getStatusText = () => {
    switch (status) {
      case 'processing':
        return '正在解析Git仓库...';
      case 'success':
        return 'Git仓库解析成功！';
      case 'error':
        return 'Git仓库解析失败';
      default:
        return '解析Git仓库';
    }
  };

  return (
//    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
   <div className="w-full p-4 md:p-6">
       <Card className="max-w-2xl w-full shadow-lg relative mx-auto">
        {/* 加载遮罩 */}
        {processing && (
          <div className="absolute inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-10">
            <div className="p-8 rounded-lg bg-white/50 shadow-lg flex flex-col items-center">
              <Spin size="large" className="mb-6" />
              <Text className="text-lg font-medium text-gray-700 mb-2">{getStatusText()}</Text>
              <Text className="text-sm text-gray-500">
                正在解析Git仓库，请稍候...
              </Text>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center justify-center mb-8">
          <div className="text-5xl mb-4 flex justify-center items-center h-20 w-20 rounded-full bg-blue-50 text-blue-500">
            {getStatusIcon()}
          </div>
          <Title level={2} className="mb-4 !text-2xl font-bold text-center">
            {getStatusText()}
          </Title>
          <Paragraph className="text-gray-600 mb-0 max-w-md text-center">
            输入Git仓库地址，系统将自动解析代码结构并生成知识库
          </Paragraph>
        </div>

        {/* 错误提示 */}
        {status === 'error' && errorMessage && (
          <Alert
            message="解析失败"
            description={errorMessage}
            type="error"
            showIcon
            className="mb-6 shadow-sm"
            action={
              <Button size="small" type="text" danger onClick={() => setStatus('idle')}>
                关闭
              </Button>
            }
          />
        )}

        {/* 成功提示 */}
        {status === 'success' && (
          <Alert
            message="解析成功"
            description="Git仓库已成功解析并添加到知识库中，您可以在聊天中使用这些知识。"
            type="success"
            showIcon
            className="mb-6 shadow-sm"
            action={
              <Button size="small" type="text" onClick={() => setStatus('idle')}>
                关闭
              </Button>
            }
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          disabled={processing}
        >
          <Form.Item
            label="用户名"
            name="userName"
            rules={[
              { required: true, message: '请输入用户名' },
            ]}
          >
            <Input
              placeholder="用户名 "
              prefix={<GithubOutlined />}
            />
          </Form.Item>


          <Form.Item
            label="Git仓库地址"
            name="repoUrl"
            rules={[
              { required: true, message: '请输入Git仓库地址' },
              { validator: validateGitUrl },
            ]}
          >
            <Input
              placeholder="https://github.com/username/repository.git"
              prefix={<LinkOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="分支名称（可选）"
            name="branch"
            initialValue="master"
          >
            <Input
              placeholder="main"
              prefix={<BranchesOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="访问令牌（可选）"
            name="token"
            tooltip="私有仓库需要提供访问令牌"
          >
            <Input.Password
              placeholder="输入访问令牌"
              prefix={<LinkOutlined />}
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Space className="w-full justify-center">
              <Button
                type="default"
                onClick={() => window.close()}
                disabled={processing}
              >
                取消
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<GithubOutlined />}
                loading={processing}
                className="min-w-[120px]"
              >
                {processing ? '解析中...' : '开始解析'}
              </Button>
            </Space>
          </Form.Item>
        </Form>

        {/* 使用说明 */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <Title level={5} className="text-blue-700 mb-2">
            使用说明
          </Title>
          <ul className="text-sm text-blue-600 space-y-1">
            <li> 支持 GitHub、GitLab、Gitee、Bitbucket 等主流Git平台</li>
            <li> 系统将自动分析代码结构、README、注释等内容</li>
            <li> 解析完成后可在聊天中选择对应知识库进行代码相关问答</li>
            <li> 建议使用公开仓库，私有仓库需要配置访问权限</li>
          </ul>
        </Card>
      </Card>
    </div>
  );
};

export default GitPage;