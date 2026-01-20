# 🎨 Hướng Dẫn Deploy lên Render (Free Tier)

## 🎯 Tổng Quan

Deploy app lên Render với:
- ✅ Free tier (không cần credit card)
- ✅ Auto deploy từ GitHub
- ✅ SSL tự động
- ✅ Custom domain
- ⚠️ Sleep sau 15 phút không dùng (có thể fix bằng UptimeRobot)

---

## 📋 CHECKLIST TRƯỚC KHI BẮT ĐẦU

- [x] Code đã push lên GitHub
- [ ] Có tài khoản Render (đăng ký free)
- [ ] Domain đã mua ở Namecheap

---

## 🚀 BƯỚC 1: Đăng Ký Render

1. Vào: https://render.com
2. Click **"Get Started for Free"**
3. Chọn **"Sign up with GitHub"**
4. Authorize Render access GitHub
5. Đăng nhập thành công

---

## 🌐 BƯỚC 2: Tạo Web Service

### 2.1. Tạo Service

1. Trong Render Dashboard, click **"New +"** (góc phải trên)
2. Chọn **"Web Service"**

### 2.2. Connect Repository

1. **Connect account:** Chọn GitHub account
2. **Repository:** Chọn `MetFounder/aidancing`
3. Click **"Connect"**

### 2.3. Configure Service

**Basic Settings:**
- **Name:** `aidancing` (hoặc tên khác)
- **Region:** `Singapore` (gần VN nhất, hoặc chọn khác)
- **Branch:** `main`
- **Root Directory:** `backend` ⚠️ **QUAN TRỌNG!**
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `node server.js`
- **Plan:** **Free** ⚠️ **CHỌN FREE!**

**Advanced Settings:**
- **Auto-Deploy:** `Yes` (tự động deploy khi push code)
- **Health Check Path:** `/health` (optional)

### 2.4. Environment Variables

Click **"Add Environment Variable"** và thêm:

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
- Set tất cả trên Render
- Nếu dùng Kling API thật, thêm:
  ```
  KLING_API_KEY=your_key_here
  KLING_BASE_URL=https://api.kie.ai
  USE_MOCK_KLING=false
  ```

### 2.5. Create Service

Click **"Create Web Service"**

Render sẽ:
1. Clone code từ GitHub
2. Run `npm install`
3. Run `node server.js`
4. Deploy → Live!

**Lấy domain:** `your-app.onrender.com`

---

## ⚙️ BƯỚC 3: Setup Worker Process

Render không tự động chạy worker. Cần tạo Background Worker:

### 3.1. Tạo Background Worker

1. **New +** → **"Background Worker"**
2. **Connect repository:** Chọn `MetFounder/aidancing`
3. **Settings:**
   - **Name:** `aidancing-worker`
   - **Region:** `Singapore` (giống Web Service)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Start Command:** `node worker.js`
   - **Plan:** **Free**

4. **Environment Variables:**
   - Copy tất cả từ Web Service
   - Click **"Add Environment Variable"** và paste

5. **Advanced:**
   - **Auto-Deploy:** `Yes`

6. Click **"Create Background Worker"**

### 3.2. Verify Worker

1. Vào Worker Dashboard
2. Check **"Logs"** tab
3. Phải thấy: `Starting worker...`

---

## 🔗 BƯỚC 4: Kết Nối Domain

### 4.1. Setup Custom Domain trên Render

1. Vào Web Service → **Settings** → **Custom Domains**
2. Click **"Add Custom Domain"**
3. Nhập domain: `yourdomain.com` (hoặc `www.yourdomain.com`)
4. Render hiển thị DNS records cần thêm

**Render sẽ hiển thị:**
```
Type: CNAME
Name: @
Value: your-app.onrender.com
```

### 4.2. Cấu Hình DNS trên Namecheap

1. Đăng nhập Namecheap: https://www.namecheap.com
2. **Domain List** → Click **"Manage"** bên cạnh domain
3. Vào tab **"Advanced DNS"**
4. Xóa các records cũ (nếu có)
5. Thêm **CNAME Record**:

   ```
   Type: CNAME Record
   Host: @
   Value: your-app.onrender.com
   TTL: Automatic (hoặc 300)
   ```

