# 💰 Railway Pricing - Giải Thích Chi Tiết

## 🎯 Railway $5 Credit

### **Mỗi Tháng hay Một Lần?**

**Trả lời: MỖI THÁNG!**

- Railway cung cấp **$5 credit mỗi tháng** cho Trial Plan
- Reset vào đầu mỗi tháng
- Không tích lũy (hết tháng = reset về $5)

---

## 💵 $5 Credit Dùng Được Gì?

### **Railway Pricing:**

| Resource | Cost |
|----------|------|
| **CPU** | $0.000463/hour per vCPU |
| **RAM** | $0.000231/hour per GB |
| **Network** | $0.01/GB (outbound) |
| **Storage** | $0.25/GB/month |

### **Tính Toán với $5 Credit:**

**Ví dụ: 1 Service với:**
- 1 vCPU
- 512 MB RAM (0.5 GB)
- 24/7 running

**Chi phí/tháng:**
- CPU: $0.000463 × 24 × 30 = **$0.33/tháng**
- RAM: $0.000231 × 0.5 × 24 × 30 = **$0.08/tháng**
- **Tổng: ~$0.41/tháng**

**→ $5 credit đủ cho ~12 services như vậy!**

---

## 📊 Với App Của Bạn (Upload Ảnh/Video)

### **Resources Cần:**

1. **Web Service (server.js):**
   - 1 vCPU
   - 512 MB RAM
   - ~$0.41/tháng

2. **Worker Service (worker.js):**
   - 1 vCPU
   - 256 MB RAM
   - ~$0.25/tháng

3. **Storage (uploads/):**
   - Giả sử 10 GB storage
   - $0.25 × 10 = **$2.50/tháng**

4. **Network (upload/download):**
   - Giả sử 50 GB traffic/tháng
   - $0.01 × 50 = **$0.50/tháng**

### **Tổng Chi Phí:**

```
Web Service:    $0.41
Worker:         $0.25
Storage (10GB): $2.50
Network (50GB): $0.50
─────────────────────
TỔNG:           $3.66/tháng
```

**→ $5 credit ĐỦ DÙNG! Còn dư ~$1.34**

---

## ⚠️ LƯU Ý QUAN TRỌNG

### **Storage là Chi Phí Lớn Nhất:**

- **Uploads folder** tăng dần theo thời gian
- Nếu không xóa files cũ → tốn tiền nhiều
- **Giải pháp:**
  - Xóa files sau 7-30 ngày
  - Hoặc dùng external storage (S3, Cloudflare R2 - rẻ hơn)

### **Network Traffic:**

- **Upload:** Không tính phí (inbound free)
- **Download:** $0.01/GB (outbound)
- User download video → tốn tiền
- **Giải pháp:**
  - Dùng CDN (Cloudflare - free)
  - Hoặc limit download size

---

## 📈 TÍNH TOÁN THỰC TẾ

### **Scenario 1: MVP/Testing (Ít User)**

- 100 uploads/tháng
- 10 GB storage
- 20 GB download
- **Chi phí: ~$3-4/tháng** ✅ Đủ với $5

### **Scenario 2: Production (Nhiều User)**

- 1000 uploads/tháng
- 100 GB storage
- 200 GB download
- **Chi phí: ~$25-30/tháng** ❌ Vượt $5

**→ Cần upgrade plan hoặc optimize**

---

## 🆚 SO SÁNH: Railway vs Render vs Cloudflare

### **Railway ($5 credit/tháng):**

| Ưu điểm | Nhược điểm |
|---------|-----------|
| ✅ Không sleep | ❌ Hết credit = stop |
| ✅ Nhanh | ❌ Storage đắt ($0.25/GB) |
| ✅ Dễ setup | ❌ Network đắt ($0.01/GB) |

### **Render (Free tier):**

| Ưu điểm | Nhược điểm |
|---------|-----------|
| ✅ Free thật sự | ⚠️ Sleep sau 15 phút |
| ✅ 750 giờ/tháng | ⚠️ Wake up 30-60s |
| ✅ Storage free | ⚠️ Network limit |

### **Cloudflare (Free tier):**

| Ưu điểm | Nhược điểm |
|---------|-----------|
| ✅ Free | ❌ **KHÔNG chạy Node.js!** |
| ✅ CDN tốt | ❌ Chỉ static files |
| ✅ Network free | ❌ Không phù hợp |

---

## ❓ TẠI SAO KHÔNG DÙNG CLOUDFLARE?

### **Cloudflare Free Tier:**

1. **Cloudflare Pages:**
   - Chỉ chạy **static files** (HTML/CSS/JS)
   - **KHÔNG chạy Node.js backend**
   - **KHÔNG chạy Express server**
   - **KHÔNG chạy worker.js**

2. **Cloudflare Workers:**
   - Chạy JavaScript nhưng **KHÔNG phải Node.js**
   - **KHÔNG hỗ trợ Express.js**
   - Cần viết lại code theo Workers API
   - Phức tạp, không khuyến nghị cho MVP

### **App Của Bạn Cần:**

- ✅ Express.js server (`server.js`)
- ✅ Worker process (`worker.js`)
- ✅ File uploads (multer)
- ✅ Long-running processes

**→ Cloudflare KHÔNG chạy được!**

---

## 💡 KHUYẾN NGHỊ

### **Nếu Muốn Free Hoàn Toàn:**

→ **Dùng Render Free Tier**
- Free thật sự
- Đủ cho MVP
- Dùng UptimeRobot để tránh sleep

### **Nếu Chấp Nhận $5/tháng:**

→ **Dùng Railway**
- Tốt hơn
- Không sleep
- Dễ setup

### **Nếu Muốn Tối Ưu Chi Phí:**

→ **Hybrid:**
- **Backend:** Railway ($3-4/tháng)
- **Storage:** Cloudflare R2 ($0.015/GB - rẻ hơn)
- **CDN:** Cloudflare (free)

---

## 📊 BẢNG SO SÁNH CHI PHÍ

| Platform | Monthly Cost | Sleep? | Storage | Network |
|----------|-------------|--------|---------|---------|
| **Railway** | $3-4 (trong $5) | ❌ | $0.25/GB | $0.01/GB |
| **Render** | Free | ⚠️ 15min | Free | Limited |
| **Cloudflare** | Free | ❌ | ❌ | ❌ |

---

## ✅ KẾT LUẬN

### **Railway $5 Credit:**
- ✅ **Mỗi tháng** (không tích lũy)
- ✅ **Đủ cho MVP** (upload ảnh/video ít)
- ⚠️ **Cần optimize** nếu nhiều user
- ⚠️ **Storage là chi phí lớn nhất**

### **Cloudflare:**
- ❌ **KHÔNG chạy được Node.js backend**
- ✅ Chỉ dùng cho CDN/static files
- ❌ Không phù hợp cho app này

### **Khuyến Nghị:**
- **MVP/Testing:** Railway ($5 credit) hoặc Render (free)
- **Production:** Railway + optimize storage (dùng S3/R2)

---

## 🎯 NEXT STEPS

1. **Nếu chọn Railway:**
   - Deploy lên Railway
   - Monitor usage trong Dashboard
   - Optimize storage (xóa files cũ)

2. **Nếu chọn Render:**
   - Deploy lên Render (free)
   - Setup UptimeRobot (tránh sleep)
   - Monitor usage

3. **Nếu muốn tối ưu:**
   - Dùng external storage (S3/R2)
   - Dùng CDN (Cloudflare) cho static files

