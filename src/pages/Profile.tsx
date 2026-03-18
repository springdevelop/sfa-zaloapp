import React, { useEffect, useState } from 'react';
import { Page, Box, Text, List, Button, useNavigate, useSnackbar } from '../components/UIComponents';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userState, currentVisitState } from '../state/atoms';
import { getUserInfo } from 'zmp-sdk';
import { authService } from '../services/authService';
import { USE_MOCK_DATA } from '../services/api';

interface ZaloUserInfo {
  id: string;
  name: string;
  avatar?: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const user = useRecoilValue(userState);
  const setCurrentVisit = useSetRecoilState(currentVisitState);
  const [userInfo, setUserInfo] = useState<ZaloUserInfo | null>(null);
  const [backendUser, setBackendUser] = useState<any>(null);

  useEffect(() => {
    loadUserInfo();
    loadBackendUser();
  }, []);

  const loadUserInfo = async () => {
    try {
      const info = await getUserInfo({});
      setUserInfo({
        id: (info as any).id || '',
        name: (info as any).name || 'User',
        avatar: (info as any).avatar || '',
      });
    } catch (error) {
      console.error('Error loading user info:', error);
    }
  };

  const loadBackendUser = async () => {
    try {
      const savedUser = await authService.getUserInfo();
      setBackendUser(savedUser);
    } catch (error) {
      console.error('Error loading backend user:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setBackendUser(null);
      
      // Clear current visit state
      setCurrentVisit(null);
      
      openSnackbar({ text: 'Đã đăng xuất', type: 'success' });
      
      // Navigate to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    {
      icon: '📋',
      label: 'Lịch sử thăm viếng',
      onClick: () => navigate('/visit-history'),
    },
    {
      icon: '⚙️',
      label: 'Cài đặt',
      onClick: () => {},
    },
    {
      icon: 'ℹ️',
      label: 'Thông tin ứng dụng',
      onClick: () => {},
    },
    {
      icon: '📞',
      label: 'Liên hệ hỗ trợ',
      onClick: () => {},
    },
  ];

  return (
    <Page className="profile-page">
      <Box p={4}>
        <h1 style={{ margin: '0 0 24px 0', fontSize: '24px', fontWeight: 'bold' }}>
          Cá nhân
        </h1>

        {/* Profile Card */}
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '24px',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: userInfo?.avatar
                ? `url(${userInfo.avatar}) center/cover`
                : '#0068ff',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '32px',
              fontWeight: 'bold',
            }}
          >
            {!userInfo?.avatar && (userInfo?.name?.[0] || '👤')}
          </div>
          <Text bold size="large" style={{ display: 'block', marginBottom: '4px' }}>
            {backendUser?.name || userInfo?.name || user?.name || 'User'}
          </Text>
          <Text size="small" style={{ color: '#999' }}>
            {backendUser?.phone || user?.phone || 'Nhân viên Sale'}
          </Text>
        </div>

        {/* Logout Button */}
        {backendUser && (
          <div className="card" style={{ marginBottom: '16px' }}>
            <div style={{ marginBottom: '12px', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
              <Text size="small" style={{ color: '#666' }}>
                <strong>User ID:</strong> {backendUser.id}
              </Text>
              <Text size="small" style={{ color: '#666', display: 'block', marginTop: '4px' }}>
                <strong>Tên:</strong> {backendUser.name}
              </Text>
              {backendUser.phone && (
                <Text size="small" style={{ color: '#666', display: 'block', marginTop: '4px' }}>
                  <strong>SĐT:</strong> {backendUser.phone}
                </Text>
              )}
            </div>
            
            <Button 
              variant="secondary"
              onClick={handleLogout}
              fullWidth
            >
              🚪 Đăng xuất
            </Button>
          </div>
        )}

        {/* Data Source */}
        <div className="card" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Text bold>📊 Nguồn dữ liệu</Text>
              <Text size="small" style={{ color: '#666', display: 'block', marginTop: '4px' }}>
                {USE_MOCK_DATA ? 'Đang dùng mock data (offline)' : 'Đang kết nối với backend API'}
              </Text>
            </div>
            <span style={{ 
              padding: '4px 8px', 
              borderRadius: '12px', 
              fontSize: '12px',
              background: USE_MOCK_DATA ? '#fff3cd' : '#d4edda',
              color: USE_MOCK_DATA ? '#856404' : '#155724',
            }}>
              {USE_MOCK_DATA ? 'MOCK' : 'API'}
            </span>
          </div>
          <Text size="xSmall" style={{ color: '#999', marginTop: '8px' }}>
            💡 Để kết nối backend API, set USE_MOCK_DATA = false trong src/services/api.ts
          </Text>
        </div>

        {/* Menu */}
        <div className="card">
          <List>
            {menuItems.map((item, index) => (
              <List.Item
                key={index}
                onClick={item.onClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  borderBottom: index < menuItems.length - 1 ? '1px solid #e0e0e0' : 'none',
                }}
              >
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <Text style={{ flex: 1 }}>{item.label}</Text>
                <span style={{ color: '#999' }}>›</span>
              </List.Item>
            ))}
          </List>
        </div>

        {/* App Info */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Text size="xSmall" style={{ color: '#999' }}>
            Quản lý Sale - Thịnh Vượng Toàn Cầu
          </Text>
          <Text size="xSmall" style={{ color: '#999', display: 'block', marginTop: '4px' }}>
            Version 1.0.0
          </Text>
          <Text size="xSmall" style={{ color: '#999', display: 'block', marginTop: '4px' }}>
            API: zaloapp.thinhvuongtoancau.vn
          </Text>
        </div>
      </Box>
    </Page>
  );
};

export default Profile;
