# 🚀 Hướng Dẫn Deploy lên GitHub + Domain

## 📋 THÔNG TIN CẦN BIẾT

Trước khi deploy, bạn cần trả lời:

1. **Domain đã mua ở đâu?**
   - Namecheap, GoDaddy, Cloudflare, v.v.?

2. **Server/Hosting đã có chưa?**
   - VPS (DigitalOcean, Linode, AWS EC2, v.v.)?
   - Cloud Platform (Railway, Render, Vercel, Heroku)?
   - Chưa có → Cần mua/đăng ký

3. **Budget?**
   - Free tier (Railway, Render free tier)?
   - Paid VPS ($5-10/tháng)?

---

## 📦 BƯỚC 1: Push Code lên GitHub

### 1.1. Tạo GitHub Repository

1. Đăng nhập GitHub: https://github.com
2. Click **"New repository"**
3. Đặt tên: `aidancing` (hoặc tên khác)
4. Chọn **Public** hoặc **Private**
5. **KHÔNG** check "Initialize with README"
6. Click **"Create repository"**

### 1.2. Push Code lên GitHub

**Mở PowerShell/CMD trong thư mục project:**

```powershell
cd D:\AIdancing

# Kiểm tra git đã cài chưa
git --version

# Nếu chưa có git, cài từ: https://git-scm.com/download/win

# Khởi tạo git repo (nếu chưa có)
git init

# Thêm tất cả files
git add .

# Commit
git commit -m "Initial commit: AI Dancing MVP - Day 1, 2, 3 complete"

# Thêm remote (thay YOUR_USERNAME và YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push lên GitHub
git branch -M main
git push -u origin main
```

**Lưu ý:**
- Lần đầu push sẽ hỏi GitHub username/password
- Nên dùng **Personal Access Token** thay vì password
- Tạo token tại: https://github.com/settings/tokens

---

## 🌐 BƯỚC 2: Deploy lên Server

### **Option A: Railway (Khuyến nghị - Dễ nhất)**

**Ưu điểm:**
- Free tier: $5 credit/tháng
- Auto-deploy từ GitHub
- SSL tự động
- Dễ setup

**Cách làm:**

1. **Đăng ký Railway:**
   - Vào: https://railway.app
   - Đăng nhập bằng GitHub

2. **Tạo Project:**
   - Click **"New Project"**
   - Chọn **"Deploy from GitHub repo"**
   - Chọn repo `aidancing`

3. **Setup Environment Variables:**
   - Vào **Settings** → **Variables**
   - Thêm các biến từ `.env`:
     ```
     PORT=3001
     USE_MOCK_KLING=true
     BASE_RPC_URL=https://sepolia.base.org
     ```
   - **KHÔNG** commit `.env` lên GitHub!

4. **Deploy:**
   - Railway tự động detect Node.js
   - Chọn **"backend"** folder làm root
   - Railway sẽ tự động chạy `npm install` và `npm start`

5. **Lấy Domain:**
   - Railway cung cấp domain: `your-app.railway.app`
   - Hoặc dùng custom domain (bước 3)

---

### **Option B: Render**

**Ưu điểm:**
- Free tier (có giới hạn)
- Auto-deploy từ GitHub
- SSL tự động

**Cách làm:**

1. Đăng ký: https://render.com
2. **New** → **Web Service**
3. Connect GitHub repo
4. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add Environment Variables
6. Deploy

---

### **Option C: VPS (DigitalOcean, Linode, AWS)**

**Ưu điểm:**
- Full control
- Rẻ ($5-10/tháng)
- Tự quản lý

**Cách làm:**

1. **Mua VPS:**
   - DigitalOcean: https://www.digitalocean.com
   - Linode: https://www.linode.com
   - Chọn: Ubuntu 22.04, $5-10/tháng

2. **SSH vào VPS:**
   ```bash
   ssh root@YOUR_VPS_IP
   ```

3. **Cài đặt Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Clone code:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
   cd YOUR_REPO/backend
   npm install
   ```

5. **Setup PM2 (process manager):**
   ```bash
   npm install -g pm2
   pm2 start server.js --name aidancing
   pm2 startup
   pm2 save
   ```

6. **Setup Nginx (reverse proxy):**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/aidancing
   ```
   
   Nội dung:
   ```nginx
   server {
       listen 80;
       server_name YOUR_DOMAIN.com;
       
       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/aidancing /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

7. **Setup SSL (Let's Encrypt):**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d YOUR_DOMAIN.com
   ```

