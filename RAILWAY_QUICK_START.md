# ⚡ Railway Quick Start - 5 Phút

## 🎯 TỔNG QUAN

Sau khi xóa hết, làm lại từ đầu với Dockerfile.

---

## 🚀 3 BƯỚC CHÍNH

### **BƯỚC 1: Tạo Project (2 phút)**

1. Railway Dashboard → **"New Project"**
2. **"Deploy from GitHub repo"**
3. Chọn: `MetFounder/aidancing`
4. Click **"Deploy Now"**
5. **Đợi 2-3 phút** → Railway tự động detect Dockerfile và deploy

**Kết quả:**
- Service status: **"Active"**
- Domain: `your-app.railway.app`

---

### **BƯỚC 2: Environment Variables (3 phút)**

1. Service → Tab **"Variables"**
2. Thêm 6 variables:

```
PORT=3001
NODE_ENV=production
USE_MOCK_KLING=true
MOCK_KLING_URL=http://localhost:3002
BASE_RPC_URL=https://sepolia.base.org
PAYMENT_RECIPIENT=0xYOUR_WALLET_ADDRESS
```

---

### **BƯỚC 3: Worker Service (3 phút)**

1. **New** → **"Empty Service"**
2. **Connect GitHub:** `MetFounder/aidancing`
3. Railway sẽ detect `Dockerfile.worker` tự động
4. **Variables:** Copy từ service chính
5. Deploy → Worker chạy!

---

## ✅ DONE!

- ✅ Web service chạy
- ✅ Worker chạy
- ✅ Test: `https://your-app.railway.app`

---

## 🔗 KẾT NỐI DOMAIN (Sau)

1. Railway: Settings → Networking → Custom Domain
2. Namecheap: Advanced DNS → CNAME → `your-app.railway.app`
3. Đợi 5-10 phút → SSL tự động

---

Xem chi tiết: `RAILWAY_DEPLOY_FROM_SCRATCH.md`
