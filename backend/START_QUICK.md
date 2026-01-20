# ⚡ QUICK START - Mở Localhost

## ❌ Lỗi: ERR_CONNECTION_REFUSED

**Nguyên nhân:** Server chưa chạy!

## ✅ Giải pháp: Start Server

### Cách 1: Dùng Script Tự Động (Khuyến nghị)

**Mở PowerShell:**
```powershell
cd D:\AIdancing\backend
.\test-mock.ps1
```

Script sẽ tự động start tất cả services.

---

### Cách 2: Start Manual (3 Terminals)

**Mở 3 cửa sổ PowerShell/Terminal:**

#### Terminal 1 - Mock Kling Server
```powershell
cd D:\AIdancing\backend
npm run mock:kling
```

**Kết quả:**
```
[Mock Kling] Mock Kling API Server running on http://localhost:3002
```

#### Terminal 2 - Main Server
```powershell
cd D:\AIdancing\backend
$env:USE_MOCK_KLING="true"
npm start
```

**LƯU Ý:** Phải là 2 lệnh riêng (không gộp):
- ✅ ĐÚNG: `$env:USE_MOCK_KLING="true"` rồi `npm start` (2 dòng)
- ❌ SAI: `USE_MOCK_KLING=true npm start` (không hoạt động trên PowerShell)

**Kết quả:**
```
[Server] Backend running on http://localhost:3001
```

#### Terminal 3 - Worker
```powershell
cd D:\AIdancing\backend
$env:USE_MOCK_KLING="true"
npm run worker
```

**Kết quả:**
```
[Worker] Starting worker (poll interval: 3000ms)
```

---

## ✅ Kiểm Tra Server Đã Chạy

Sau khi start, test:

```powershell
curl http://localhost:3001/health
```

Hoặc mở browser:
```
http://localhost:3001/health
```

**Phải trả về:** `{"status":"ok",...}`

---

## 🌐 Mở Giao Diện

Sau khi server chạy:
```
http://localhost:3001/
```

---

## ⚠️ Lưu Ý Quan Trọng

1. **Phải giữ 3 terminals mở** trong khi dùng
2. Nếu đóng terminal → server sẽ tắt → lỗi ERR_CONNECTION_REFUSED
3. **Environment variable:** Phải set `$env:USE_MOCK_KLING="true"` TRƯỚC khi chạy `npm start`

---

## 🐛 Nếu Vẫn Không Chạy Được

### Check Dependencies
```powershell
cd D:\AIdancing\backend
npm install
```

### Check Port Bị Chiếm
```powershell
netstat -ano | findstr :3001
```

Nếu có output → Port đang được dùng (server đã chạy)

### Test Server Trực Tiếp
```powershell
cd D:\AIdancing\backend
$env:USE_MOCK_KLING="true"
node server.js
```

Nếu có lỗi → xem error message

---

## 📝 Checklist

Trước khi mở browser, đảm bảo:

- [ ] Terminal 1: Mock server chạy (port 3002)
- [ ] Terminal 2: Main server chạy (port 3001) - **ĐÃ SET `$env:USE_MOCK_KLING="true"`**
- [ ] Terminal 3: Worker chạy - **ĐÃ SET `$env:USE_MOCK_KLING="true"`**
- [ ] Test `/health` endpoint thành công
- [ ] Không có error trong terminal

---

## 💡 Quick Fix

Nếu đã start nhưng vẫn lỗi:

1. **Stop tất cả:** Đóng tất cả terminals
2. **Restart:** Start lại theo hướng dẫn trên
3. **Test:** `curl http://localhost:3001/health`
4. **Mở:** `http://localhost:3001/`

