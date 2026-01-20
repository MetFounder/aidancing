# 🚀 Hướng Dẫn Start Server

## ❌ Lỗi: ERR_CONNECTION_REFUSED

Lỗi này xảy ra khi **server chưa được start**. Bạn cần start server trước khi truy cập.

## 📋 Bước 1: Kiểm Tra Dependencies

```bash
cd backend
npm install
```

Nếu đã cài rồi, bỏ qua bước này.

## 📋 Bước 2: Start Services

Bạn cần mở **3 terminals** và chạy lần lượt:

### Terminal 1 - Mock Kling Server
```bash
cd backend
npm run mock:kling
```

**Kết quả mong đợi:**
```
[Mock Kling] Mock Kling API Server running on http://localhost:3002
```

### Terminal 2 - Main Server
```bash
cd backend
USE_MOCK_KLING=true npm start
```

**Kết quả mong đợi:**
```
[Server] Backend running on http://localhost:3001
[Server] DAY 1: Backend Core + Kling Motion Control
```

### Terminal 3 - Worker
```bash
cd backend
USE_MOCK_KLING=true npm run worker
```

**Kết quả mong đợi:**
```
[Worker] Starting worker (poll interval: 3000ms)
```

## 📋 Bước 3: Kiểm Tra Server

Sau khi start, test server:

```bash
curl http://localhost:3001/health
```

Hoặc mở browser:
```
http://localhost:3001/health
```

Phải trả về:
```json
{"status":"ok","timestamp":"..."}
```

## 📋 Bước 4: Mở Giao Diện

Sau khi server chạy, mở:
```
http://localhost:3001/
```

## 🐛 Troubleshooting

### Port 3001 đã bị chiếm

**Kiểm tra:**
```powershell
netstat -ano | findstr :3001
```

**Giải pháp:**
- Tắt process đang dùng port 3001
- Hoặc đổi port trong `.env`: `PORT=3002`

### Lỗi "Cannot find module"

**Giải pháp:**
```bash
cd backend
npm install
```

### Lỗi "KLING_API_KEY is not set"

**Giải pháp:**
- Tạo file `.env`:
```bash
cd backend
cp env.example .env
```

- Set trong `.env`:
```
USE_MOCK_KLING=true
```

### Server start nhưng không chạy

**Kiểm tra:**
1. Check terminal có error không
2. Check port có đúng không
3. Check firewall có block không

## ✅ Checklist

Trước khi mở browser, đảm bảo:

- [ ] Terminal 1: Mock server chạy (port 3002)
- [ ] Terminal 2: Main server chạy (port 3001)
- [ ] Terminal 3: Worker chạy
- [ ] Test `/health` endpoint thành công
- [ ] Không có error trong terminal

## 🎯 Quick Start (Windows PowerShell)

Nếu muốn start nhanh, dùng script:

```powershell
cd backend
.\test-mock.ps1
```

Script sẽ tự động start tất cả services.


