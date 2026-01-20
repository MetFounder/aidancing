# 🐛 Railway Troubleshooting - Service Offline

## ❌ Lỗi: "Service is offline"

### **Nguyên Nhân Thường Gặp:**

1. **Service chưa deploy xong** (đang build)
2. **Service deploy failed** (lỗi build/start)
3. **Root Directory chưa set đúng**
4. **Start Command sai**
5. **Thiếu environment variables**
6. **Port conflict**

---

## 🔍 CÁCH KIỂM TRA

### **Bước 1: Check Deployment Status**

1. Vào Railway Dashboard
2. Click vào service
3. Click tab **"Deployments"**
4. Xem deployment mới nhất:
   - **Status:** 
     - ✅ **"Active"** = OK
     - ⚠️ **"Building"** = Đang build, đợi thêm
     - ❌ **"Failed"** = Có lỗi, xem logs

### **Bước 2: Check Logs**

1. Click vào deployment mới nhất
2. Click **"View Logs"** (hoặc tab **"Logs"**)
3. Xem error messages

**Các lỗi thường gặp:**

#### **Lỗi 1: "Cannot find module"**
```
Error: Cannot find module 'express'
```
**Fix:** Root Directory chưa đúng → Set `backend`

#### **Lỗi 2: "Port already in use"**
```
Error: Port 3001 is already in use
```
**Fix:** Railway tự set PORT, không cần lo

#### **Lỗi 3: "Command failed"**
```
Error: Command 'npm start' failed
```
**Fix:** Check Start Command = `node server.js`

#### **Lỗi 4: "ENOENT: no such file or directory"**
```
Error: ENOENT: no such file or directory, open 'server.js'
```
**Fix:** Root Directory = `backend` (quan trọng!)

---

## ✅ CÁCH FIX

### **Fix 1: Set Root Directory**

1. Vào Service → **Settings** → **Source**
2. **Root Directory:** Nhập `backend`
3. Click **"Save"**
4. Railway tự động redeploy

### **Fix 2: Set Start Command**

1. Vào Service → **Settings** → **Deploy**
2. **Start Command:** `node server.js`
3. Click **"Save"**
4. Railway tự động redeploy

### **Fix 3: Check Environment Variables**

1. Vào Service → **Variables**
2. Đảm bảo có:
   - `PORT=3001`
   - `NODE_ENV=production`
   - Các variables khác

### **Fix 4: Check package.json**

Railway cần `package.json` trong root directory.

**Verify:**
- File `backend/package.json` có tồn tại
- Có script `"start": "node server.js"`

---

## 🔄 REDEPLOY MANUAL

Nếu vẫn lỗi, thử redeploy:

1. Vào Service → **Deployments**
2. Click **"Redeploy"** (hoặc 3 dots → Redeploy)
3. Đợi 2-3 phút
4. Check logs lại

---

## 📋 CHECKLIST

- [ ] Root Directory = `backend`
- [ ] Start Command = `node server.js`
- [ ] Environment variables đã set
- [ ] package.json có trong `backend/`
- [ ] Logs không có errors
- [ ] Deployment status = "Active"

---

## 🎯 QUICK FIX

**Nếu vẫn lỗi, làm theo thứ tự:**

1. **Settings → Source → Root Directory:** `backend` → Save
2. **Settings → Deploy → Start Command:** `node server.js` → Save
3. **Variables → Add:** `PORT=3001`, `NODE_ENV=production` → Save
4. **Deployments → Redeploy**
5. **Đợi 2-3 phút → Check logs**

---

## 💡 LƯU Ý

- Railway tự động set `PORT` environment variable
- Code đã dùng: `process.env.PORT || 3001` → OK
- Không cần lo về port conflict

---

## 📞 NẾU VẪN LỖI

Cung cấp:
1. Screenshot logs từ Railway
2. Error message cụ thể
3. Deployment status
4. Root Directory đã set chưa

