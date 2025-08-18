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
} from '@ant-design/icons';
import apiClient from '../../services/api';

const { Title, Text, Paragraph } = Typography;

interface GitFormData {
  name: string;
  url: string;
  branch?: string;
  description?: string;
}

const GitPage: React.FC = () => {
  const [form] = Form.useForm();
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // 处理Git仓库解析
  const handleSubmit = async (values: GitFormData) => {
    setProcessing(true);
    setStatus('processing');
    setProgress(0);
    setErrorMessage('');

    try {
      // 模拟进度更新
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 500);

      const response = await apiClient.post('/ai/admin/git/parse', {
        name: values.name,
        url: values.url,
        branch: values.branch || 'main',
        description: values.description,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (response.success) {
        setStatus('success');
        message.success('Git仓库解析成功！');
        form.resetFields();
      } else {
        throw new Error(response.message || '解析失败');
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
   <div className="w-full flex items-center justify-center px-0 py-4 md:py-6">
       <Card className="w-full max-w-2xl shadow-lg relative">
        {/* 加载遮罩 */}
        {processing && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center rounded-lg z-10">
            <Spin size="large" className="mb-4" />
            <Text className="text-gray-600 mb-4">{getStatusText()}</Text>
            <Progress
              percent={Math.round(progress)}
              status={status === 'error' ? 'exception' : 'active'}
              className="w-64"
            />
            <Text className="text-sm text-gray-500 mt-2">
              正在克隆和分析代码结构...
            </Text>
          </div>
        )}

        <div className="text-center mb-6">
          <Space direction="vertical" size="small">
            {getStatusIcon()}
            <Title level={2} className="mb-0">
              {getStatusText()}
            </Title>
            <Paragraph className="text-gray-600 mb-0">
              输入Git仓库地址，系统将自动解析代码结构并生成知识库
            </Paragraph>
          </Space>
        </div>

        {/* 错误提示 */}
        {status === 'error' && errorMessage && (
          <Alert
            message="解析失败"
            description={errorMessage}
            type="error"
            showIcon
            className="mb-4"
          />
        )}

        {/* 成功提示 */}
        {status === 'success' && (
          <Alert
            message="解析成功"
            description="Git仓库已成功解析并添加到知识库中，您可以在聊天中使用这些知识。"
            type="success"
            showIcon
            className="mb-4"
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          disabled={processing}
        >
          <Form.Item
            label="项目名称"
            name="name"
            rules={[
              { required: true, message: '请输入项目名称' },
              { max: 50, message: '项目名称不能超过50个字符' },
            ]}
          >
            <Input
              placeholder="输入项目名称"
              prefix={<GithubOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="Git仓库地址"
            name="url"
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
            initialValue="main"
          >
            <Input
              placeholder="main"
              prefix={<BranchesOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="项目描述（可选）"
            name="description"
            rules={[
              { max: 200, message: '描述不能超过200个字符' },
            ]}
          >
            <Input.TextArea
              placeholder="输入项目描述"
              rows={3}
              showCount
              maxLength={200}
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
            <li>• 支持 GitHub、GitLab、Gitee、Bitbucket 等主流Git平台</li>
            <li>• 系统将自动分析代码结构、README、注释等内容</li>
            <li>• 解析完成后可在聊天中选择对应知识库进行代码相关问答</li>
            <li>• 建议使用公开仓库，私有仓库需要配置访问权限</li>
          </ul>
        </Card>
      </Card>
    </div>
  );
};

export default GitPage;