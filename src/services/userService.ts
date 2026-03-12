import api, { USE_MOCK_DATA } from './api';
import { User } from '../state/atoms';

export const userService = {
  // Get user profile
  getProfile: async (): Promise<User> => {
    if (USE_MOCK_DATA) {
      return new Promise(resolve => {
        setTimeout(() => resolve({
          id: 1,
          name: "Nguyễn Văn A",
          phone: "0912345678",
          avatar: ""
        }), 300);
      });
    }
    return api.get('/user/profile');
  },

  // Update user profile
  updateProfile: async (data: Partial<User>): Promise<User> => {
    if (USE_MOCK_DATA) {
      return new Promise(resolve => {
        setTimeout(() => resolve({
          id: 1,
          name: data.name || "Nguyễn Văn A",
          phone: data.phone || "0912345678",
          avatar: data.avatar || ""
        }), 300);
      });
    }
    return api.put('/user/profile', data);
  },
};
