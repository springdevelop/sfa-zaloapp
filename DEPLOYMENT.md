# Hướng dẫn Deploy Zalo Mini App

## Quy trình Deploy

### Cách 1: Tự động (Khuyến nghị)
```bash
npm run deploy:full
```
Script này sẽ tự động:
1. Build code mới (`npm run build`)
2. Deploy lên Zalo (`npm run deploy`)

### Cách 2: Thủ công
```bash
# Bước 1: Build code mới
npm run build

# Bước 2: Deploy lên Zalo
npm run deploy
```

## Môi trường Deploy

Khi chạy `npm run deploy`, CLI sẽ hỏi bạn chọn môi trường:

- **Development**: Môi trường phát triển - dùng để test trong quá trình phát triển
- **Testing**: Môi trường kiểm thử - dùng để test trước khi đưa lên Production
- **Production**: Môi trường chính thức - người dùng cuối sẽ sử dụng

## Lưu ý quan trọng

### ⚠️ Luôn build trước khi deploy!

**Vấn đề thường gặp**: Deploy thành công nhưng không thấy thay đổi trên app

**Nguyên nhân**: Bạn chỉ chạy `npm run deploy` mà không chạy `npm run build` trước

**Giải pháp**: 
- Sử dụng `npm run deploy:full` để tự động build + deploy
- Hoặc nhớ chạy `npm run build` trước mỗi lần deploy

### 🔄 Clear cache

Nếu sau khi deploy vẫn thấy phiên bản cũ:
1. Đóng hoàn toàn Zalo app
2. Mở lại và vào Mini App
3. Hoặc xóa cache của Zalo app trong cài đặt điện thoại

### 📋 Checklist trước khi deploy

- [ ] Code đã được test kỹ trên localhost
- [ ] Đã commit code vào Git
- [ ] Chạy `npm run build` để build code mới
- [ ] Kiểm tra thư mục `www/` có file mới (timestamp file assets/)
- [ ] Chạy `npm run deploy` để upload
- [ ] Test lại trên Zalo app sau khi deploy

## Debug

### Kiểm tra file build
```bash
ls -lt www/assets/
```
Xem timestamp của các file để đảm bảo đã build mới.

### Kiểm tra version
Mỗi lần build, Vite sẽ tạo file assets với hash khác nhau (ví dụ: `index-ABC123.js`).
Nếu hash không đổi thì build chưa chạy hoặc code chưa thay đổi.

### Login lại nếu cần
```bash
npm run login
```

## Tips

1. **Luôn dùng `deploy:full`** thay vì `deploy` để tránh quên build
2. **Test trên Development** trước khi deploy lên Testing/Production
3. **Tạo tag/release** trên Git cho mỗi lần deploy Production
4. **Ghi chú thay đổi** trong commit message để dễ tracking

## Workflow khuyến nghị

```bash
# 1. Phát triển tính năng mới
npm start

# 2. Test trên localhost
# ... test các tính năng

# 3. Build và deploy lên Development để test
npm run deploy:full
# Chọn: Development

# 4. Test trên Zalo app (Development)
# ... test kỹ lưỡng

# 5. Deploy lên Testing
npm run deploy:full
# Chọn: Testing

# 6. Test lần cuối trên Testing
# ... test kỹ lưỡng

# 7. Deploy lên Production (nếu mọi thứ OK)
npm run deploy:full
# Chọn: Production

# 8. Commit và push code
git add .
git commit -m "Deploy version X.X.X"
git push
```
