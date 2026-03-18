import React from 'react';
import { Page, Box, Text, Icon, Header } from 'zmp-ui';
import { useNavigate } from 'react-router-dom';

const Policy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Page className="policy-page">
      <Header
        title="Chính sách công ty"
        showBackIcon={true}
        onBackClick={() => navigate(-1)}
      />
      <Box
        style={{
          padding: '20px',
          background: '#f8f9fa',
          minHeight: '100vh',
        }}
      >
        <Box
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          }}
        >
          {/* Title */}
          <Text
            bold
            size="large"
            style={{
              color: '#333',
              marginBottom: '24px',
              textAlign: 'center',
              fontSize: '20px',
            }}
          >
            CHÍNH SÁCH SỬ DỤNG VÀ BẢO MẬT THÔNG TIN
          </Text>

          {/* Section 1 */}
          <Box style={{ marginBottom: '24px' }}>
            <Text
              bold
              style={{
                color: '#667eea',
                marginBottom: '12px',
                display: 'block',
                fontSize: '16px',
              }}
            >
              1. Mục đích sử dụng hệ thống
            </Text>
            <Text
              style={{
                color: '#555',
                lineHeight: '1.6',
                fontSize: '14px',
              }}
            >
              Ứng dụng được phát triển nhằm phục vụ cho hoạt động quản lý và báo cáo công việc nội bộ của công ty.
            </Text>
          </Box>

          {/* Section 2 */}
          <Box style={{ marginBottom: '24px' }}>
            <Text
              bold
              style={{
                color: '#667eea',
                marginBottom: '12px',
                display: 'block',
                fontSize: '16px',
              }}
            >
              2. Cung cấp tài khoản truy cập
            </Text>
            <Text
              style={{
                color: '#555',
                lineHeight: '1.6',
                fontSize: '14px',
              }}
            >
              Công ty cung cấp tài khoản đăng nhập cho nhân viên kinh doanh (sale) để truy cập vào hệ thống. 
              Mỗi tài khoản được cấp riêng cho từng nhân viên và chỉ sử dụng cho mục đích công việc.
            </Text>
          </Box>

          {/* Section 3 */}
          <Box style={{ marginBottom: '24px' }}>
            <Text
              bold
              style={{
                color: '#667eea',
                marginBottom: '12px',
                display: 'block',
                fontSize: '16px',
              }}
            >
              3. Chức năng sử dụng
            </Text>
            <Text
              style={{
                color: '#555',
                lineHeight: '1.6',
                fontSize: '14px',
                marginBottom: '12px',
              }}
            >
              Nhân viên sử dụng hệ thống để:
            </Text>
            <Box style={{ paddingLeft: '16px' }}>
              <Text
                style={{
                  color: '#555',
                  lineHeight: '1.8',
                  fontSize: '14px',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                • Đăng nhập vào hệ thống quản lý.
              </Text>
              <Text
                style={{
                  color: '#555',
                  lineHeight: '1.8',
                  fontSize: '14px',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                • Gửi báo cáo công việc.
              </Text>
              <Text
                style={{
                  color: '#555',
                  lineHeight: '1.8',
                  fontSize: '14px',
                  display: 'block',
                }}
              >
                • Cập nhật thông tin phục vụ cho hoạt động kinh doanh theo yêu cầu của công ty.
              </Text>
            </Box>
          </Box>

          {/* Section 4 */}
          <Box style={{ marginBottom: '24px' }}>
            <Text
              bold
              style={{
                color: '#667eea',
                marginBottom: '12px',
                display: 'block',
                fontSize: '16px',
              }}
            >
              4. Thu thập và sử dụng dữ liệu
            </Text>
            <Text
              style={{
                color: '#555',
                lineHeight: '1.6',
                fontSize: '14px',
                marginBottom: '12px',
              }}
            >
              Hệ thống có thể thu thập một số thông tin cần thiết nhằm phục vụ cho việc quản lý công việc và vận hành nội bộ của công ty.
            </Text>
            <Text
              style={{
                color: '#555',
                lineHeight: '1.6',
                fontSize: '14px',
              }}
            >
              Các thông tin này chỉ được sử dụng cho mục đích công việc và không được sử dụng cho bất kỳ mục đích nào khác.
            </Text>
          </Box>

          {/* Section 5 */}
          <Box style={{ marginBottom: '24px' }}>
            <Text
              bold
              style={{
                color: '#667eea',
                marginBottom: '12px',
                display: 'block',
                fontSize: '16px',
              }}
            >
              5. Bảo mật thông tin
            </Text>
            <Text
              style={{
                color: '#555',
                lineHeight: '1.6',
                fontSize: '14px',
              }}
            >
              Công ty cam kết bảo mật các thông tin được thu thập từ hệ thống và chỉ sử dụng trong phạm vi phục vụ hoạt động nội bộ của công ty.
            </Text>
          </Box>

          {/* Section 6 */}
          <Box style={{ marginBottom: '0' }}>
            <Text
              bold
              style={{
                color: '#667eea',
                marginBottom: '12px',
                display: 'block',
                fontSize: '16px',
              }}
            >
              6. Phạm vi áp dụng
            </Text>
            <Text
              style={{
                color: '#555',
                lineHeight: '1.6',
                fontSize: '14px',
              }}
            >
              Chính sách này áp dụng đối với tất cả nhân viên được cấp quyền truy cập và sử dụng hệ thống.
            </Text>
          </Box>
        </Box>

        {/* Footer Note */}
        <Box
          style={{
            marginTop: '20px',
            padding: '16px',
            background: '#e3f2fd',
            borderRadius: '8px',
            borderLeft: '4px solid #667eea',
          }}
        >
          <Text
            size="xSmall"
            style={{
              color: '#555',
              lineHeight: '1.6',
            }}
          >
            Bằng việc sử dụng hệ thống, bạn đã đồng ý với các điều khoản trong chính sách này.
          </Text>
        </Box>
      </Box>
    </Page>
  );
};

export default Policy;
