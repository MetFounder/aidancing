# 🔧 Railway - Fix Root Directory (UI Mới)

## ❌ Vấn Đề

Không thấy "Root Directory" trong Settings → Source

**Nguyên nhân:** Railway UI đã thay đổi, root directory có thể set bằng cách khác.

---

## ✅ CÁCH FIX

### **Option 1: Dùng railway.json (Khuyến nghị)**

Railway sẽ tự động detect `railway.json` trong repo root.

**Đã tạo file:** `railway.json` trong root folder

**File này sẽ:**
- Set build command: `cd backend && npm install`
- Set start command: `cd backend && node server.js`
- Railway tự động detect và dùng

**Bước tiếp theo:**
1. Push file `railway.json` lên GitHub
2. Railway tự động redeploy
3. Check logs

---

### **Option 2: Tạo Service Mới với Root Directory**

1. **Delete service cũ:**
   - Settings → Danger Zone → Delete Service

2. **Tạo service mới:**
   - New → Empty Service
   - Connect GitHub repo
   - **Khi tạo, có option "Root Directory"** → Nhập `backend`

---

### **Option 3: Dùng Dockerfile**

Tạo `Dockerfile` trong root:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
EXPOSE 3001
CMD ["node", "server.js"]
```

Railway sẽ tự động detect Dockerfile.

---

### **Option 4: Check Settings → Deploy**

1. Vào Settings → **"Deploy"** tab
2. Tìm **"Root Directory"** hoặc **"Working Directory"**
3. Set = `backend`

---

## 🚀 QUICK FIX (Khuyến nghị)

### **Bước 1: Push railway.json**

```powershell
cd D:\AIdancing
git add railway.json
git commit -m "Add Railway config with backend root directory"
git push
```

### **Bước 2: Redeploy trên Railway**

1. Railway Dashboard → Service
2. Tab **"Deployments"**
3. Click **"Redeploy"** (hoặc 3 dots → Redeploy)
4. Đợi 2-3 phút
5. Check logs

### **Bước 3: Verify**

1. Check logs → Phải thấy:
   ```
   cd backend && npm install
   cd backend && node server.js
   ```
2. Service phải start thành công

---

## 📋 CHECKLIST

- [ ] File `railway.json` đã push lên GitHub
- [ ] Đã redeploy trên Railway
- [ ] Logs không còn lỗi "Error creating build plan"
- [ ] Service status = "Active"

---

## 🐛 NẾU VẪN LỖI

### **Thử Option 4: Tạo Service Mới**

1. **Delete service cũ:**
   - Settings → Scroll xuống → **"Delete Service"**

2. **Tạo lại:**
   - New → Empty Service
   - Connect GitHub: `MetFounder/aidancing`
   - **Khi setup, có field "Root Directory"** → Nhập `backend`
   - Start Command: `node server.js`

---

## 💡 LƯU Ý

Railway UI có thể khác nhau tùy version. Nếu không thấy "Root Directory":
- Dùng `railway.json` (tự động)
- Hoặc tạo service mới (có option khi tạo)

---

## ✅ NEXT STEPS

1. Push `railway.json` lên GitHub
2. Redeploy trên Railway
3. Check logs → Phải OK!

