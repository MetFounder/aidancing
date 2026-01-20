# 🚂 Hướng Dẫn Deploy lên Railway (1 Service)

## 🎯 Tổng Quan

Deploy toàn bộ app (frontend + backend) lên Railway với:
- ✅ Auto deploy từ GitHub
- ✅ Free tier: $5 credit/tháng
- ✅ SSL tự động
- ✅ Custom domain (Namecheap)
- ✅ Environment variables
- ✅ Worker process

---

## 📋 CHECKLIST TRƯỚC KHI BẮT ĐẦU

- [ ] Code đã push lên GitHub
- [ ] Có tài khoản Railway (đăng ký tại: https://railway.app)
- [ ] Domain đã mua ở Namecheap
- [ ] Đã chuẩn bị environment variables

---

## 🚀 BƯỚC 1: Push Code lên GitHub

### 1.1. Tạo GitHub Repository

1. Đăng nhập GitHub: https://github.com
2. Click **"New repository"** (góc phải trên)
3. Đặt tên: `aidancing` (hoặc tên khác)
4. Chọn **Public** hoặc **Private**
5. **KHÔNG** check "Initialize with README"
6. Click **"Create repository"**

### 1.2. Push Code

**Mở PowerShell trong thư mục project:**

```powershell
cd D:\AIdancing

# Chạy script tự động
.\push-to-github.ps1
```

**Hoặc làm manual:**

```powershell
# Kiểm tra git
git --version

# Nếu chưa có git, cài từ: https://git-scm.com/download/win

# Khởi tạo git (nếu chưa có)
git init

# Thêm tất cả files
git add .

# Commit
git commit -m "Initial commit: AI Dancing MVP"

# Thêm remote (thay YOUR_USERNAME và YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push
git branch -M main
git push -u origin main
```

**Lưu ý:**
- Lần đầu push sẽ hỏi GitHub credentials
- Nên dùng **Personal Access Token** thay vì password
- Tạo token tại: https://github.com/settings/tokens
- Token cần quyền: `repo` (full control)

---

## 🚂 BƯỚC 2: Deploy lên Railway

### 2.1. Đăng Ký Railway

1. Vào: https://railway.app
2. Click **"Start a New Project"**
3. Chọn **"Login with GitHub"**
4. Authorize Railway access GitHub
5. Đăng nhập thành công

### 2.2. Tạo Project từ GitHub

1. Trong Railway Dashboard, click **"New Project"**
2. Chọn **"Deploy from GitHub repo"**
3. Chọn repository `aidancing` (hoặc tên repo của bạn)
4. Railway sẽ tự động detect và deploy

### 2.3. Setup Build Settings

Railway tự động detect Node.js, nhưng cần config:

1. Vào **Settings** → **Service**
2. **Root Directory:** `backend`
3. **Start Command:** `node server.js`
4. **Healthcheck Path:** `/health` (optional)

**Hoặc sửa `package.json` trong `backend/`:**

```json
{
  "scripts": {
    "start": "node server.js",
    "worker": "node worker.js"
  }
}
```

Railway sẽ tự động chạy `npm install` và `npm start`.

---

## ⚙️ BƯỚC 3: Setup Environment Variables

1. Vào **Settings** → **Variables**
2. Click **"New Variable"**
3. Thêm các biến sau:

```
PORT=3001
NODE_ENV=production
USE_MOCK_KLING=true
MOCK_KLING_URL=http://localhost:3002
BASE_RPC_URL=https://sepolia.base.org
PAYMENT_RECIPIENT=0xYOUR_WALLET_ADDRESS
```

**Lưu ý:**
- **KHÔNG** commit `.env` lên GitHub
- Set tất cả variables trên Railway
- Nếu dùng Kling API thật, thêm:
  ```
  KLING_API_KEY=your_key_here
  KLING_BASE_URL=https://api.kie.ai
  USE_MOCK_KLING=false
  ```

---

## 🔄 BƯỚC 4: Setup Worker Process

Railway không tự động chạy worker. Có 2 cách:

### **Option A: Tạo Service thứ 2 cho Worker (Khuyến nghị)**

1. Trong Railway Project, click **"New"** → **"Empty Service"**
2. **Root Directory:** `backend`
3. **Start Command:** `node worker.js`
4. **Environment Variables:** Copy từ service chính
5. Deploy

**Ưu điểm:**
- Worker chạy độc lập
- Dễ monitor
- Có thể scale riêng

### **Option B: Dùng PM2 (Không khuyến nghị)**

Sửa `package.json`:
```json
{
  "scripts": {
    "start": "pm2 start ecosystem.config.js --no-daemon"
  }
}
```

Tạo `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [
    {
      name: 'server',
      script: 'server.js'
    },
    {
      name: 'worker',
      script: 'worker.js'
    }
  ]
};
```

**Nhược điểm:**
- Khó monitor từng process
- Logs trộn lẫn

---

## 🌐 BƯỚC 5: Kết Nối Domain (Namecheap)

### 5.1. Lấy Railway Domain

1. Vào Railway Dashboard → Project → Service
2. Click tab **"Settings"** → **"Networking"**
3. Railway cung cấp domain: `your-app.railway.app`
4. Copy domain này

### 5.2. Setup Custom Domain trên Railway

1. Vào **Settings** → **Networking** → **"Custom Domain"**
2. Click **"Add Custom Domain"**
3. Nhập domain: `yourdomain.com` (hoặc `www.yourdomain.com`)
4. Railway sẽ hiển thị DNS records cần thêm

**Railway sẽ hiển thị:**
```
Type: CNAME
Name: @
Value: your-app.railway.app
```

### 5.3. Cấu Hình DNS trên Namecheap

1. Đăng nhập Namecheap: https://www.namecheap.com
2. Vào **Domain List** → Click **"Manage"** bên cạnh domain
3. Vào tab **"Advanced DNS"**
4. Xóa các records cũ (nếu có)
5. Thêm **CNAME Record**:

   ```
   Type: CNAME Record
   Host: @
   Value: your-app.railway.app
   TTL: Automatic (hoặc 300)
   ```

6. (Optional) Thêm **CNAME cho www**:

   ```
   Type: CNAME Record
   Host: www
   Value: your-app.railway.app
   TTL: Automatic
   ```

7. Click **"Save All Changes"**

### 5.4. Đợi DNS Propagate

- Thời gian: 5-30 phút (có thể lâu hơn)
- Railway tự động detect và setup SSL
- Check status trên Railway Dashboard

### 5.5. Verify Domain

1. Vào Railway → Settings → Networking
2. Check domain status: **"Valid"** = OK
3. SSL certificate tự động được issue
4. Test: Mở `https://yourdomain.com`

---

## ✅ BƯỚC 6: Test Production

### 6.1. Test Basic

1. Mở `https://yourdomain.com`
2. Phải load được giao diện
3. Check Console (F12) → Không có lỗi

### 6.2. Test API

1. Test health endpoint:
   ```
   https://yourdomain.com/health
   ```
   Phải trả về: `{"status":"ok",...}`

2. Test upload:
   - Upload image → Phải thành công
   - Upload video → Phải thành công

3. Test wallet:
   - Connect wallet → Phải kết nối được
   - Check network: Base Sepolia (hoặc Mainnet)

4. Test generate:
   - Upload image + video
   - Connect wallet
   - Pay → Generate
   - Check job status

### 6.3. Check Logs

1. Vào Railway Dashboard → Service
2. Click tab **"Deployments"** → Chọn deployment mới nhất
3. Click **"View Logs"**
4. Check:
   - Server started: `Backend running on http://localhost:3001`
   - Worker started: `Starting worker...`
   - Không có errors

---

## 🔄 AUTO DEPLOY Setup

Railway tự động setup auto deploy khi connect GitHub repo.

### Cách hoạt động:

1. **Push code lên GitHub:**
   ```powershell
   git add .
   git commit -m "Update code"
   git push
   ```

2. **Railway tự động:**
   - Nhận webhook từ GitHub
   - Pull code mới
   - Run `npm install`
   - Run `npm start`
   - Deploy → Live

3. **Check deployment:**
   - Vào Railway Dashboard
   - Tab **"Deployments"**
   - Xem status: **"Active"** = OK

### Disable Auto Deploy (nếu cần):

1. Vào **Settings** → **Service**
2. **Auto Deploy:** Toggle OFF
3. Deploy manual từ Dashboard

---

## 🐛 TROUBLESHOOTING

### **Lỗi: Build failed**

**Nguyên nhân:**
- Dependencies không install được
- Build command sai

**Fix:**
- Check logs trên Railway
- Check `package.json` có đúng không
- Check `Root Directory` = `backend`

### **Lỗi: Port already in use**

**Nguyên nhân:**
- Railway tự động set PORT, không cần lo

**Fix:**
- Railway tự động set `PORT` environment variable
- Code đã dùng: `process.env.PORT || 3001`

### **Lỗi: Domain không resolve**

**Nguyên nhân:**
- DNS chưa propagate
- DNS records sai

**Fix:**
1. Check DNS records trên Namecheap
2. Verify trên Railway: Settings → Networking
3. Đợi 5-30 phút
4. Test: `nslookup yourdomain.com`

### **Lỗi: SSL certificate failed**

**Nguyên nhân:**
- DNS chưa point đúng
- Domain chưa verify

**Fix:**
1. Check DNS records
2. Đợi DNS propagate
3. Railway tự động retry SSL

### **Lỗi: Worker không chạy**

**Nguyên nhân:**
- Worker chưa được deploy

**Fix:**
- Tạo service thứ 2 cho worker (xem Bước 4)

### **Lỗi: Environment variables missing**

**Nguyên nhân:**
- Chưa set trên Railway

**Fix:**
- Vào Settings → Variables
- Thêm tất cả variables cần thiết

---

## 📊 MONITORING

### **Railway Dashboard:**

1. **Metrics:**
   - CPU usage
   - Memory usage
   - Network traffic

2. **Logs:**
   - Real-time logs
   - Search logs
   - Download logs

3. **Deployments:**
   - Deployment history
   - Rollback nếu cần

### **Check Health:**

1. Health endpoint: `https://yourdomain.com/health`
2. Railway healthcheck (nếu setup)
3. Monitor logs cho errors

---

## 💰 COST

### **Railway Free Tier:**

- **$5 credit/tháng**
- **Đủ cho MVP/testing**
- **Auto pause** khi không dùng (có thể bật lại)

### **Nếu hết credit:**

- Upgrade plan: $5-20/tháng
- Hoặc dùng Render free tier (có giới hạn)

---

## ✅ CHECKLIST HOÀN THÀNH

- [ ] Code đã push lên GitHub
- [ ] Railway project đã tạo
- [ ] Service đã deploy thành công
- [ ] Worker service đã tạo (nếu cần)
- [ ] Environment variables đã set
- [ ] Custom domain đã thêm trên Railway
- [ ] DNS records đã thêm trên Namecheap
- [ ] Domain đã verify trên Railway
- [ ] SSL certificate đã được issue
- [ ] Test production thành công
- [ ] Auto deploy hoạt động

---

## 🎉 DONE!

Sau khi hoàn thành tất cả bước trên:

- ✅ App chạy trên Railway
- ✅ Domain kết nối với app
- ✅ SSL tự động (HTTPS)
- ✅ Auto deploy từ GitHub
- ✅ Production ready!

---

## 📞 CẦN HỖ TRỢ?

Nếu gặp lỗi, cung cấp:
1. Error message/logs từ Railway
2. DNS records đã thêm
3. Domain status trên Railway
4. Screenshot (nếu có)

