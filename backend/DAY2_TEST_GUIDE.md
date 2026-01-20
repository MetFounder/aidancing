# 🧪 DAY 2 - Hướng Dẫn Test Chi Tiết

## 📋 Checklist Trước Khi Test

- [ ] Đã cài dependencies: `npm install`
- [ ] Server đang chạy: `npm start`
- [ ] Worker đang chạy: `npm run worker`
- [ ] Mock Kling server đang chạy (nếu test với mock): `npm run mock:kling`
- [ ] Đã cài MetaMask extension trên browser

## 🧪 TEST 1: Upload Image/Video

### Mục tiêu: Upload file thật lên server

**Bước 1: Mở giao diện**
```
http://localhost:3001/
```

**Bước 2: Upload Image**
1. Click vào "Add Character Image" area
2. Chọn file ảnh JPG/PNG (< 10MB)
3. **Kết quả mong đợi:**
   - Message: "Uploading image..."
   - Message: "Image uploaded successfully"
   - Preview ảnh hiển thị
   - File được lưu trong `backend/uploads/images/`

**Bước 3: Upload Video**
1. Click vào "Add Motion Video" area
2. Chọn file video MP4/MOV
3. **Kết quả mong đợi:**
   - Message: "Uploading video..."
   - Message: "Video uploaded successfully"
   - Preview video hiển thị
   - File được lưu trong `backend/uploads/videos/`

**Kiểm tra:**
```powershell
# Check files đã upload
dir backend\uploads\images
dir backend\uploads\videos
```

**Lỗi thường gặp:**
- "Upload failed" → Check server logs
- File không lưu → Check quyền write folder
- Preview không hiện → Check URL trả về từ server

---

## 🧪 TEST 2: Connect Wallet & Payment

### Mục tiêu: Connect wallet và verify payment

**Bước 1: Connect Wallet**
1. Scroll xuống phần "Payment"
2. Click "Connect Wallet"
3. MetaMask popup hiện ra
4. Chọn account và click "Connect"
5. **Kết quả mong đợi:**
   - Button đổi thành "Connected: 0x1234...5678"
   - Button có màu xanh (connected state)
   - Message: "Wallet connected"

**Bước 2: Payment (khi Generate)**
1. Sau khi connect wallet
2. Upload image + video
3. Click "Generate"
4. **Kết quả mong đợi:**
   - MetaMask popup hiện payment transaction
   - Confirm transaction
   - Message: "Payment sent! TX: 0x..."
   - Message: "Payment verified!"
   - Generate button unlock

**Lưu ý:**
- Cần có Base Sepolia testnet trong MetaMask
- Cần có test ETH trên Base Sepolia
- Payment amount: 0.001 ETH (có thể config)

**Kiểm tra:**
- Check transaction trên Base Sepolia explorer
- Check server logs có verify payment không

**Lỗi thường gặp:**
- "Please install MetaMask" → Cài MetaMask extension
- "Payment failed" → Check network (Base Sepolia)
- "Payment verification failed" → Check RPC URL

---

## 🧪 TEST 3: Generate Flow (End-to-End)

### Mục tiêu: Full flow từ upload → pay → generate → result

**Bước 1: Setup**
1. Upload image
2. Upload video (hoặc chọn preset)
3. Connect wallet

**Bước 2: Generate**
1. Click "Generate"
2. Nếu chưa pay → Payment popup → Confirm
3. Payment verified → Job created
4. **Kết quả mong đợi:**
   - Message: "Job created! ID: xxx"
   - Tự động chuyển sang Result page
   - Status: "Processing your video..."
   - Loading spinner hiển thị

**Bước 3: Poll Status**
1. Result page tự động poll mỗi 3 giây
2. **Kết quả mong đợi:**
   - Sau ~10 giây (với mock): Status → "✓ Video generated successfully!"
   - Video hiển thị
   - Button "Download Video" hiện ra
   - Button "Create Another" hiện ra

**Bước 4: Download**
1. Click "Download Video"
2. **Kết quả mong đợi:**
   - Video được download về máy

**Bước 5: Create Another**
1. Click "Create Another"
2. **Kết quả mong đợi:**
   - Quay lại Create page
   - Form được reset

**Kiểm tra:**
- Check job status API: `GET /api/dancing/job-status/:job_id`
- Check worker logs có poll không
- Check output_url có đúng không

---

## 🧪 TEST 4: TikTok Downloader

### Mục tiêu: Download video từ TikTok

**Bước 1: Vào TikTok Page**
1. Click tab "TikTok"

