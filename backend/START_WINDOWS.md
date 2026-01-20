# 🪟 Hướng Dẫn Start Server trên Windows

## ⚠️ QUAN TRỌNG: PowerShell Execution Policy

Trước khi chạy, bạn cần cho phép PowerShell chạy scripts:

### Bước 1: Mở PowerShell Run as Administrator

1. Nhấn `Win + X`
2. Chọn **"Windows PowerShell (Admin)"** hoặc **"Terminal (Admin)"**

### Bước 2: Set Execution Policy

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Gõ **Y** và nhấn Enter để xác nhận.

## 🚀 Cách 1: Dùng Script Tự Động (Khuyến nghị)

```powershell
cd D:\AIdancing\backend
.\test-mock.ps1
```

Script sẽ tự động:
- Cài dependencies nếu chưa có
- Start 3 services trong 3 cửa sổ riêng
- Set environment variables đúng cách

## 🚀 Cách 2: Start Manual (3 Terminals)

### Terminal 1 - Mock Kling Server

```powershell
cd D:\AIdancing\backend
npm run mock:kling
```

**Kết quả:**
```
[Mock Kling] Mock Kling API Server running on http://localhost:3002
```

### Terminal 2 - Main Server

```powershell
cd D:\AIdancing\backend
$env:USE_MOCK_KLING="true"
npm start
```

**LƯU Ý:** Phải set environment variable **TRƯỚC** khi chạy `npm start`:
- ✅ ĐÚNG: `$env:USE_MOCK_KLING="true"` rồi `npm start` (2 lệnh riêng)
- ❌ SAI: `USE_MOCK_KLING=true npm start` (không hoạt động trên PowerShell)

**Kết quả:**
```
[Server] Backend running on http://localhost:3001
```

### Terminal 3 - Worker

```powershell
cd D:\AIdancing\backend
$env:USE_MOCK_KLING="true"
npm run worker
```

**Kết quả:**
```
[Worker] Starting worker (poll interval: 3000ms)
```

## ✅ Kiểm Tra Server

Sau khi start, test:

```powershell
curl http://localhost:3001/health
```

Hoặc mở browser:
```
http://localhost:3001/health
```

Phải trả về: `{"status":"ok",...}`

## 🌐 Mở Giao Diện

Sau khi server chạy:
```
http://localhost:3001/
```

## 🐛 Troubleshooting

### Lỗi: "cannot be loaded because running scripts is disabled"

**Giải pháp:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Lỗi: "USE_MOCK_KLING is not set"

**Nguyên nhân:** Set environment variable sai cách

**Giải pháp:**
```powershell
# ĐÚNG - 2 lệnh riêng
$env:USE_MOCK_KLING="true"
npm start

# SAI - 1 lệnh (không hoạt động trên PowerShell)
USE_MOCK_KLING=true npm start
```

### Lỗi: "Port 3001 already in use"

**Giải pháp:**
```powershell
# Tìm process đang dùng port 3001
netstat -ano | findstr :3001

# Kill process (thay PID bằng số từ lệnh trên)
taskkill /PID <PID> /F
```

### Server start nhưng không chạy

**Kiểm tra:**
1. Check terminal có error không
2. Check dependencies: `npm install`
3. Check file `.env` có tồn tại không

## 📋 Checklist

Trước khi mở browser:

- [ ] PowerShell execution policy đã set
- [ ] Terminal 1: Mock server chạy (port 3002)
- [ ] Terminal 2: Main server chạy (port 3001) - **ĐÃ SET `$env:USE_MOCK_KLING="true"`**
- [ ] Terminal 3: Worker chạy - **ĐÃ SET `$env:USE_MOCK_KLING="true"`**
- [ ] Test `/health` endpoint thành công
- [ ] Không có error trong terminal

## 💡 Tips

1. **Lưu script:** Tạo file `start.ps1` với nội dung:
```powershell
$env:USE_MOCK_KLING="true"
npm start
```

2. **Alias:** Thêm vào PowerShell profile:
```powershell
function Start-AIDancing {
    cd D:\AIdancing\backend
    $env:USE_MOCK_KLING="true"
    npm start
}
```

3. **Auto-start:** Dùng script `test-mock.ps1` để tự động start tất cả


