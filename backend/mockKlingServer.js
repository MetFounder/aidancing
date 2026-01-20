import express from "express";
import cors from "cors";

/**
 * Mock Kling API Server
 * Simulate Kling Motion Control API responses để test flow
 * Chạy trên port khác với main server (default: 3002)
 */

const app = express();
const PORT = process.env.MOCK_KLING_PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory store cho mock tasks
const mockTasks = new Map();

// Simulate processing time (seconds)
const PROCESSING_TIME = 10; // 10 giây để simulate processing

/**
 * POST /api/v1/jobs/createTask
 * Tạo task mới
 */
app.post("/api/v1/jobs/createTask", (req, res) => {
  try {
    const { input_urls, video_urls, keep_original_sound, model } = req.body;

    // Validation
    if (!input_urls || !video_urls || input_urls.length === 0 || video_urls.length === 0) {
      return res.status(400).json({
        error: "Missing required fields: input_urls and video_urls",
      });
    }

    // Tạo task ID
    const taskId = `mock_task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Lưu task với status "pending"
    mockTasks.set(taskId, {
      id: taskId,
      status: "pending",
      input_urls,
      video_urls,
      keep_original_sound: keep_original_sound !== false,
      model: model || "motion-control",
      created_at: new Date().toISOString(),
      started_at: null,
      completed_at: null,
      output_url: null,
      error: null,
    });

    console.log(`[Mock Kling] Created task ${taskId}`);

    // Simulate async processing - sẽ chuyển sang "processing" sau 1s
    setTimeout(() => {
      const task = mockTasks.get(taskId);
      if (task) {
        task.status = "processing";
        task.started_at = new Date().toISOString();
        console.log(`[Mock Kling] Task ${taskId} started processing`);
      }
    }, 1000);

    // Simulate completion sau PROCESSING_TIME giây
    setTimeout(() => {
      const task = mockTasks.get(taskId);
      if (task) {
        // 90% success rate, 10% failed
        const isSuccess = Math.random() > 0.1;
        
        if (isSuccess) {
          task.status = "succeeded";
          task.completed_at = new Date().toISOString();
          // Mock output URL
          task.output_url = `https://mock-kling-output.s3.amazonaws.com/videos/${taskId}.mp4`;
          console.log(`[Mock Kling] Task ${taskId} completed: ${task.output_url}`);
        } else {
          task.status = "failed";
          task.completed_at = new Date().toISOString();
          task.error = "Mock error: Video processing failed";
          console.log(`[Mock Kling] Task ${taskId} failed: ${task.error}`);
        }
      }
    }, PROCESSING_TIME * 1000);

    // Response ngay lập tức với task_id
    res.json({
      task_id: taskId,
      status: "pending",
      message: "Task created successfully",
    });
  } catch (error) {
    console.error("[Mock Kling] Error creating task:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

/**
 * GET /api/v1/jobs/:taskId
 * Lấy status của task
 */
app.get("/api/v1/jobs/:taskId", (req, res) => {
  try {
    const { taskId } = req.params;

    const task = mockTasks.get(taskId);

    if (!task) {
      return res.status(404).json({
        error: "Task not found",
      });
    }

    // Response theo format Kling API
    const response = {
      task_id: task.id,
      status: task.status, // "pending" | "processing" | "succeeded" | "failed"
      created_at: task.created_at,
      started_at: task.started_at,
      completed_at: task.completed_at,
    };

    // Thêm output_url nếu đã completed
    if (task.status === "succeeded" && task.output_url) {
      response.output_url = task.output_url;
      response.output = task.output_url; // Một số API dùng "output" thay vì "output_url"
    }

    // Thêm error nếu failed
    if (task.status === "failed" && task.error) {
      response.error = task.error;
      response.error_message = task.error;
    }

    res.json(response);
  } catch (error) {
    console.error("[Mock Kling] Error getting task status:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

/**
 * GET /health
 * Health check
 */
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Mock Kling API",
    tasks_count: mockTasks.size,
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /mock/tasks
 * Debug endpoint - xem tất cả tasks
 */
app.get("/mock/tasks", (req, res) => {
  res.json({
    tasks: Array.from(mockTasks.values()),
    count: mockTasks.size,
  });
});

/**
 * DELETE /mock/tasks/:taskId
 * Debug endpoint - xóa task
 */
app.delete("/mock/tasks/:taskId", (req, res) => {
  const { taskId } = req.params;
  const deleted = mockTasks.delete(taskId);
  res.json({
    deleted,
    taskId,
  });
});

/**
 * DELETE /mock/tasks
 * Debug endpoint - xóa tất cả tasks
 */
app.delete("/mock/tasks", (req, res) => {
  const count = mockTasks.size;
  mockTasks.clear();
  res.json({
    deleted: count,
    message: "All tasks cleared",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`[Mock Kling] Mock Kling API Server running on http://localhost:${PORT}`);
  console.log(`[Mock Kling] Endpoints:`);
  console.log(`  POST   /api/v1/jobs/createTask`);
  console.log(`  GET    /api/v1/jobs/:taskId`);
  console.log(`  GET    /health`);
  console.log(`  GET    /mock/tasks (debug)`);
  console.log(`  DELETE /mock/tasks/:taskId (debug)`);
  console.log(`  DELETE /mock/tasks (debug - clear all)`);
});


