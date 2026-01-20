# 🚂 Railway Deploy - Step by Step

## ✅ ĐÃ HOÀN THÀNH

- [x] Code đã push lên GitHub: https://github.com/MetFounder/aidancing

---

## 🚀 BƯỚC 1: Đăng Ký Railway (2 phút)

### 1.1. Truy cập Railway

1. Mở browser: https://railway.app
2. Click **"Start a New Project"** (hoặc "Login")

### 1.2. Đăng nhập với GitHub

1. Chọn **"Login with GitHub"**
2. Authorize Railway access GitHub
3. Đăng nhập thành công → Vào Railway Dashboard

---

## 📦 BƯỚC 2: Tạo Project từ GitHub (3 phút)

### 2.1. Tạo Project Mới

1. Trong Railway Dashboard, click **"New Project"** (góc phải trên)
2. Chọn **"Deploy from GitHub repo"**

### 2.2. Chọn Repository

1. Railway hiển thị danh sách GitHub repos
2. Tìm và chọn: **`MetFounder/aidancing`**
3. Click **"Deploy Now"**

### 2.3. Railway Tự Động Deploy

Railway sẽ:
- Clone code từ GitHub
- Detect Node.js
- Run `npm install`
- Deploy service

**Đợi 2-3 phút** → Service sẽ deploy xong!

---

## ⚙️ BƯỚC 3: Setup Service Settings (2 phút)

### 3.1. Vào Service Settings

1. Click vào service vừa tạo (tên: `aidancing` hoặc tên repo)
2. Click tab **"Settings"**

### 3.2. Cấu Hình Service

1. **Root Directory:** `backend` ⚠️ **QUAN TRỌNG!**
   - Scroll xuống phần **"Source"**
   - **Root Directory:** Nhập `backend`
   - Click **"Save"**

2. **Start Command:** `node server.js`
   - Scroll xuống phần **"Deploy"**
   - **Start Command:** Đã tự động là `npm start` (OK)
   - Hoặc đổi thành: `node server.js`

3. **Healthcheck (Optional):**
   - **Healthcheck Path:** `/health`

### 3.3. Verify

- Railway sẽ tự động redeploy với settings mới
- Đợi 1-2 phút → Service running

---

## 🔐 BƯỚC 4: Setup Environment Variables (3 phút)

### 4.1. Vào Variables

1. Trong Service, click tab **"Variables"**
2. Click **"New Variable"**

### 4.2. Thêm Variables

Thêm từng variable một:

**Variable 1:**
- **Key:** `PORT`
- **Value:** `3001`
- Click **"Add"**

**Variable 2:**
- **Key:** `NODE_ENV`
- **Value:** `production`
- Click **"Add"**

**Variable 3:**
- **Key:** `USE_MOCK_KLING`
- **Value:** `true`
- Click **"Add"**

**Variable 4:**
- **Key:** `MOCK_KLING_URL`
- **Value:** `http://localhost:3002`
- Click **"Add"`

**Variable 5:**
- **Key:** `BASE_RPC_URL`
- **Value:** `https://sepolia.base.org`
- Click **"Add"`

**Variable 6:**
- **Key:** `PAYMENT_RECIPIENT`
- **Value:** `0xYOUR_WALLET_ADDRESS` (thay bằng địa chỉ ví của bạn)
- Click **"Add"**

### 4.3. Verify

- Tất cả variables đã được thêm
- Service sẽ tự động redeploy

---

## 🔄 BƯỚC 5: Tạo Worker Service (3 phút)

### 5.1. Tạo Service Mới

1. Trong Railway Project, click **"New"** (góc phải trên)
2. Chọn **"Empty Service"**

### 5.2. Setup Worker

1. **Name:** `aidancing-worker` (hoặc tên khác)
2. Click vào service vừa tạo
3. Vào tab **"Settings"**

### 5.3. Cấu Hình Worker

1. **Source:**
   - **Connect GitHub repo:** Chọn `MetFounder/aidancing`
   - **Root Directory:** `backend`

2. **Deploy:**
   - **Start Command:** `node worker.js`

3. Click **"Save"**

### 5.4. Environment Variables cho Worker

1. Vào tab **"Variables"**
2. **Copy từ Service chính:**
   - Click **"Add Variable"**
   - Thêm tất cả variables giống service chính:
     - `PORT=3001`
     - `NODE_ENV=production`
     - `USE_MOCK_KLING=true`
     - `MOCK_KLING_URL=http://localhost:3002`
     - `BASE_RPC_URL=https://sepolia.base.org`
     - `PAYMENT_RECIPIENT=0xYOUR_WALLET_ADDRESS`

### 5.5. Verify Worker

1. Vào tab **"Deployments"**
2. Check logs → Phải thấy: `Starting worker...`

---

## 🌐 BƯỚC 6: Lấy Domain (1 phút)

### 6.1. Lấy Railway Domain

