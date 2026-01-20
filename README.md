# AI Dancing - Mini App

Mini app tạo video chuyển động mới giống y hệt gương mặt và hình dáng của nhân vật trong ảnh và video gốc.

## 🗓️ DAY 1 - Backend Core + Kling Motion Control

### Mục tiêu
- ✅ Gọi được Kling Motion Control API
- ✅ Poll job
- ✅ Nhận output_url
- ✅ Test bằng URL ảnh/video public
- ✅ Hỗ trợ LipSync (giữ âm thanh gốc từ video)

### Cấu trúc

```
backend/
  ├─ server.js          # Express API server
  ├─ worker.js          # Worker poll jobs từ Kling
  ├─ jobStore.js        # In-memory job store
  ├─ klingClient.js     # Kling Motion Control API client
  ├─ mockKlingServer.js # Mock Kling API server (for testing)
  ├─ package.json
  └─ .env
```

### Setup

1. **Cài đặt dependencies:**
```bash
cd backend
npm install
```

2. **Tạo file `.env`:**
```bash
cp .env.example .env
```

3. **Điền thông tin vào `.env`:**

**Option A: Dùng Mock API (không cần API key - để test)**
```bash
USE_MOCK_KLING=true
MOCK_KLING_URL=http://localhost:3002
```

**Option B: Dùng Kling API thật (cần API key)**
```bash
KLING_API_KEY=your_api_key_here
KLING_BASE_URL=https://api.kie.ai
KLING_MODEL_VERSION=motion-control
USE_MOCK_KLING=false
```

4. **Chạy server:**

**Với Mock API (test không cần API key):**
```bash
# Terminal 1: Mock Kling Server
npm run mock:kling

# Terminal 2: Main Server
USE_MOCK_KLING=true npm start

# Terminal 3: Worker
USE_MOCK_KLING=true npm run worker
```

**Hoặc dùng script tự động (Windows PowerShell):**
```powershell
.\test-mock.ps1
```

**Với Kling API thật:**
```bash
# Terminal 1: Server
npm start

# Terminal 2: Worker
npm run worker
```

### API Endpoints

#### POST `/api/dancing/create-job`
Tạo job mới với ảnh và video.

**Request:**
```json
{
  "image_url": "https://example.com/image.jpg",
  "video_url": "https://example.com/video.mp4",
  "keep_original_sound": true
}
```

**Note:** `keep_original_sound` mặc định `true` nếu không được chỉ định.

**Response:**
```json
{
  "job_id": "uuid-here",
  "status": "pending",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

#### GET `/api/dancing/job-status/:job_id`
Lấy status của job.

**Response:**
```json
{
  "job_id": "uuid-here",
  "status": "completed",
  "output_url": "https://replicate.delivery/...",
  "error": null,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:05:00.000Z"
}
```

**Status values:**
- `pending`: Job mới tạo, chưa gửi đến Replicate
- `processing`: Đang xử lý trên Replicate
- `completed`: Hoàn thành, có output_url
- `failed`: Lỗi, có error message

### 🎨 Admin Dashboard (Web UI)

Thay vì dùng curl, bạn có thể dùng **Admin Dashboard** để test dễ dàng hơn:

**Truy cập:**
```
http://localhost:3001/admin/admin.html
```

**Tính năng:**
- ✅ Tạo job mới với form đơn giản
- ✅ Xem danh sách jobs và status real-time
- ✅ Xem mock tasks từ mock server
- ✅ Auto-refresh mỗi 5 giây
- ✅ Clear jobs/tasks
- ✅ Server status indicator

**Screenshot workflow:**
1. Mở `http://localhost:3001/admin/admin.html` trên browser
2. Điền Image URL và Video URL
3. Click "Create Job"
4. Xem job status tự động update
5. Sau ~10 giây, job sẽ complete và có output_url

### Test

#### Test với Mock API (không cần API key)

**1. Start mock server:**
```bash
npm run mock:kling
```

**2. Set mock mode và start services:**
```bash
# Terminal 1
USE_MOCK_KLING=true npm start

# Terminal 2
USE_MOCK_KLING=true npm run worker
```

**3. Tạo job:**
```bash
curl -X POST http://localhost:3001/api/dancing/create-job \
  -H "Content-Type: application/json" \
  -d '{
    "image_url": "https://example.com/image.jpg",
    "video_url": "https://example.com/video.mp4",
    "keep_original_sound": true
  }'
```

**4. Poll status:**
```bash
curl http://localhost:3001/api/dancing/job-status/YOUR_JOB_ID
```

**5. Debug mock tasks:**
```bash
# Xem tất cả tasks trong mock server
curl http://localhost:3002/mock/tasks

# Xóa tất cả tasks
curl -X DELETE http://localhost:3002/mock/tasks
```

#### Test với Kling API thật

**1. Tạo job:**
```bash
curl -X POST http://localhost:3001/api/dancing/create-job \
  -H "Content-Type: application/json" \
  -d '{
    "image_url": "https://example.com/image.jpg",
    "video_url": "https://example.com/video.mp4",
    "keep_original_sound": true
  }'
```

**2. Poll status:**
```bash
curl http://localhost:3001/api/dancing/job-status/YOUR_JOB_ID
```

### ✅ Tiêu chí hoàn thành DAY 1

- [x] Có job_id
- [x] Worker gọi Replicate
- [x] Poll được status
- [x] Có output_url
- [x] Mở video xem được

### Mock Mode

Mock mode cho phép test toàn bộ flow mà không cần Kling API key:

- **Mock Server**: Simulate Kling API responses
- **Processing Time**: Mặc định 10 giây để simulate processing
- **Success Rate**: 90% success, 10% failed (để test error handling)
- **Debug Endpoints**: `/mock/tasks` để xem tất cả tasks

**Khi nào dùng Mock:**
- Test flow trước khi có API key
- Development local
- CI/CD testing

**Khi nào dùng API thật:**
- Production
- Test với data thật
- Verify output quality

### Lưu ý

- **In-memory storage**: Jobs chỉ tồn tại khi server chạy
- **Không có auth**: DAY 1 scope
- **Không có DB**: DAY 1 scope
- **Public URLs**: Cần dùng URL ảnh/video public để test
- **Kling API**: Cần có API key từ Kling. Base URL có thể thay đổi tùy provider
- **LipSync**: Mặc định giữ âm thanh gốc từ video (`keep_original_sound: true`)
- **Mock Mode**: Set `USE_MOCK_KLING=true` trong `.env` để dùng mock server

---

**Next:** DAY 2 - Upload + Frontend + Payment + TikTok Downloader

