# 📖 Hướng Dẫn Mở Admin Dashboard

Hướng dẫn chi tiết từng bước để mở Admin Dashboard.

## 🎯 Mục Tiêu

Mở Admin Dashboard tại: `http://localhost:3001/admin/admin.html`

## 📋 Bước 1: Đảm Bảo Services Đang Chạy

Trước khi mở dashboard, bạn cần start 3 services:

### Terminal 1 - Mock Kling Server
```bash
cd backend
npm run mock:kling
```

**Kết quả mong đợi:**
```
[Mock Kling] Mock Kling API Server running on http://localhost:3002
[Mock Kling] Endpoints:
  POST   /api/v1/jobs/createTask
  GET    /api/v1/jobs/:taskId
  ...
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

## 🌐 Bước 2: Mở Browser

Bạn có thể dùng bất kỳ browser nào:
- ✅ Google Chrome
- ✅ Microsoft Edge
- ✅ Firefox
- ✅ Safari (Mac)

## 🔗 Bước 3: Nhập URL

### Cách 1: Nhập trực tiếp vào Address Bar

1. **Mở browser**
2. **Click vào thanh địa chỉ (Address Bar)** ở trên cùng
3. **Xóa mọi thứ** trong đó (hoặc click vào thanh địa chỉ)
4. **Gõ chính xác:**
   ```
   http://localhost:3001/admin/admin.html
   ```
5. **Nhấn Enter**

### Cách 2: Copy-Paste URL

1. **Copy URL này:**
   ```
   http://localhost:3001/admin/admin.html
   ```
2. **Mở browser**
3. **Click vào thanh địa chỉ**
4. **Paste URL** (Ctrl+V hoặc Cmd+V)
5. **Nhấn Enter**

### Cách 3: Từ Command Line (Windows)

```powershell
# Mở Chrome
start chrome http://localhost:3001/admin/admin.html

# Hoặc mở Edge
start msedge http://localhost:3001/admin/admin.html
```

### Cách 4: Từ Command Line (Mac/Linux)

```bash
# Mở Chrome
open -a "Google Chrome" http://localhost:3001/admin/admin.html

# Hoặc mở default browser
open http://localhost:3001/admin/admin.html
```

## ✅ Bước 4: Kiểm Tra

Sau khi nhấn Enter, bạn sẽ thấy:

### ✅ Thành Công:
- Trang web hiển thị với tiêu đề: **"🎭 AI Dancing - Mock API Test Dashboard"**
- Có các section:
  - ⚙️ Configuration
  - 🚀 Create New Job
  - 📋 Jobs List
  - 🔍 Mock Server Tasks
- Server Status hiển thị: **"Online"** (màu xanh)

### ❌ Lỗi Thường Gặp:

#### 1. "This site can't be reached" hoặc "ERR_CONNECTION_REFUSED"
**Nguyên nhân:** Main server chưa chạy hoặc chạy sai port

**Giải pháp:**
- Check Terminal 2 có đang chạy `npm start` không
- Check log có dòng `Backend running on http://localhost:3001` không
- Thử truy cập: `http://localhost:3001/health` (phải trả về JSON)

#### 2. "404 Not Found"
**Nguyên nhân:** File admin.html không tồn tại hoặc path sai

**Giải pháp:**
- Check file có tồn tại: `backend/public/admin.html`
- Check server.js có serve static files không
- Thử truy cập: `http://localhost:3001/health` (để verify server chạy)

#### 3. Trang trắng hoặc không load
**Nguyên nhân:** JavaScript error hoặc CORS issue

**Giải pháp:**
- Mở **Developer Tools** (F12)
- Check tab **Console** có lỗi không
- Check tab **Network** xem requests có fail không

#### 4. "Server Status: Offline"
**Nguyên nhân:** Server chưa start hoặc đang lỗi

**Giải pháp:**
- Check Terminal 2 có error không
- Restart server: `USE_MOCK_KLING=true npm start`
- Check port 3001 có bị chiếm không: `netstat -ano | findstr :3001`

