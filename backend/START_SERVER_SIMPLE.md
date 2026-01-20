# 🚀 HƯỚNG DẪN START SERVER ĐƠN GIẢN

## ✅ Bước 1: Mở PowerShell

Mở **PowerShell** (không cần Run as Administrator)

---

## ✅ Bước 2: CD vào thư mục backend

```powershell
cd D:\AIdancing\backend
```

**Kiểm tra:** Bạn phải thấy dòng:
```
PS D:\AIdancing\backend>
```

---

## ✅ Bước 3: Install dependencies (nếu chưa)

```powershell
npm install
```

**Đợi:** Cho đến khi thấy `added X packages` và `found 0 vulnerabilities`

---

## ✅ Bước 4: Set environment variable

```powershell
$env:USE_MOCK_KLING="true"
```

**Kiểm tra:** Không có thông báo lỗi = OK

---

## ✅ Bước 5: Chạy server

```powershell
node server.js
```

**Phải thấy:**
```
[Server] Backend running on http://localhost:3001
[Server] DAY 2: Upload + Payment + TikTok
```

---

## ✅ Bước 6: Mở browser

Mở trình duyệt và truy cập:
```
http://localhost:3001/
```

---

## 🔴 Nếu gặp lỗi

### Lỗi: `npm: command not found`
→ Chưa cài Node.js. Tải tại: https://nodejs.org/

### Lỗi: `Cannot find module 'xxx'`
→ Chạy lại: `npm install`

### Lỗi: `Port 3001 already in use`
→ Có process khác đang dùng port 3001.
→ Tìm và kill process:
```powershell
netstat -ano | findstr :3001
taskkill /PID <PID_NUMBER> /F
```

### Lỗi: `ERR_CONNECTION_REFUSED`
→ Server chưa chạy hoặc đã tắt.
→ Kiểm tra lại Terminal có thấy dòng `Backend running` không.

---

## 📝 QUICK START (Copy toàn bộ vào PowerShell)

```powershell
cd D:\AIdancing\backend
npm install
$env:USE_MOCK_KLING="true"
node server.js
```

---

## 💡 LƯU Ý

1. **Giữ Terminal mở** → Nếu đóng Terminal, server sẽ tắt
2. **Chỉ cần 1 Terminal** → Không cần chạy worker riêng cho test UI
3. **Mock mode** → Dùng `$env:USE_MOCK_KLING="true"` để test không cần API key thật
4. **Port 3001** → Server chạy trên port 3001

---

## 🧪 TEST SERVER

Sau khi start, test bằng PowerShell:

```powershell
curl http://localhost:3001/health
```

**Phải trả về:**
```json
{"status":"ok","timestamp":"2026-01-20T..."}
```

---

## ✅ CHECKLIST

- [ ] Đã cd vào `D:\AIdancing\backend`
- [ ] Đã chạy `npm install`
- [ ] Đã set `$env:USE_MOCK_KLING="true"`
- [ ] Đã chạy `node server.js`
- [ ] Thấy dòng `Backend running on http://localhost:3001`
- [ ] Mở được `http://localhost:3001/` trong browser
- [ ] Test `/health` trả về JSON OK

