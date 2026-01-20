# 🆓 Free Hosting Options - So Sánh

## 🎯 Tổng Quan

App của bạn cần:
- ✅ Node.js backend (Express)
- ✅ Worker process
- ✅ File uploads
- ✅ Long-running processes

**Cloudflare free tier KHÔNG chạy được Node.js backend!**

---

## 📊 SO SÁNH CÁC OPTIONS FREE

| Platform | Free Tier | Node.js | Auto Deploy | Dễ Setup | Giới Hạn |
|----------|-----------|---------|-------------|----------|----------|
| **Railway** | ✅ $5 credit/tháng | ✅ | ✅ | ⭐⭐⭐⭐⭐ | Auto pause khi không dùng |
| **Render** | ✅ Free tier | ✅ | ✅ | ⭐⭐⭐⭐ | Sleep sau 15 phút không dùng |
| **Fly.io** | ✅ Free tier | ✅ | ✅ | ⭐⭐⭐ | 3 VMs free |
| **Vercel** | ✅ Free tier | ⚠️ Serverless | ✅ | ⭐⭐⭐⭐ | Chỉ serverless functions |
| **Cloudflare Pages** | ✅ Free | ❌ | ✅ | ⭐⭐⭐⭐⭐ | Chỉ static files |
| **Oracle Cloud** | ✅ Always free | ✅ | ❌ | ⭐⭐ | VPS free (phức tạp) |

---

## 🏆 KHUYẾN NGHỊ: Render (Free Tier)

### ✅ Ưu Điểm:
- **Free tier thật sự** (không cần credit card)
- Chạy được Node.js backend
- Auto deploy từ GitHub
- SSL tự động
- Custom domain
- Dễ setup

### ⚠️ Nhược Điểm:
- **Sleep sau 15 phút** không có traffic
- Lần đầu wake up mất 30-60 giây
- Giới hạn: 750 giờ/tháng (đủ cho MVP)

### 💡 Giải Pháp Sleep:
- Dùng uptime monitor (UptimeRobot - free) để ping mỗi 5 phút
- Hoặc chấp nhận wake up time

---

## 🚀 HƯỚNG DẪN DEPLOY LÊN RENDER (FREE)

### **Bước 1: Đăng Ký Render**

1. Vào: https://render.com
2. Click **"Get Started for Free"**
3. Chọn **"Sign up with GitHub"**
4. Authorize Render

### **Bước 2: Tạo Web Service**

1. Trong Dashboard, click **"New +"** → **"Web Service"**
2. **Connect repository:** Chọn `MetFounder/aidancing`
3. **Settings:**
   - **Name:** `aidancing` (hoặc tên khác)
   - **Region:** Singapore (gần VN nhất)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** **Free** (chọn Free!)

4. **Environment Variables:**
   - Click **"Add Environment Variable"**
   - Thêm:
     ```
     PORT=3001
     USE_MOCK_KLING=true
     BASE_RPC_URL=https://sepolia.base.org
     NODE_ENV=production
     ```

5. **Advanced:**
   - **Auto-Deploy:** Yes (tự động deploy khi push code)

6. Click **"Create Web Service"**

### **Bước 3: Setup Worker Process**

Render không tự động chạy worker. Có 2 cách:

#### **Option A: Tạo Background Worker (Khuyến nghị)**

1. **New +** → **"Background Worker"**
2. **Settings:**
   - **Name:** `aidancing-worker`
   - **Root Directory:** `backend`
   - **Start Command:** `node worker.js`
   - **Plan:** **Free**
3. **Environment Variables:** Copy từ Web Service
4. **Create Background Worker**

#### **Option B: Dùng PM2 (Không khuyến nghị)**

Sửa `package.json`:
```json
{
  "scripts": {
    "start": "pm2 start ecosystem.config.js --no-daemon"
  }
}
```

### **Bước 4: Kết Nối Domain**

1. Vào Web Service → **Settings** → **Custom Domain**
2. Nhập domain: `yourdomain.com`
3. Render hiển thị DNS records cần thêm

4. **Trên Namecheap:**
   - Advanced DNS → Add CNAME:
     ```
     Type: CNAME
     Host: @
     Value: your-app.onrender.com
     TTL: Automatic
     ```

5. **Đợi 5-10 phút:**
   - DNS propagate
   - Render tự động setup SSL

---

## 🔄 AUTO DEPLOY TRÊN RENDER

Render tự động setup khi connect GitHub:
- Push code → Render tự động deploy
- Không cần làm gì thêm

---

## ⚠️ LƯU Ý VỀ RENDER FREE TIER

### **Sleep Mode:**
- Service sleep sau 15 phút không có traffic
- Lần đầu wake up: 30-60 giây
- Sau đó hoạt động bình thường

### **Giải Pháp:**
1. **Dùng UptimeRobot (Free):**
   - Đăng ký: https://uptimerobot.com
   - Tạo monitor: Ping `https://your-app.onrender.com` mỗi 5 phút
   - Service không bao giờ sleep

2. **Hoặc chấp nhận:**
   - User đầu tiên đợi 30-60 giây
   - Sau đó nhanh bình thường

---

## 🆚 SO SÁNH: Railway vs Render

| Tiêu Chí | Railway | Render |
|----------|---------|--------|
| **Free Tier** | $5 credit/tháng | Free thật sự |
| **Sleep Mode** | Auto pause | Sleep sau 15 phút |
| **Wake Up Time** | Nhanh | 30-60 giây |
| **Setup** | Dễ nhất | Dễ |
| **Giới Hạn** | Hết credit = stop | 750 giờ/tháng |

**Kết luận:**
- **Railway:** Tốt hơn nhưng cần credit card ($5 credit)
- **Render:** Free thật sự nhưng có sleep mode

---

## 🎯 KHUYẾN NGHỊ

### **Nếu không muốn trả phí:**
→ **Dùng Render Free Tier**
- Free thật sự
- Đủ cho MVP
- Dùng UptimeRobot để tránh sleep

### **Nếu chấp nhận $5/tháng:**
→ **Dùng Railway**
- Tốt hơn
- Không sleep
- Dễ setup hơn

---

## 📝 HƯỚNG DẪN CHI TIẾT RENDER

Xem file: `RENDER_DEPLOY.md` (sẽ tạo nếu cần)

---

## ✅ CHECKLIST

- [ ] Đăng ký Render (free)
- [ ] Tạo Web Service
- [ ] Setup Environment Variables
- [ ] Tạo Background Worker
- [ ] Kết nối Domain
- [ ] Setup UptimeRobot (tránh sleep)
- [ ] Test production

---

## 🎉 DONE!

Sau khi deploy lên Render:
- ✅ App chạy free
- ✅ Auto deploy từ GitHub
- ✅ Custom domain
- ✅ SSL tự động

