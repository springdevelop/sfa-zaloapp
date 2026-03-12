# Zalo Mini App - Authentication Flow

## 📌 Tổng quan

Zalo Mini App sử dụng **tự động đăng nhập** thông qua Zalo OAuth, không cần form đăng nhập phone/password.

## 🔐 Flow hoạt động

```
1. User mở Zalo Mini App
   ↓
2. App tự động kiểm tra authentication
   ↓
3. Nếu chưa đăng nhập:
   - Lấy thông tin từ Zalo SDK (zalo_id, name, avatar)
   - Gửi lên backend: POST /api/auth/login
   - Backend tạo/update user và trả về Sanctum token
   - Lưu token vào Zalo storage
   ↓
4. User được vào app và sử dụng các chức năng
```

## 📁 Files đã thay đổi

### 1. `src/components/ProtectedRoute.tsx`
**Trước đây:** 
- Check auth → nếu chưa login → redirect sang `/login`

**Bây giờ:**
- Check auth → nếu chưa login → **tự động gọi `loginWithZalo()`**
- Hiển thị loading screen trong khi đăng nhập
- Nếu lỗi → hiển thị error với nút "Thử lại"
- Nếu thành công → render app

### 2. `src/components/AppContent.tsx`
**Trước đây:**
- Có route `/login` cho Login page
- Wrap các protected routes trong `<ProtectedRoute>`

**Bây giờ:**
- **Xóa route `/login`** - không cần nữa
- Wrap toàn bộ app trong `<ProtectedRoute>`
- Mọi route đều protected, tự động đăng nhập

### 3. `src/services/authService.ts`
**Giữ nguyên - đã có sẵn:**
- `loginWithZalo()`: Lấy thông tin Zalo + gọi backend
- `getToken()`: Lấy token đã lưu
- `getUserInfo()`: Lấy user info đã lưu
- `isAuthenticated()`: Check đã đăng nhập chưa

## 🎯 User Experience

### ✅ Trước đây (Không tốt)
```
1. Mở app
2. Thấy màn hình Login
3. Phải nhập phone + password
4. Ấn nút Đăng nhập
5. Mới vào được app
```

### 🚀 Bây giờ (Tối ưu)
```
1. Mở app
2. Thấy "Đang đăng nhập..." (2-3 giây)
3. Vào app luôn - không cần làm gì!
```

## 🔧 Backend API

### Endpoint: `POST /api/auth/login`

**Request:**
```json
{
  "zalo_id": "123456789",
  "name": "Nguyễn Văn A",
  "avatar": "https://...",
  "access_token": "zalo_access_token_here"
}
```

**Response:**
```json
{
  "token": "sanctum_token_here",
  "user": {
    "id": 1,
    "name": "Nguyễn Văn A",
    "phone": "0900000000",
    "avatar": "https://...",
    "zalo_id": "123456789"
  }
}
```

## 🛡️ Security Notes

1. **Zalo Access Token**: Zalo SDK tự động lấy và refresh token
2. **Backend Token**: Sanctum token được lưu trong Zalo storage (secure)
3. **Phone Verification**: Backend sẽ verify số điện thoại có trong hệ thống không
   - Nếu phone chưa có → trả lỗi "Chưa được đăng ký, liên hệ admin"
   - Nếu phone có rồi → tự động link với zalo_id

## 🧪 Testing Mode

File `authService.ts` có **BYPASS_LOGIN** flag để test:

```typescript
const BYPASS_LOGIN = false; // Set true để test không cần Zalo
```

Khi `BYPASS_LOGIN = true`:
- Không gọi Zalo SDK
- Không gọi backend API
- Dùng mock data để test UI

## 📱 Zalo Permissions Required

App cần xin quyền từ Zalo:
- ✅ **scope.userInfo** - Lấy thông tin cơ bản (name, avatar)
- ✅ **scope.userPhonenumber** - Lấy số điện thoại (quan trọng!)

Cấu hình trong `app-config.json`:
```json
{
  "permission": {
    "scope.userInfo": {},
    "scope.userPhonenumber": {}
  }
}
```

## 🚨 Error Handling

### Lỗi thường gặp:

1. **"Không thể đăng nhập"**
   - Nguyên nhân: Zalo SDK lỗi hoặc không có network
   - Giải pháp: Ấn nút "Thử lại"

2. **"Chưa được đăng ký trong hệ thống"**
   - Nguyên nhân: Số điện thoại chưa có trong database
   - Giải pháp: Admin phải tạo user với phone number đó

3. **"Không có quyền truy cập"**
   - Nguyên nhân: User chưa cấp quyền phone number cho app
   - Giải pháp: Cấp lại quyền trong settings Zalo

## 📝 Notes cho Developer

- ❌ **KHÔNG CẦN** Login page với form phone/password
- ❌ **KHÔNG CẦN** Button "Đăng nhập"  
- ✅ **CHỈ CẦN** ProtectedRoute tự động xử lý authentication
- ✅ Token được **tự động refresh** bởi Zalo SDK
- ✅ Backend nhận Zalo info và **tự động tạo/update user**

## 🔄 Logout Flow

User có thể logout từ Profile page:
```typescript
await authService.logout();
// Xóa token khỏi storage
// Reload app → tự động login lại với Zalo
```

---

**Last updated:** March 11, 2026
