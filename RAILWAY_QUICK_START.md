# ⚡ Railway Quick Start - 5 Phút

## 🚀 3 BƯỚC NHANH

### **BƯỚC 1: Push GitHub (2 phút)**

```powershell
cd D:\AIdancing
.\push-to-github.ps1
```

Hoặc:
```powershell
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

### **BƯỚC 2: Deploy Railway (2 phút)**

1. **Đăng ký:** https://railway.app → Login with GitHub

2. **Tạo Project:**
   - Click **"New Project"**
   - Chọn **"Deploy from GitHub repo"**
   - Chọn repo `aidancing`

3. **Setup:**
   - **Root Directory:** `backend`
   - **Start Command:** `node server.js`

4. **Environment Variables:**
   - Settings → Variables → Add:
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

### **BƯỚC 3: Kết Nối Domain (1 phút)**

1. **Trên Railway:**
   - Settings → Networking → Custom Domain
   - Nhập: `yourdomain.com`
   - Railway hiển thị DNS records

2. **Trên Namecheap:**
   - Domain List → Manage → Advanced DNS
   - Add CNAME:
     ```
     Type: CNAME
     Host: @
     Value: your-app.railway.app
     ```

3. **Đợi 5-10 phút:**
   - DNS propagate
   - Railway tự động setup SSL

4. **Test:**
   - Mở `https://yourdomain.com`
   - Phải hoạt động!

---

## ✅ DONE!

- ✅ Code trên GitHub
- ✅ App trên Railway
- ✅ Domain kết nối
- ✅ Auto deploy hoạt động

---

## 🔧 WORKER PROCESS

**Cần tạo service thứ 2:**

1. Railway Project → **"New"** → **"Empty Service"**
2. **Root Directory:** `backend`
3. **Start Command:** `node worker.js`
4. **Environment Variables:** Copy từ service chính
5. Deploy

---

## 🐛 NẾU LỖI

- Check logs: Railway Dashboard → Deployments → View Logs
- Check DNS: Verify records trên Namecheap
- Check env vars: Settings → Variables

---

Xem chi tiết: `RAILWAY_DEPLOY.md`

