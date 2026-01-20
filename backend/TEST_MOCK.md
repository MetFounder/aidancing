# 🧪 Test với Mock Kling API

Hướng dẫn test flow DAY 1 với Mock API (không cần Kling API key).

## 🚀 Quick Start

### Cách 1: Dùng script tự động (Windows)

```powershell
cd backend
.\test-mock.ps1
```

Script sẽ tự động:
- Tạo `.env` nếu chưa có
- Set `USE_MOCK_KLING=true`
- Start mock server (port 3002)
- Start main server (port 3001)
- Start worker

### Cách 2: Manual (3 terminals)

**Terminal 1 - Mock Kling Server:**
```bash
cd backend
npm run mock:kling
```

**Terminal 2 - Main Server:**
```bash
cd backend
USE_MOCK_KLING=true npm start
```

**Terminal 3 - Worker:**
```bash
cd backend
USE_MOCK_KLING=true npm run worker
```

## 🧪 Test Flow

### 1. Tạo job mới

```bash
curl -X POST http://localhost:3001/api/dancing/create-job \
  -H "Content-Type: application/json" \
  -d '{
    "image_url": "https://picsum.photos/800/800",
    "video_url": "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    "keep_original_sound": true
  }'
```

**Response:**
```json
{
  "job_id": "uuid-here",
  "status": "pending",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

Lưu `job_id` để poll status.

### 2. Poll job status

```bash
# Thay YOUR_JOB_ID bằng job_id từ bước 1
curl http://localhost:3001/api/dancing/job-status/YOUR_JOB_ID
```

**Response (pending/processing):**
```json
{
  "job_id": "uuid-here",
  "status": "processing",
  "output_url": null,
  "error": null,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:10.000Z"
}
```

**Response (completed - sau ~10 giây):**
```json
{
  "job_id": "uuid-here",
  "status": "completed",
  "output_url": "https://mock-kling-output.s3.amazonaws.com/videos/mock_task_xxx.mp4",
  "error": null,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:10.000Z"
}
```

### 3. Debug Mock Server

**Xem tất cả tasks:**
```bash
curl http://localhost:3002/mock/tasks
```

**Xóa tất cả tasks:**
```bash
curl -X DELETE http://localhost:3002/mock/tasks
```

**Health check:**
```bash
curl http://localhost:3002/health
```

## ⏱️ Timeline

- **0s**: Job created, status = "pending"
- **1s**: Status chuyển sang "processing"
- **10s**: Status chuyển sang "succeeded" hoặc "failed" (90% success, 10% failed)

## 🐛 Troubleshooting

### Mock server không start
- Check port 3002 có bị chiếm không: `netstat -ano | findstr :3002`
- Thay đổi port trong `.env`: `MOCK_KLING_PORT=3003`

### Worker không poll
- Check `USE_MOCK_KLING=true` trong `.env` hoặc environment variable
- Check mock server đang chạy: `curl http://localhost:3002/health`

### Job không complete
- Mock server simulate 10 giây processing time
- Đợi đủ 10 giây rồi poll lại
- Check worker logs xem có error không

## ✅ Checklist Test

- [ ] Mock server start được (port 3002)
- [ ] Main server start được (port 3001)
- [ ] Worker start được và log "Starting worker"
- [ ] Tạo job thành công, nhận được job_id
- [ ] Poll status thấy status chuyển từ "pending" → "processing"
- [ ] Sau ~10 giây, status chuyển sang "completed" hoặc "failed"
- [ ] Nếu completed, có output_url
- [ ] Debug endpoint `/mock/tasks` trả về danh sách tasks

## 🔄 Chuyển sang API thật

Khi có Kling API key:

1. Set trong `.env`:
```bash
USE_MOCK_KLING=false
KLING_API_KEY=your_api_key_here
KLING_BASE_URL=https://api.kie.ai  # hoặc URL từ tài liệu
```

2. Stop mock server

3. Restart main server và worker:
```bash
npm start
npm run worker
```

Code sẽ tự động dùng API thật thay vì mock.