1. Vào **Web Service** (không phải worker)
2. Click tab **"Settings"** → **"Networking"**
3. Railway cung cấp domain: `your-app.railway.app`
4. **Copy domain này!**

### 6.2. Test Domain

1. Mở browser: `https://your-app.railway.app`
2. Phải load được giao diện!
3. Test: `https://your-app.railway.app/health`
   - Phải trả về: `{"status":"ok",...}`

---

## 🔗 BƯỚC 7: Kết Nối Domain Namecheap (5 phút)

### 7.1. Setup Custom Domain trên Railway

1. Vào **Web Service** → **Settings** → **Networking**
2. Scroll xuống **"Custom Domain"**
3. Click **"Add Custom Domain"**
4. Nhập domain: `yourdomain.com` (domain bạn đã mua)
5. Click **"Add"**

### 7.2. Railway Hiển Thị DNS Records

Railway sẽ hiển thị:
```
Type: CNAME
Name: @
Value: your-app.railway.app
```

**Copy thông tin này!**

### 7.3. Cấu Hình DNS trên Namecheap

1. Đăng nhập Namecheap: https://www.namecheap.com
2. **Domain List** → Click **"Manage"** bên cạnh domain
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

### 7.4. Đợi DNS Propagate

- Thời gian: 5-30 phút
- Railway tự động detect domain
- Railway tự động setup SSL certificate

### 7.5. Verify Domain

1. Vào Railway → Service → Settings → Networking
2. Check domain status: **"Valid"** = OK
3. SSL certificate: **"Active"** = OK
4. Test: Mở `https://yourdomain.com`
   - Phải hoạt động!
   - Phải có HTTPS (SSL)

---

## ✅ BƯỚC 8: Test Production (5 phút)

### 8.1. Test Basic

1. Mở `https://yourdomain.com`
2. Phải load được giao diện
3. Check Console (F12) → Không có lỗi

### 8.2. Test API

```
https://yourdomain.com/health
```

Phải trả về: `{"status":"ok",...}`

### 8.3. Test Upload

1. Upload image → Phải thành công
2. Upload video → Phải thành công
3. Check files được lưu trên Railway

### 8.4. Test Wallet

1. Connect wallet → Phải kết nối được
2. Check network: Base Sepolia

### 8.5. Test Generate

1. Upload image + video
2. Connect wallet
3. Pay → Generate
4. Check job status

### 8.6. Check Logs

1. Railway Dashboard → Service → **"Deployments"**
2. Click deployment mới nhất
3. Click **"View Logs"**
4. Check:
   - Server started: `Backend running on http://localhost:3001`
   - Worker started: `Starting worker...`
   - Không có errors

---

## 🔄 AUTO DEPLOY

Railway tự động setup auto deploy:
- Push code lên GitHub → Railway tự động deploy
- Không cần làm gì thêm!

**Test:**
1. Sửa code local
2. Push lên GitHub: `git push`
3. Railway tự động deploy
4. Check Railway Dashboard → Deployments → Xem deployment mới

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

### **Check Usage:**

1. Railway Dashboard → **"Usage"**
2. Xem credit đã dùng: `$X / $5`
3. Monitor để không vượt $5

---

## 🐛 TROUBLESHOOTING

### **Lỗi: Build failed**

**Fix:**
- Check logs trên Railway
- Check `Root Directory` = `backend`
- Check `package.json` có đúng không

### **Lỗi: Service không start**

**Fix:**
- Check logs
- Check environment variables đã set chưa
- Check `Start Command` = `node server.js`

### **Lỗi: Domain không resolve**

**Fix:**
- Check DNS records trên Namecheap
- Verify trên Railway
- Đợi 5-30 phút (DNS propagate)

### **Lỗi: Worker không chạy**

**Fix:**
- Check Background Worker đã tạo chưa
- Check logs
- Check environment variables

---

## ✅ CHECKLIST HOÀN THÀNH

- [ ] Đăng ký Railway
- [ ] Tạo project từ GitHub
- [ ] Setup Root Directory = `backend`
- [ ] Environment variables đã set
- [ ] Worker service đã tạo
- [ ] Worker environment variables đã set
- [ ] Railway domain đã lấy
- [ ] Custom domain đã thêm trên Railway
- [ ] DNS records đã thêm trên Namecheap
- [ ] Domain đã verify
- [ ] SSL certificate đã được issue
- [ ] Test production thành công
- [ ] Auto deploy hoạt động

---

## 🎉 DONE!

Sau khi hoàn thành:
- ✅ App chạy trên Railway
- ✅ Domain kết nối
- ✅ SSL tự động
- ✅ Auto deploy từ GitHub
- ✅ Production ready!

---

## 📞 CẦN HỖ TRỢ?

Nếu gặp lỗi, cung cấp:
1. Error message/logs từ Railway
2. DNS records đã thêm
3. Domain status trên Railway

