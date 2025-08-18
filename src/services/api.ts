import axios from 'axios';

// API配置
const ApiConfig = {
  BASE_URL: 'http://localhost:8091',
  API_PREFIX: '/ai-agent-station/api/v1',
  getApiUrl: function(path: string) {
    return this.BASE_URL + this.API_PREFIX + path;
  }
};

// 创建axios实例
const apiClient = axios.create({
  baseURL: ApiConfig.BASE_URL + ApiConfig.API_PREFIX,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    const { status, data,statusText } = response;

    // 处理业务状态码
    if (status === 200) {
      console.log('data', data);
      return data;
    } else {
      // 统一处理错误消息
      console.error(`API Error: ${statusText}`);
      return Promise.reject(new Error(statusText));
    }
  },
  (error) => {
    // 处理HTTP错误
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // 未授权，清除token并跳转到登录页
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          console.error('没有权限访问该资源');
          break;
        case 404:
          console.error('请求的资源不存在');
          break;
        case 500:
          console.error('服务器错误');
          break;
        default:
          console.error('未知错误');
      }
      
      return Promise.reject(new Error(data.message || '请求失败'));
    }
    
    if (error.request) {
      // 请求已发出但没有收到响应
      console.error('网络错误，请检查您的网络连接');
      return Promise.reject(new Error('网络错误，请检查您的网络连接'));
    }
    
    console.error('Request Error:', error.message);
    return Promise.reject(error);
  }
);

export { ApiConfig, apiClient };
export default apiClient;