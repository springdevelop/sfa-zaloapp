import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page, Input, Button, Box, Text, Icon } from 'zmp-ui';
import { authService } from '../services/authService';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    // Validate
    if (!phone.trim()) {
      setError('Vui lòng nhập số điện thoại');
      return;
    }
    if (!password.trim()) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await authService.loginWithPhone(phone, password);
      // Redirect to home after successful login
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const handleOpenPolicy = () => {
    navigate('/policy');
  };

  return (
    <Page className="login-page">
      <Box
        className="login-container"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        {/* Logo/Header */}
        <Box
          style={{
            textAlign: 'center',
            marginBottom: '40px',
            color: 'white',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              background: 'white',
              borderRadius: '20px',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon
              icon="zi-user"
              style={{
                fontSize: '40px',
                color: '#667eea',
              }}
            />
          </div>
          <Text
            size="xLarge"
            bold
            style={{
              color: 'white',
              fontSize: '28px',
              marginBottom: '8px',
            }}
          >
            Đăng nhập
          </Text>
          <Text
            size="small"
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            Sử dụng tài khoản công ty cung cấp để đăng nhập
          </Text>
        </Box>

        {/* Login Form */}
        <Box
          style={{
            width: '100%',
            maxWidth: '400px',
            background: 'white',
            borderRadius: '16px',
            padding: '30px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Error Message */}
          {error && (
            <Box
              style={{
                background: '#fee',
                color: '#c33',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '14px',
              }}
            >
              {error}
            </Box>
          )}

          {/* Phone Input */}
          <Box style={{ marginBottom: '20px' }}>
            <Text
              size="small"
              bold
              style={{
                marginBottom: '8px',
                display: 'block',
                color: '#333',
              }}
            >
              Số điện thoại
            </Text>
            <Input
              type="text"
              placeholder="Nhập số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
              }}
            />
          </Box>

          {/* Password Input */}
          <Box style={{ marginBottom: '24px' }}>
            <Text
              size="small"
              bold
              style={{
                marginBottom: '8px',
                display: 'block',
                color: '#333',
              }}
            >
              Mật khẩu
            </Text>
            <Input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
              }}
            />
          </Box>

          {/* Login Button */}
          <Button
            fullWidth
            onClick={handleLogin}
            loading={loading}
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '14px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>

          {/* Policy Link */}
          <Box
            style={{
              marginTop: '16px',
              textAlign: 'center',
            }}
          >
            <Box
              onClick={handleOpenPolicy}
              style={{
                color: '#667eea',
                fontSize: '14px',
                cursor: 'pointer',
                textDecoration: 'underline',
                display: 'inline-block',
              }}
            >
              Xem chính sách của công ty
            </Box>
          </Box>
        </Box>

        {/* Footer */}
        <Box
          style={{
            marginTop: '30px',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '12px',
          }}
        >
          <Text size="xSmall" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            © 2026 Thịnh Vượng Toàn Cầu
          </Text>
        </Box>
      </Box>
    </Page>
  );
};

export default Login;
