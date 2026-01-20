# ⚡ QUICK DEPLOY - Hướng Dẫn Nhanh

## 🎯 3 BƯỚC ĐỂ DEPLOY

### **BƯỚC 1: Push lên GitHub (5 phút)**

```powershell
cd D:\AIdancing
.\push-to-github.ps1
```

Hoặc manual:
```powershell
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

### **BƯỚC 2: Deploy lên Railway (10 phút)**

1. **Đăng ký Railway:**
   - Vào: https://railway.app
   - Login bằng GitHub

2. **Tạo Project:**
   - Click **"New Project"**
   - Chọn **"Deploy from GitHub repo"**
   - Chọn repo `aidancing`

3. **Setup:**
   - **Root Directory:** `backend`
   - **Start Command:** `node server.js`

4. **Environment Variables:**
   - Vào **Settings** → **Variables**
   - Thêm:
     ```
     PORT=3001
     USE_MOCK_KLING=true
     BASE_RPC_URL=https://sepolia.base.org
     NODE_ENV=production
     ```

5. **Deploy:**
   - Railway tự động deploy
   - Lấy domain: `your-app.railway.app`

---

### **BƯỚC 3: Kết nối Domain (10 phút)**

1. **Trên Railway:**
   - Vào **Settings** → **Domains**
   - Click **"Custom Domain"**
   - Nhập domain: `yourdomain.com`
   - Railway hiển thị DNS records

2. **Trên DNS Provider (Namecheap/GoDaddy/Cloudflare):**
   - Vào DNS settings
   - Thêm **CNAME** record:
     ```
     Type: CNAME
     Host: @
     Value: your-app.railway.app
     TTL: Automatic
     ```

3. **Đợi 5-10 phút:**
   - DNS propagate
   - Railway tự động setup SSL

4. **Test:**
   - Mở `https://yourdomain.com`
   - Phải hoạt động!

---

## ✅ DONE!

Sau 3 bước trên, bạn đã có:
- ✅ Code trên GitHub
- ✅ App chạy trên Railway
- ✅ Domain kết nối với app
- ✅ SSL tự động (HTTPS)

---

## 🔧 LƯU Ý QUAN TRỌNG

### **Worker cần chạy riêng:**

Railway không tự động chạy worker. Cần:

1. **Tạo Service thứ 2:**
   - **New** → **Empty Service**
   - **Root Directory:** `backend`
   - **Start Command:** `node worker.js`
   - **Environment Variables:** Giống service chính

2. **Hoặc dùng PM2:**
   - Sửa `package.json`:
     ```json
     "scripts": {
       "start": "node server.js & node worker.js"
     }
     ```
   - ⚠️ Không khuyến nghị (khó monitor)

---

## 🐛 NẾU GẶP LỖI

### **Lỗi: Cannot find module**
→ Check `package.json` có đúng dependencies không

### **Lỗi: Port already in use**
→ Railway tự động set PORT, không cần lo

### **Lỗi: Domain không hoạt động**
→ Check DNS records, đợi DNS propagate

### **Lỗi: Worker không chạy**
→ Tạo service riêng cho worker (xem trên)

---

## 📞 CẦN HỖ TRỢ?

Cung cấp:
1. Hosting platform (Railway/Render/VPS?)
2. Domain provider (Namecheap/GoDaddy/Cloudflare?)
3. Error message/logs

