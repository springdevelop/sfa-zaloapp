# Hướng dẫn Xác thực với Backend API

## 📋 Tổng quan

App hiện đã được tích hợp xác thực với backend API tại `https://zaloapp.thinhvuongtoancau.vn`

## 🔐 Cách hoạt động

### 1. Flow xác thực

```
User mở app
  ↓
App lấy Zalo Access Token & User Info
  ↓
Gửi đến Backend: POST /auth/login
  ↓
Backend xác thực và trả về JWT token
  ↓
App lưu token vào Storage
  ↓
Các API calls tiếp theo dùng token này
```

### 2. Cấu trúc request đăng nhập

**Endpoint:** `POST https://zaloapp.thinhvuongtoancau.vn/auth/login`

**Request Body:**
```json
{
  "access_token": "Zalo_Access_Token",
  "zalo_id": "1234567890",
  "name": "Nguyễn Văn A",
  "avatar": "https://..."
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 123,
    "name": "Nguyễn Văn A",
    "phone": "0912345678",
    "avatar": "https://...",
    "zalo_id": "1234567890"
  }
}
```

### 3. Sử dụng token cho các API calls

Sau khi đăng nhập, mọi API call sẽ tự động thêm header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🚀 Cách sử dụng

### Trong app

1. **Mở tab "Cá nhân"**
2. **Nhìn vào card "🔐 Xác thực Backend"**
   - Nếu chưa xác thực → Click "🔑 Đăng nhập với Zalo"
   - Nếu đã xác thực → Thấy thông tin user và có nút "🚪 Đăng xuất"

### Chuyển từ Mock Data sang Real API

1. **Mở file:** `src/services/api.ts`
2. **Thay đổi:**
   ```typescript
   export const USE_MOCK_DATA = false; // Đổi từ true sang false
   ```
3. **Reload app**
4. **Đăng nhập** để lấy token
5. **App sẽ fetch data từ backend thật**

## 📁 Files liên quan

### Authentication Service
- **File:** `src/services/authService.ts`
- **Chức năng:**
  - `loginWithZalo()` - Đăng nhập
  - `getToken()` - Lấy token đã lưu
  - `getUserInfo()` - Lấy thông tin user đã lưu
  - `isAuthenticated()` - Check trạng thái auth
  - `logout()` - Đăng xuất
  - `verifyToken()` - Verify token với backend

### API Configuration
- **File:** `src/services/api.ts`
- **Chức năng:**
  - Interceptor tự động thêm token vào headers
  - Xử lý 401 Unauthorized (auto logout)
  - Toggle giữa mock data và real API

### Profile Page
- **File:** `src/pages/Profile.tsx`
- **Chức năng:**
  - UI đăng nhập/đăng xuất
  - Hiển thị trạng thái auth
  - Hiển thị nguồn dữ liệu (Mock/API)

## 🔧 Backend API Requirements

Backend cần implement các endpoints sau:

### 1. POST /auth/login
- **Input:** `{ access_token, zalo_id, name, avatar }`
- **Output:** `{ token, user }`
- **Chức năng:** Xác thực Zalo user và tạo JWT token

### 2. GET /auth/verify
- **Headers:** `Authorization: Bearer <token>`
- **Output:** `{ valid: true/false }`
- **Chức năng:** Verify token còn valid không

### 3. Các endpoints khác
Tất cả endpoints yêu cầu `Authorization` header với JWT token:
- `GET /visit-targets` - Danh sách khách hàng
- `GET /visit-targets/:id` - Chi tiết khách hàng
- `POST /visits/check-in` - Check-in
- `POST /visits/:id/check-out` - Check-out
- `GET /visits/history` - Lịch sử thăm
- `GET /dashboard/stats` - Dashboard stats
- `GET /user/profile` - User profile
- `PUT /user/profile` - Update profile

## 🐛 Debugging

### Xem logs
Mở Console (F12) và xem các logs:
- `🔐 Getting Zalo access token...`
- `✅ Got Zalo access token: Yes/No`
- `👤 Getting Zalo user info...`
- `🌐 Sending auth request to backend...`
- `✅ Backend auth response: {...}`
- `🔐 Added auth token to request` (cho mỗi API call)

### Kiểm tra token đã lưu
```javascript
// Trong Console
Storage.getItem('auth_token').then(token => console.log(token))
Storage.getItem('user_info').then(user => console.log(user))
```

### Test API trực tiếp
```javascript
// Test login
authService.loginWithZalo()
  .then(res => console.log('✅ Login success:', res))
  .catch(err => console.log('❌ Login error:', err));

// Test get token
authService.getToken()
  .then(token => console.log('Token:', token));

// Test verify
authService.verifyToken()
  .then(valid => console.log('Token valid:', valid));
```

## ⚠️ Lưu ý

1. **Mock Data vs Real API:**
   - Khi `USE_MOCK_DATA = true`: Không cần token, dùng data cứng
   - Khi `USE_MOCK_DATA = false`: Bắt buộc phải login để lấy token

2. **Token expiration:**
   - Khi token hết hạn, API sẽ trả về 401
   - App tự động logout và xóa token
   - User cần login lại

3. **Permissions:**
   - App cần permissions trong `app-config.json`:
     - `getLocation` - Lấy GPS
     - `chooseImage` - Chọn/chụp ảnh
     - `getUserInfo` - Lấy thông tin Zalo user

4. **Storage:**
   - Token và user info lưu trong Zalo Storage
   - Không bị mất khi reload app
   - Chỉ bị xóa khi logout hoặc clear app data

## 📞 Support

Nếu có vấn đề, check:
1. Console logs
2. Network tab (xem request/response)
3. Backend API có hoạt động không
4. Token có bị expired không
