import axios from 'axios';
import { authService } from './authService';

const API_BASE_URL = 'http://localhost:8000/api';
// const API_BASE_URL = 'https://zaloapp.thinhvuongtoancau.vn/api';

// Set to true to use mock data (for development without backend)
export const USE_MOCK_DATA = false;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
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
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    console.error('❌ API Error:', error.response?.status, error.response?.data || error.message);
    
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
