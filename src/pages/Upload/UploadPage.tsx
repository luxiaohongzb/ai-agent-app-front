import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Upload,
  Button,
  message,
  Progress,
  Typography,
  Space,
  Spin,
} from 'antd';
import {
  UploadOutlined,
  InboxOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { UploadFile } from 'antd/es/upload/interface';
import apiClient from '../../services/api';

const { Title, Text } = Typography;
const { Dragger } = Upload;
const { TextArea } = Input;

interface UploadFormData {
  name: string;
  description?: string;
}

const UploadPage: React.FC = () => {
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  // 处理文件上传
  const handleUpload = async (values: UploadFormData) => {
    if (fileList.length === 0) {
      message.error('请选择要上传的文件');
      return;
    }

    setUploading(true);
    setUploadStatus('uploading');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('name', values.name);
      if (values.description) {
        formData.append('description', values.description);
      }
      
      // 添加文件
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append('files', file.originFileObj);
        }
      });

      const response = await apiClient.post('/ai/admin/rag/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        },
      });

      if (response.success) {
        setUploadStatus('success');
        message.success('文件上传成功！');
        form.resetFields();
        setFileList([]);
        setUploadProgress(100);
      } else {
        throw new Error(response.message || '上传失败');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      message.error(error.message || '文件上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  // 文件上传配置
  const uploadProps = {
    name: 'file',
    multiple: true,
    fileList,
    beforeUpload: (file: File) => {
      // 检查文件类型
      const allowedTypes = [
        'text/plain',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/markdown',
      ];
      
      if (!allowedTypes.includes(file.type)) {
        message.error(`${file.name} 不是支持的文件类型`);
        return false;
      }
      
      // 检查文件大小 (10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        message.error(`${file.name} 文件大小超过10MB限制`);
        return false;
      }
      
      return false; // 阻止自动上传
    },
    onChange: (info: any) => {
      setFileList(info.fileList);
    },
    onRemove: (file: UploadFile) => {
      setFileList(prev => prev.filter(item => item.uid !== file.uid));
    },
  };

  // 获取状态图标
  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <Spin size="small" />;
      case 'success':
        return <CheckCircleOutlined className="text-green-500" />;
      case 'error':
        return <ExclamationCircleOutlined className="text-red-500" />;
      default:
        return <FileTextOutlined className="text-blue-500" />;
    }
  };

  // 获取状态文本
  const getStatusText = () => {
    switch (uploadStatus) {
      case 'uploading':
        return '文件上传中，请稍候...';
      case 'success':
        return '文件上传成功！';
      case 'error':
        return '文件上传失败，请重试';
      default:
        return '添加知识文件到系统';
    }
  };

  return (
//    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
   <div className="w-full flex items-center justify-center px-0 py-4 md:py-6">
       <Card className="w-full max-w-2xl shadow-lg relative">
        {/* 加载遮罩 */}
        {uploading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center rounded-lg z-10">
            <Spin size="large" className="mb-4" />
            <Text className="text-gray-600 mb-4">{getStatusText()}</Text>
            {uploadProgress > 0 && (
              <Progress
                percent={uploadProgress}
                status={uploadStatus === 'error' ? 'exception' : 'active'}
                className="w-64"
              />
            )}
          </div>
        )}

        <div className="text-center mb-6">
          <Space direction="vertical" size="small">
            {getStatusIcon()}
            <Title level={2} className="mb-0">
              {getStatusText()}
            </Title>
          </Space>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpload}
          disabled={uploading}
        >
          <Form.Item
            label="知识名称"
            name="name"
            rules={[
              { required: true, message: '请输入知识名称' },
              { max: 50, message: '知识名称不能超过50个字符' },
            ]}
          >
            <Input
              placeholder="输入知识名称"
              prefix={<FileTextOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="描述（可选）"
            name="description"
            rules={[
              { max: 200, message: '描述不能超过200个字符' },
            ]}
          >
            <TextArea
              placeholder="输入知识描述"
              rows={3}
              showCount
              maxLength={200}
            />
          </Form.Item>

          <Form.Item label="选择文件">
            <Dragger {...uploadProps} className="border-dashed border-2 border-gray-300 hover:border-blue-400">
              <p className="ant-upload-drag-icon">
                <InboxOutlined className="text-4xl text-blue-500" />
              </p>
              <p className="ant-upload-text text-lg font-medium">
                点击或拖拽文件到此区域上传
              </p>
              <p className="ant-upload-hint text-gray-500">
                支持 TXT、PDF、DOC、DOCX、MD 格式，单个文件不超过 10MB
              </p>
            </Dragger>
          </Form.Item>

          <Form.Item className="mb-0">
            <Space className="w-full justify-center">
              <Button
                type="default"
                onClick={() => window.close()}
                disabled={uploading}
              >
                取消
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<UploadOutlined />}
                loading={uploading}
                disabled={fileList.length === 0}
                className="min-w-[120px]"
              >
                {uploading ? '上传中...' : '开始上传'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UploadPage;