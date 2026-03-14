import axios from 'axios';
import { authService } from './authService';

// const API_BASE_URL = 'http://localhost:8000/api';
const API_BASE_URL = 'https://zaloapp.thinhvuongtoancau.vn/api';

// Set to true to use mock data (for development without backend)
export const USE_MOCK_DATA = false;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased to 30s for mobile devices
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      console.log('🌐 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL}${config.url}`,
      });
      
      // Log request data for POST/PUT/PATCH
      if (config.data && ['post', 'put', 'patch'].includes(config.method?.toLowerCase() || '')) {
        console.log('📤 Request data:', config.data);
        console.log('📤 Request data (JSON):', JSON.stringify(config.data, null, 2));
      }
      
      // Get token from storage (after login)
      const token = await authService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔐 Added auth token to request');
      } else {
        console.log('⚠️ No auth token found');
      }
    } catch (error) {
      console.error('❌ Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    // Network error (no response from server)
    if (!error.response) {
      console.error('❌ Network Error:', {
        message: error.message,
        code: error.code,
        config: {
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          method: error.config?.method,
        }
      });
      
      // Provide user-friendly error message
      if (error.code === 'ECONNABORTED') {
        error.message = 'Yêu cầu hết thời gian chờ. Vui lòng kiểm tra kết nối mạng.';
      } else if (error.message === 'Network Error') {
        error.message = 'Không thể kết nối đến server. Vui lòng kiểm tra:\n' +
          '1. Kết nối internet\n' +
          '2. Server có đang hoạt động\n' +
          '3. URL: ' + error.config?.baseURL;
      }
      
      return Promise.reject(error);
    }
    
    console.error('❌ API Error:', error.response?.status, error.response?.data || error.message);
    console.error('❌ Full response:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
    });
    
    // If 401 Unauthorized, token might be expired
    if (error.response?.status === 401) {
      console.log('⚠️ 401 Unauthorized - Token expired or invalid');
      // Clear token and redirect to login
      await authService.logout();
      // You can trigger a re-login here or show a message
    }
    
    return Promise.reject(error);
  }
);

export default api;