## 🧪 Bước 5: Test Dashboard

Sau khi dashboard mở thành công:

1. **Check Server Status:**
   - Phải hiển thị: **"Online"** (màu xanh)
   - Nếu "Offline" (màu đỏ) → check server đang chạy không

2. **Test Tạo Job:**
   - Điền Image URL: `https://picsum.photos/800/800`
   - Điền Video URL: `https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4`
   - Click **"Create Job"**
   - Phải thấy message: "Job created successfully!"

3. **Xem Jobs:**
   - Click **"Refresh"** trong section "Jobs List"
   - Phải thấy job vừa tạo với status "pending" hoặc "processing"

## 🔍 Troubleshooting Chi Tiết

### Check Server Có Chạy Không

**Windows PowerShell:**
```powershell
# Check port 3001
netstat -ano | findstr :3001

# Nếu có output → port đang được dùng (server đang chạy)
# Nếu không có output → server chưa chạy
```

**Mac/Linux:**
```bash
# Check port 3001
lsof -i :3001

# Hoặc
netstat -an | grep 3001
```

### Test Server Bằng Curl

```bash
# Test health endpoint
curl http://localhost:3001/health

# Phải trả về:
# {"status":"ok","timestamp":"2024-01-01T00:00:00.000Z"}
```

### Test Admin Route

```bash
# Test admin route
curl http://localhost:3001/admin/admin.html

# Phải trả về HTML content
```

## 📸 Screenshot Mô Tả

Khi mở thành công, bạn sẽ thấy:

```
┌─────────────────────────────────────────┐
│ 🎭 AI Dancing - Mock API Test Dashboard │
│ Server Status: Online (màu xanh)       │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ⚙️ Configuration                        │
│ Main Server URL: http://localhost:3001  │
│ Mock Server URL: http://localhost:3002  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 🚀 Create New Job                        │
│ [Image URL input]                       │
│ [Video URL input]                       │
│ [✓] Keep Original Sound                 │
│ [Create Job button]                     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 📋 Jobs List                            │
│ [Refresh] [Clear All]                   │
│ [Job items sẽ hiển thị ở đây]          │
└─────────────────────────────────────────┘
```

## 🎯 Quick Checklist

Trước khi mở dashboard, đảm bảo:

- [ ] Terminal 1: Mock server chạy (port 3002)
- [ ] Terminal 2: Main server chạy (port 3001)
- [ ] Terminal 3: Worker chạy
- [ ] Browser đã mở
- [ ] URL đúng: `http://localhost:3001/admin/admin.html`
- [ ] Không có firewall block port 3001

## 💡 Tips

1. **Bookmark URL:** Lưu `http://localhost:3001/admin/admin.html` vào bookmark để mở nhanh sau này

2. **Shortcut:** Tạo desktop shortcut với URL này

3. **Auto-open:** Thêm vào script start để tự động mở browser:
   ```bash
   # Sau khi start server
   start http://localhost:3001/admin/admin.html
   ```

4. **Multiple Tabs:** Có thể mở nhiều tabs để monitor nhiều jobs cùng lúc

## 🆘 Vẫn Không Mở Được?

Nếu vẫn gặp vấn đề:

1. **Check tất cả services đang chạy:**
   ```bash
   # Terminal 1
   npm run mock:kling
   
   # Terminal 2  
   USE_MOCK_KLING=true npm start
   
   # Terminal 3
   USE_MOCK_KLING=true npm run worker
   ```

2. **Check logs có error không**

3. **Thử truy cập health endpoint trước:**
   ```
   http://localhost:3001/health
   ```
   Phải trả về JSON: `{"status":"ok",...}`

4. **Check file tồn tại:**
   ```bash
   ls backend/public/admin.html
   # Hoặc Windows:
   dir backend\public\admin.html
   ```

5. **Restart tất cả services**

Nếu vẫn không được, paste error message để tôi hỗ trợ!


