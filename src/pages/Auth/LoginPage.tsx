import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, message, Card, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const { Title, Text } = Typography;

// 创建渐变背景容器
const GradientBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: `
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.6) 0%, transparent 60%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.6) 0%, transparent 60%),
    radial-gradient(circle at 40% 40%, rgba(79, 172, 254, 0.4) 0%, transparent 70%),
    linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)
  `,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backdropFilter: 'blur(80px)',
    WebkitBackdropFilter: 'blur(80px)',
    zIndex: 0,
  },
}));

// 创建登录卡片容器
const LoginCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: '400px',
  borderRadius: '16px',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  border: 'none',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  position: 'relative',
  zIndex: 1,
  '& .ant-card-body': {
    padding: '40px',
  },
}));

// 创建渐变按钮
const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  border: 'none',
  borderRadius: '8px',
  height: '45px',
  fontSize: '16px',
  fontWeight: '500',
  '&:hover': {
    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  transition: 'all 0.3s ease',
}));

interface LoginForm {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  // 获取重定向路径
  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (values: LoginForm) => {
    setLoading(true);
    try {
      const success = await login(values.username, values.password);
      if (success) {
        message.success('登录成功！');
        navigate(from, { replace: true });
      } else {
        message.error('用户名或密码错误！');
      }
    } catch (error) {
      message.error('登录失败，请重试！');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    message.info('注册功能暂未开放，请联系管理员');
  };

  return (
    <GradientBackground>
      <LoginCard>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{ margin: 0, color: '#1f2937' }}>
            Login
          </Title>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={handleSubmit}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' }
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#9ca3af' }} />}
              placeholder="username"
              size="large"
              style={{
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                padding: '12px 16px',
                fontSize: '16px'
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
              placeholder="password"
              size="large"
              style={{
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                padding: '12px 16px',
                fontSize: '16px'
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: '16px' }}>
            <GradientButton
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              Login
            </GradientButton>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text style={{ color: '#6b7280' }}>Don't have account? </Text>
            <Button
              type="link"
              onClick={handleSignUp}
              style={{
                padding: 0,
                height: 'auto',
                color: '#667eea',
                fontWeight: '500'
              }}
            >
              Sign up
            </Button>
          </div>
        </Form>

        {/* 提示信息 */}
        <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
          <Text style={{ fontSize: '12px', color: '#6b7280', display: 'block', textAlign: 'center' }}>
            测试账号：admin / admin123
          </Text>
        </div>
      </LoginCard>
    </GradientBackground>
  );
};

export default LoginPage;