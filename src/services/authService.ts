import { setStorage, getStorage, removeStorage } from 'zmp-sdk';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';
// const API_BASE_URL = 'https://zaloapp.thinhvuongtoancau.vn/api';
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_info';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    phone?: string;
    avatar?: string;
    zalo_id: string;
  };
}

export const authService = {
  /**
   * Login with phone and password
   */
  loginWithPhone: async (phone: string, password: string): Promise<LoginResponse> => {
    try {
      console.log('🔐 Logging in with phone...');
      
      // Send phone and password to backend for authentication
      const response = await axios.post<{ success: boolean; data: LoginResponse }>(
        `${API_BASE_URL}/login`,
        {
          phone,
          password,
        },
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('✅ Backend auth response:', response.data);
      
      // Extract token and user from response
      let loginData = response.data.data;
      if (typeof loginData === 'string') {
        loginData = JSON.parse(loginData);
      }
      const { token, user } = loginData;
      
      // Save token and user info to storage
      await setStorage({ data: { [TOKEN_KEY]: token } });
      await setStorage({ data: { [USER_KEY]: user } });
      
      console.log('✅ Saved token and user info to storage');
      
      return { token, user };
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Số điện thoại hoặc mật khẩu không đúng'
      );
    }
  },
  
  /**
   * Get saved token from storage
   */
  getToken: async (): Promise<string | null> => {
    try {
      const result = await getStorage({ keys: [TOKEN_KEY] });
      return result[TOKEN_KEY] || null;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },
  
  /**
   * Get saved user info from storage
   */
  getUserInfo: async (): Promise<any | null> => {
    try {
      const result = await getStorage({ keys: [USER_KEY] });
      return result[USER_KEY] || null;
    } catch (error) {
      console.error('Error getting user info:', error);
      return null;
    }
  },
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated: async (): Promise<boolean> => {
    const token = await authService.getToken();
    return !!token;
  },
  
  /**
   * Logout - Clear token and user info
   */
  logout: async (): Promise<void> => {
    try {
      await removeStorage({ keys: [TOKEN_KEY] });
      await removeStorage({ keys: [USER_KEY] });
      console.log('✅ Logged out');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  },
  
  /**
   * Verify token with backend
   */
  verifyToken: async (): Promise<boolean> => {
    try {
      const token = await authService.getToken();
      if (!token) return false;
      
      const response = await axios.get(
        `${API_BASE_URL}/auth/verify`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      return response.status === 200;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  },
};
