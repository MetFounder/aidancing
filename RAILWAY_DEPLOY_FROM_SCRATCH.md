# 🚂 Railway Deploy - Hướng Dẫn Từ Đầu (Sau Khi Xóa Hết)

## ✅ ĐÃ CÓ SẴN

- [x] Code đã push lên GitHub: https://github.com/MetFounder/aidancing
- [x] Dockerfile đã có ở root
- [x] package.json có trong `backend/`

---

## 🚀 BƯỚC 1: Tạo Project Mới (2 phút)

### 1.1. Vào Railway Dashboard

1. Mở: https://railway.app
2. Đăng nhập (nếu chưa)
3. Bạn sẽ thấy Dashboard trống (vì đã xóa hết)

### 1.2. Tạo Project

1. Click **"New Project"** (góc phải trên, nút lớn)
2. Chọn **"Deploy from GitHub repo"**
3. Railway hiển thị danh sách GitHub repos
4. Tìm và chọn: **`MetFounder/aidancing`**
5. Click **"Deploy Now"**

**Lưu ý:** Railway sẽ tự động tạo service đầu tiên

---

## 📦 BƯỚC 2: Railway Tự Động Deploy (Đợi 2-3 phút)

### 2.1. Railway Sẽ:

1. Clone code từ GitHub
2. **Detect Dockerfile** (tự động)
3. Build Docker image
4. Deploy service

### 2.2. Check Deployment

1. Click vào service vừa tạo (tên: `aidancing`)
2. Tab **"Deployments"**
3. Xem deployment status:
   - ⏳ **"Building"** = Đang build, đợi thêm
   - ✅ **"Active"** = OK, service đang chạy
   - ❌ **"Failed"** = Có lỗi, xem logs

### 2.3. Nếu Thành Công

- Service status: **"Active"**
- Logs hiển thị: `Backend running on http://localhost:3001`
- Lấy domain: Settings → Networking → `your-app.railway.app`

---

## ⚙️ BƯỚC 3: Setup Environment Variables (3 phút)

### 3.1. Vào Variables

1. Click vào service `aidancing`
2. Tab **"Variables"**
3. Click **"New Variable"**

### 3.2. Thêm Variables

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

### 3.3. Verify

- Tất cả 6 variables đã được thêm
- Service sẽ tự động redeploy với variables mới

---

## 🔄 BƯỚC 4: Tạo Worker Service (3 phút)

### 4.1. Tạo Service Mới

1. Trong Railway Project, click **"New"** (góc phải trên)
2. Chọn **"Empty Service"**

### 4.2. Setup Worker

1. **Name:** `aidancing-worker` (hoặc tên khác)
2. Click vào service vừa tạo
3. Tab **"Settings"**

### 4.3. Connect GitHub Repo

1. **Source:**
   - Click **"Connect GitHub repo"**
   - Chọn: `MetFounder/aidancing`
   - Railway sẽ tự động detect Dockerfile

2. **Deploy:**
   - Railway tự động dùng Dockerfile
   - Nhưng cần sửa CMD để chạy worker

### 4.4. Sửa Start Command

**Option A: Tạo Dockerfile riêng cho Worker (Khuyến nghị)**

Tạo `Dockerfile.worker` trong repo:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
CMD ["node", "worker.js"]
```

**Option B: Dùng Environment Variable**

1. Settings → Variables
2. Thêm: `START_COMMAND=node worker.js`
3. Railway sẽ dùng variable này

**Option C: Sửa Dockerfile để chạy cả 2 (Không khuyến nghị)**

Phức tạp, không nên dùng.

### 4.5. Environment Variables cho Worker

1. Tab **"Variables"**
2. **Copy từ Service chính:**
   - Click **"New Variable"**
   - Thêm tất cả variables giống service chính:
     - `PORT=3001`
     - `NODE_ENV=production`
     - `USE_MOCK_KLING=true`
     - `MOCK_KLING_URL=http://localhost:3002`
     - `BASE_RPC_URL=https://sepolia.base.org`
     - `PAYMENT_RECIPIENT=0xYOUR_WALLET_ADDRESS`

### 4.6. Verify Worker

1. Tab **"Deployments"**
2. Check logs → Phải thấy: `Starting worker...`

---

## 🌐 BƯỚC 5: Lấy Domain (1 phút)

### 5.1. Lấy Railway Domain

1. Vào **Web Service** (không phải worker)
2. Tab **"Settings"** → **"Networking"**
3. Railway cung cấp domain: `your-app.railway.app`
4. **Copy domain này!**

### 5.2. Test Domain

1. Mở browser: `https://your-app.railway.app`
2. Phải load được giao diện!
3. Test API: `https://your-app.railway.app/health`
   - Phải trả về: `{"status":"ok",...}`

---

## 🔗 BƯỚC 6: Kết Nối Domain Namecheap (5 phút)

### 6.1. Setup Custom Domain trên Railway

1. Vào **Web Service** → **Settings** → **Networking**
2. Scroll xuống **"Custom Domain"**
3. Click **"Add Custom Domain"**
4. Nhập domain: `yourdomain.com` (domain bạn đã mua)
5. Click **"Add"**

### 6.2. Railway Hiển Thị DNS Records

Railway sẽ hiển thị:
```
Type: CNAME
Name: @
Value: your-app.railway.app
```

**Copy thông tin này!**

### 6.3. Cấu Hình DNS trên Namecheap

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

### 6.4. Đợi DNS Propagate

- Thời gian: 5-30 phút
- Railway tự động detect domain
- Railway tự động setup SSL certificate

### 6.5. Verify Domain

1. Vào Railway → Service → Settings → Networking
2. Check domain status: **"Valid"** = OK
3. SSL certificate: **"Active"** = OK
4. Test: Mở `https://yourdomain.com`
   - Phải hoạt động!
   - Phải có HTTPS (SSL)

---

## ✅ BƯỚC 7: Test Production (5 phút)

### 7.1. Test Basic

1. Mở `https://yourdomain.com`
2. Phải load được giao diện
3. Check Console (F12) → Không có lỗi

### 7.2. Test API

```
https://yourdomain.com/health
```

Phải trả về: `{"status":"ok",...}`

### 7.3. Test Upload

1. Upload image → Phải thành công
2. Upload video → Phải thành công

### 7.4. Test Wallet

1. Connect wallet → Phải kết nối được
2. Check network: Base Sepolia

### 7.5. Test Generate

1. Upload image + video
2. Connect wallet
3. Pay → Generate
4. Check job status

### 7.6. Check Logs

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

## 🐛 TROUBLESHOOTING

### **Lỗi: Build failed**

**Check:**
- Dockerfile có ở root không?
- Logs hiển thị lỗi gì?

**Fix:**
- Check Dockerfile syntax
- Check logs để xem lỗi cụ thể

### **Lỗi: Service không start**

**Check:**
- Environment variables đã set chưa?
- Logs hiển thị gì?

**Fix:**
- Set đầy đủ environment variables
- Check logs để xem lỗi cụ thể

### **Lỗi: Worker không chạy**

**Check:**
- Worker service đã tạo chưa?
- Start command đúng chưa?

**Fix:**
- Tạo Dockerfile.worker (xem Bước 4)
- Hoặc dùng environment variable `START_COMMAND`

---

## ✅ CHECKLIST HOÀN THÀNH

- [ ] Tạo project mới từ GitHub
- [ ] Service deploy thành công (Active)
- [ ] Environment variables đã set (6 variables)
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
2. Screenshot deployment status
3. Bước nào đang bị lỗi