---

## 🔗 BƯỚC 3: Kết nối Domain

### **3.1. Lấy IP/Domain từ Server**

**Railway:**
- Domain: `your-app.railway.app`
- Hoặc custom domain trong Settings

**Render:**
- Domain: `your-app.onrender.com`

**VPS:**
- IP: `YOUR_VPS_IP`

### **3.2. Cấu hình DNS**

**Nếu domain ở Namecheap/GoDaddy:**

1. Vào DNS settings của domain
2. Thêm **A Record** (cho VPS):
   ```
   Type: A
   Host: @ (hoặc www)
   Value: YOUR_VPS_IP
   TTL: Automatic
   ```

3. Hoặc thêm **CNAME** (cho Railway/Render):
   ```
   Type: CNAME
   Host: @ (hoặc www)
   Value: your-app.railway.app
   TTL: Automatic
   ```

**Nếu domain ở Cloudflare:**

1. Vào **DNS** → **Records**
2. Thêm **A Record** hoặc **CNAME** tương tự
3. **Proxy status:** DNS only (orange cloud OFF) hoặc Proxied (orange cloud ON)

### **3.3. Custom Domain trên Railway/Render**

**Railway:**
1. Vào **Settings** → **Domains**
2. Click **"Custom Domain"**
3. Nhập domain: `yourdomain.com`
4. Railway sẽ hiển thị DNS records cần thêm
5. Thêm vào DNS provider
6. Đợi 5-10 phút để DNS propagate

**Render:**
1. Vào **Settings** → **Custom Domain**
2. Thêm domain
3. Thêm DNS records theo hướng dẫn

---

## ✅ CHECKLIST DEPLOY

- [ ] Code đã push lên GitHub
- [ ] Đã chọn hosting platform (Railway/Render/VPS)
- [ ] Đã setup environment variables
- [ ] Server đã deploy thành công
- [ ] Đã test domain/server hoạt động
- [ ] Đã cấu hình DNS
- [ ] SSL đã setup (HTTPS)
- [ ] Đã test full flow trên production

---

## 🔧 ENVIRONMENT VARIABLES CẦN SET

**Trên Server (Railway/Render/VPS):**

```env
# Server
PORT=3001

# Kling API (hoặc mock)
USE_MOCK_KLING=true
MOCK_KLING_URL=http://localhost:3002
# Hoặc dùng API thật:
# KLING_API_KEY=your_key_here
# KLING_BASE_URL=https://api.kie.ai

# Payment
BASE_RPC_URL=https://sepolia.base.org  # hoặc mainnet
PAYMENT_RECIPIENT=0xYOUR_WALLET_ADDRESS

# Node Environment
NODE_ENV=production
```

**Lưu ý:**
- **KHÔNG** commit `.env` lên GitHub
- Set environment variables trên hosting platform
- Worker cần chạy riêng (Railway có thể dùng separate service)

---

## 🐛 TROUBLESHOOTING

### **Lỗi: Cannot find module**
→ Chạy `npm install` trên server

### **Lỗi: Port already in use**
→ Check process đang chạy: `pm2 list` hoặc `ps aux | grep node`

### **Lỗi: Domain không resolve**
→ Đợi DNS propagate (5-30 phút), check DNS records

### **Lỗi: SSL certificate failed**
→ Check DNS đã point đúng, đợi DNS propagate

### **Lỗi: Worker không chạy**
→ Cần chạy worker riêng (PM2 hoặc separate service trên Railway)

---

## 📝 NEXT STEPS

Sau khi deploy:

1. **Test production:**
   - Upload image/video
   - Connect wallet
   - Generate video
   - Check logs

2. **Monitor:**
   - Check server logs
   - Monitor errors
   - Check performance

3. **Optimize:**
   - Add rate limiting (đã có)
   - Add caching
   - Optimize images

---

## 💡 KHUYẾN NGHỊ

**Cho MVP/Testing:**
→ **Railway** (dễ nhất, free tier)

**Cho Production:**
→ **VPS** (full control, rẻ)

**Cho Scale:**
→ **AWS/GCP** (auto-scaling, nhưng phức tạp hơn)

---

## ❓ CẦN HỖ TRỢ?

Nếu gặp lỗi, cung cấp:
1. Hosting platform đang dùng
2. Error message/logs
3. Domain đã setup chưa
4. DNS records đã thêm chưa

