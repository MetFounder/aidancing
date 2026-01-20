# 🚀 Quick Start Guide

Hướng dẫn nhanh để test Mock API với Admin Dashboard.

## 📋 Bước 1: Start Services

Mở **3 terminals** và chạy:

### Terminal 1 - Mock Kling Server
```bash
cd backend
npm run mock:kling
```
✅ Mock server chạy ở: `http://localhost:3002`

### Terminal 2 - Main Server
```bash
cd backend
USE_MOCK_KLING=true npm start
```
✅ Main server chạy ở: `http://localhost:3001`

### Terminal 3 - Worker
```bash
cd backend
USE_MOCK_KLING=true npm run worker
```
✅ Worker đang poll jobs

## 🎨 Bước 2: Mở Admin Dashboard

Mở browser và truy cập:
```
http://localhost:3001/admin/admin.html
```

## 🧪 Bước 3: Test Flow

### 1. Tạo Job
- Điền **Image URL**: `https://picsum.photos/800/800`
- Điền **Video URL**: `https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4`
- Check **Keep Original Sound** (nếu muốn)
- Click **"Create Job"**

### 2. Xem Status
- Job sẽ xuất hiện trong **Jobs List**
- Status tự động update: `pending` → `processing` → `completed`
- Sau ~10 giây, job sẽ complete và có **output_url**

### 3. Debug
- Click **"Refresh Mock Tasks"** để xem tasks trong mock server
- Click **"Clear All"** để xóa tất cả jobs

## ⚙️ Configuration

Nếu server chạy ở port khác, sửa trong Admin Dashboard:
- **Main Server URL**: `http://localhost:3001` (hoặc port của bạn)
- **Mock Kling Server URL**: `http://localhost:3002` (hoặc port của bạn)

## 🐛 Troubleshooting

### Admin Dashboard không load
- Check main server đang chạy: `http://localhost:3001/health`
- Check browser console có lỗi không

### Jobs không hiển thị
- Check mock server đang chạy: `http://localhost:3002/health`
- Click "Refresh" trong Admin Dashboard

### Job không complete
- Mock server simulate 10 giây processing time
- Đợi đủ 10 giây
- Check worker logs

## 📊 API Endpoints (nếu muốn dùng curl)

### Tạo job
```bash
curl -X POST http://localhost:3001/api/dancing/create-job \
  -H "Content-Type: application/json" \
  -d '{
    "image_url": "https://picsum.photos/800/800",
    "video_url": "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
  }'
```

### Poll status
```bash
curl http://localhost:3001/api/dancing/job-status/YOUR_JOB_ID
```

### Debug mock
```bash
curl http://localhost:3002/mock/tasks
```

## ✅ Checklist

- [ ] Mock server chạy (port 3002)
- [ ] Main server chạy (port 3001)
- [ ] Worker chạy
- [ ] Admin Dashboard mở được
- [ ] Tạo job thành công
- [ ] Job status update đúng
- [ ] Job complete sau ~10 giây

## 🎯 Next Steps

Sau khi test xong với mock:
1. Lấy Kling API key
2. Set `USE_MOCK_KLING=false` trong `.env`
3. Điền `KLING_API_KEY` và `KLING_BASE_URL`
4. Restart services
5. Test với API thật


