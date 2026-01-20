# 🔗 Integration Guide

Hướng dẫn tích hợp Admin Dashboard vào server hiện có (ví dụ: port 5000).

## Option 1: Serve Admin Dashboard từ Backend (Đã làm)

Admin Dashboard đã được serve từ backend server (port 3001):
```
http://localhost:3001/admin/admin.html
```

**Ưu điểm:**
- ✅ Không cần setup thêm
- ✅ Cùng domain với API
- ✅ Dễ test

## Option 2: Tích hợp vào Frontend Server (Port 5000)

Nếu bạn có frontend server riêng ở port 5000, có thể:

### Cách 1: Copy file HTML vào frontend

```bash
# Copy admin.html vào frontend public folder
cp backend/public/admin.html frontend/public/admin.html
```

Sau đó truy cập:
```
http://localhost:5000/admin.html
```

**Lưu ý:** Cần sửa API URLs trong HTML:
- Main Server: `http://localhost:3001`
- Mock Server: `http://localhost:3002`

### Cách 2: Proxy API qua Frontend Server

Nếu frontend server có proxy (ví dụ: Next.js, Vite), thêm proxy config:

**Next.js (next.config.js):**
```javascript
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },
};
```

**Vite (vite.config.js):**
```javascript
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
};
```

### Cách 3: CORS cho Frontend Server

Nếu frontend server ở domain khác, đảm bảo backend cho phép CORS:

Backend đã có CORS enabled, nhưng nếu cần restrict:
```javascript
// backend/server.js
app.use(cors({
  origin: 'http://localhost:5000', // Frontend URL
  credentials: true,
}));
```

## Option 3: Standalone HTML (Mở trực tiếp)

Có thể mở `admin.html` trực tiếp từ file system:

1. Mở `backend/public/admin.html` bằng browser
2. Sửa API URLs trong HTML nếu cần
3. Lưu ý: CORS có thể block requests từ `file://`

**Giải pháp:** Dùng local server:
```bash
# Python
python -m http.server 8000

# Node.js (http-server)
npx http-server backend/public -p 8000
```

Sau đó truy cập: `http://localhost:8000/admin.html`

## 📝 Recommended Setup

**Cho development:**
- Backend: `http://localhost:3001`
- Mock Server: `http://localhost:3002`
- Admin Dashboard: `http://localhost:3001/admin/admin.html`

**Cho production:**
- Tích hợp admin.html vào frontend build
- Hoặc serve riêng từ backend với authentication

## 🔧 Customize Admin Dashboard

Nếu muốn customize admin.html:

1. **Thay đổi API URLs:**
   - Sửa `mainServerUrl` và `mockServerUrl` trong HTML
   - Hoặc dùng environment variables

2. **Thêm features:**
   - Download video
   - Preview image/video
   - Job history
   - Statistics

3. **Styling:**
   - Sửa CSS trong `<style>` tag
   - Hoặc link external CSS file

## 🎯 Quick Test với Port 5000

Nếu bạn muốn test ngay với server port 5000:

1. **Copy admin.html vào frontend:**
```bash
cp backend/public/admin.html frontend/public/
```

2. **Sửa API URLs trong HTML:**
   - Tìm `value="http://localhost:3001"` → sửa thành port của bạn nếu cần
   - Hoặc giữ nguyên nếu backend vẫn ở port 3001

3. **Truy cập:**
```
http://localhost:5000/admin.html
```

4. **Đảm bảo:**
   - Backend server (3001) đang chạy
   - Mock server (3002) đang chạy
   - CORS cho phép requests từ port 5000