**Bước 2: Download**
1. Paste TikTok URL vào input
2. Click "Download"
3. **Kết quả mong đợi:**
   - Message: "Downloading TikTok video..."
   - Message: "Video downloaded!"
   - Link "View" hiển thị
   - Video có thể dùng để generate

**Lưu ý:**
- Hiện tại là placeholder (chưa implement thật)
- Cần implement TikTok downloader library sau

**Kiểm tra:**
- Check `backend/uploads/tiktok/` có file không
- Check response từ API

---

## 🧪 TEST 5: Preset Selection

### Mục tiêu: Chọn preset thay vì upload video

**Bước 1: Chọn Preset**
1. Scroll xuống preset grid
2. Click vào một preset (ví dụ: "Cute Baby Dance")
3. **Kết quả mong đợi:**
   - Preset có viền xanh
   - Overlay icon ✓ hiển thị
   - Preset name đổi màu trắng

**Bước 2: Generate với Preset**
1. Upload image
2. Chọn preset (không upload video)
3. Connect wallet
4. Click "Generate"
5. **Kết quả mong đợi:**
   - Job được tạo với preset video URL
   - Flow giống như upload video

**Kiểm tra:**
- Check create-job request có video_url từ preset không
- Check preset video URL có đúng không

---

## 🧪 TEST 6: Error Handling

### Mục tiêu: Test các trường hợp lỗi

**Test 6.1: Upload không có file**
- Click upload nhưng không chọn file
- **Kết quả:** Không có lỗi (bình thường)

**Test 6.2: Upload file sai format**
- Upload file không phải JPG/PNG cho image
- **Kết quả:** Message "Please upload JPG or PNG image"

**Test 6.3: Upload file quá lớn**
- Upload file > 10MB
- **Kết quả:** Message "File size must be less than 10MB"

**Test 6.4: Generate không có image**
- Không upload image, click Generate
- **Kết quả:** Message "Please upload character image"

**Test 6.5: Generate không có video/preset**
- Không upload video và không chọn preset
- **Kết quả:** Message "Please upload video or select a preset"

**Test 6.6: Generate chưa connect wallet**
- Upload đầy đủ nhưng chưa connect wallet
- **Kết quả:** Message "Please connect wallet first"

---

## 📊 API Endpoints Test

### Test Upload
```powershell
# Upload image
$formData = @{
    file = Get-Item "path\to\image.jpg"
    fieldname = "image"
}
Invoke-WebRequest -Uri "http://localhost:3001/api/dancing/upload" -Method POST -Form $formData
```

### Test Verify Payment
```powershell
# Verify payment (thay TX_HASH bằng hash thật)
Invoke-WebRequest -Uri "http://localhost:3001/api/dancing/verify-payment" -Method POST -ContentType "application/json" -Body '{"txHash":"TX_HASH","amount":"0.001","recipient":"0x..."}'
```

### Test TikTok Download
```powershell
# Download TikTok (placeholder)
Invoke-WebRequest -Uri "http://localhost:3001/api/tiktok/download" -Method POST -ContentType "application/json" -Body '{"url":"https://www.tiktok.com/@user/video/123"}'
```

---

## ✅ Checklist Hoàn Thành DAY 2

### Backend
- [ ] POST /api/dancing/upload hoạt động
- [ ] Files lưu vào uploads/ folder
- [ ] POST /api/dancing/verify-payment hoạt động
- [ ] POST /api/tiktok/download hoạt động (placeholder OK)

### Frontend
- [ ] Upload image thật (không chỉ preview)
- [ ] Upload video thật (không chỉ preview)
- [ ] Connect wallet hoạt động
- [ ] Payment flow hoạt động
- [ ] Result page với polling hoạt động
- [ ] TikTok downloader page hoạt động

### Flow End-to-End
- [ ] Upload → Pay → Generate → Result → Download chạy được
- [ ] Không cần Postman (làm hết bằng UI)
- [ ] Mobile dùng OK

---

## 🐛 Troubleshooting

### Upload không hoạt động
- Check server logs
- Check folder `uploads/` có tồn tại không
- Check quyền write folder

### Payment không verify
- Check Base RPC URL có đúng không
- Check transaction có confirmed không
- Check recipient address có đúng không

### Result page không poll
- Check worker đang chạy không
- Check job_id có đúng không
- Check browser console có lỗi không

---

## 🎯 Next Steps

Sau khi test xong DAY 2:
1. Fix các bugs nếu có
2. Implement TikTok downloader thật (nếu cần)
3. Test trên mobile
4. Chuẩn bị DAY 3


