# 🐛 Debug: Server Không Start

## Bước 1: Kiểm Tra Cơ Bản

### 1.1 Check Node.js và npm
```powershell
node --version
npm --version
```

Phải có output (ví dụ: v22.11.0, 10.9.0)

### 1.2 Check Dependencies
```powershell
cd D:\AIdancing\backend
npm install
```

### 1.3 Check Files
```powershell
Test-Path server.js
Test-Path package.json
Test-Path node_modules
```

Tất cả phải trả về `True`

## Bước 2: Test Start Server Trực Tiếp

### Cách 1: Dùng Script Test
```powershell
cd D:\AIdancing\backend
.\test-server.ps1
```

### Cách 2: Manual
```powershell
cd D:\AIdancing\backend
$env:USE_MOCK_KLING="true"
node server.js
```

**Kết quả mong đợi:**
```
[Server] Backend running on http://localhost:3001
[Server] DAY 1: Backend Core + Kling Motion Control
```

## Bước 3: Kiểm Tra Lỗi

### Nếu có lỗi "Cannot find module"

**Lỗi:**
```
Error: Cannot find module 'express'
```

**Giải pháp:**
```powershell
cd D:\AIdancing\backend
npm install
```

### Nếu có lỗi "Port already in use"

**Lỗi:**
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Giải pháp:**
```powershell
# Tìm process đang dùng port 3001
netstat -ano | findstr :3001

# Kill process (thay PID bằng số từ lệnh trên)
taskkill /PID <PID> /F
```

### Nếu có lỗi "ENOENT"

**Lỗi:**
```
Error: ENOENT: no such file or directory
```

**Giải pháp:**
- Check file `public/index.html` có tồn tại không
- Check đường dẫn trong `server.js` có đúng không

### Nếu server start nhưng không response

**Kiểm tra:**
```powershell
# Test health endpoint
curl http://localhost:3001/health

# Hoặc
Invoke-WebRequest http://localhost:3001/health
```

## Bước 4: Test Từng Bước

### Test 1: Start Server Không Có Mock
```powershell
cd D:\AIdancing\backend
node server.js
```

Nếu lỗi → vấn đề ở server.js hoặc dependencies

### Test 2: Start Với Mock
```powershell
cd D:\AIdancing\backend
$env:USE_MOCK_KLING="true"
node server.js
```

Nếu lỗi → vấn đề ở klingClient.js hoặc mock config

### Test 3: Check Port
```powershell
netstat -ano | findstr :3001
```

Nếu có output → port đang được dùng
Nếu không có output → server chưa start

## Bước 5: Collect Thông Tin

Nếu vẫn lỗi, chạy và gửi output:

```powershell
cd D:\AIdancing\backend

# 1. Node version
node --version

# 2. NPM version  
npm --version

# 3. Check files
Get-ChildItem | Select-Object Name

# 4. Check dependencies
Test-Path node_modules

# 5. Try start với output đầy đủ
$env:USE_MOCK_KLING="true"
node server.js 2>&1
```

## Quick Fix Checklist

- [ ] Node.js đã cài (check: `node --version`)
- [ ] Dependencies đã cài (`npm install`)
- [ ] File `server.js` tồn tại
- [ ] File `public/index.html` tồn tại
- [ ] Port 3001 không bị chiếm
- [ ] Không có firewall block
- [ ] Environment variable đã set đúng (`$env:USE_MOCK_KLING="true"`)

## Nếu Vẫn Không Được

Gửi cho tôi:
1. Output của `node server.js` (toàn bộ error message)
2. Output của `node --version` và `npm --version`
3. Output của `Get-ChildItem backend` (danh sách files)
4. Screenshot terminal nếu có