6. (Optional) Thêm **CNAME cho www**:

   ```
   Type: CNAME Record
   Host: www
   Value: your-app.onrender.com
   TTL: Automatic
   ```

7. Click **"Save All Changes"**

### 4.3. Đợi DNS Propagate

- Thời gian: 5-30 phút
- Render tự động detect và setup SSL
- Check status trên Render Dashboard

### 4.4. Verify Domain

1. Vào Render → Web Service → Settings → Custom Domains
2. Check domain status: **"Valid"** = OK
3. SSL certificate tự động được issue
4. Test: Mở `https://yourdomain.com`

---

## 🔄 AUTO DEPLOY

Render tự động setup khi connect GitHub:
- Push code → Render tự động deploy
- Không cần làm gì thêm

**Check:**
- Render Dashboard → Web Service → **"Events"** tab
- Xem deployment history

---

## ⚠️ LƯU Ý: SLEEP MODE

### **Vấn Đề:**
- Render free tier **sleep sau 15 phút** không có traffic
- Lần đầu wake up: **30-60 giây**
- Sau đó hoạt động bình thường

### **Giải Pháp: Dùng UptimeRobot (Free)**

1. **Đăng ký:** https://uptimerobot.com
2. **Add New Monitor:**
   - **Monitor Type:** HTTP(s)
   - **Friendly Name:** `AIdancing`
   - **URL:** `https://yourdomain.com/health`
   - **Monitoring Interval:** 5 minutes
3. **Save Monitor**

**Kết quả:**
- UptimeRobot ping mỗi 5 phút
- Service không bao giờ sleep
- **Free forever!**

---

## ✅ TEST PRODUCTION

### 1. Test Basic

1. Mở `https://yourdomain.com`
2. Phải load được giao diện
3. Check Console (F12) → Không có lỗi

### 2. Test API

```
https://yourdomain.com/health
```

Phải trả về: `{"status":"ok",...}`

### 3. Test Full Flow

- Upload image/video
- Connect wallet
- Generate video
- Check logs

---

## 🐛 TROUBLESHOOTING

### **Lỗi: Build failed**

**Fix:**
- Check logs trên Render
- Check `package.json` có đúng không
- Check `Root Directory` = `backend`

### **Lỗi: Service sleep**

**Fix:**
- Setup UptimeRobot (xem trên)
- Hoặc chấp nhận wake up time

### **Lỗi: Domain không resolve**

**Fix:**
- Check DNS records trên Namecheap
- Verify trên Render
- Đợi 5-30 phút

### **Lỗi: Worker không chạy**

**Fix:**
- Check Background Worker đã tạo chưa
- Check logs
- Check environment variables

---

## 💰 COST

### **Render Free Tier:**

- **Free forever** (không cần credit card)
- **750 giờ/tháng** (đủ cho MVP)
- **Sleep mode** sau 15 phút (có thể fix)

### **Nếu cần upgrade:**

- **Starter:** $7/tháng (không sleep)
- **Standard:** $25/tháng (production)

---

## ✅ CHECKLIST HOÀN THÀNH

- [ ] Đăng ký Render (free)
- [ ] Tạo Web Service
- [ ] Setup Environment Variables
- [ ] Tạo Background Worker
- [ ] Custom domain đã thêm
- [ ] DNS records đã thêm trên Namecheap
- [ ] Domain đã verify
- [ ] SSL certificate đã được issue
- [ ] Setup UptimeRobot (tránh sleep)
- [ ] Test production thành công
- [ ] Auto deploy hoạt động

---

## 🎉 DONE!

Sau khi hoàn thành:
- ✅ App chạy free trên Render
- ✅ Domain kết nối
- ✅ SSL tự động
- ✅ Auto deploy từ GitHub
- ✅ Không sleep (nếu dùng UptimeRobot)

---

## 📞 CẦN HỖ TRỢ?

Nếu gặp lỗi, cung cấp:
1. Error message/logs từ Render
2. DNS records đã thêm
3. Domain status trên Render

