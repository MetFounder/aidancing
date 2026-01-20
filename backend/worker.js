import { getJob, updateJob } from "./jobStore.js";
import { createKlingMotionControlJob, getKlingTaskStatus } from "./klingClient.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Worker xử lý jobs
 * Poll jobs và cập nhật status
 */

const POLL_INTERVAL = 3000; // 3 giây
const MAX_RETRIES = 1; // DAY 3: Retry job 1 time only
const JOB_TIMEOUT = 10 * 60 * 1000; // 10 minutes - DAY 3: Job timeout

/**
 * Xử lý job pending
 * DAY 3: Added timeout check
 */
async function processPendingJob(job) {
  try {
    // DAY 3: Check job timeout
    const jobAge = Date.now() - new Date(job.created_at).getTime();
    if (jobAge > JOB_TIMEOUT) {
      updateJob(job.id, {
        status: "failed",
        error: "Job timeout (exceeded 10 minutes)",
      });
      console.error(`[Worker] Job ${job.id} timed out after ${Math.round(jobAge / 1000)}s`);
      return;
    }

    console.log(`[Worker] Processing job ${job.id}`);

    // Nếu chưa có kling_task_id, tạo task
    if (!job.kling_task_id) {
      const keepOriginalSound = job.keep_original_sound !== false; // default true
      const taskId = await createKlingMotionControlJob(
        job.image_url,
        job.video_url,
        keepOriginalSound
      );
      
      updateJob(job.id, {
        kling_task_id: taskId,
        status: "processing",
      });

      console.log(`[Worker] Created Kling Motion Control task: ${taskId}`);
      return;
    }

    // Poll status từ Kling
    const taskStatus = await getKlingTaskStatus(job.kling_task_id);

    if (taskStatus.status === "succeeded") {
      updateJob(job.id, {
        status: "completed",
        output_url: taskStatus.output_url,
      });
      console.log(`[Worker] Job ${job.id} completed: ${taskStatus.output_url}`);
    } else if (taskStatus.status === "failed") {
      // DAY 3: Retry on failure (1 time only)
      const retryCount = (job.retry_count || 0);
      if (retryCount < MAX_RETRIES) {
        updateJob(job.id, {
          retry_count: retryCount + 1,
          kling_task_id: null, // Reset để retry
          status: "pending",
        });
        console.log(`[Worker] Retrying job ${job.id} (${retryCount + 1}/${MAX_RETRIES})`);
      } else {
        updateJob(job.id, {
          status: "failed",
          error: taskStatus.error || "Unknown error",
        });
        console.error(`[Worker] Job ${job.id} failed: ${taskStatus.error}`);
      }
    } else if (taskStatus.status === "processing") {
      updateJob(job.id, {
        status: "processing",
      });
      console.log(`[Worker] Job ${job.id} still processing...`);
    }
  } catch (error) {
    console.error(`[Worker] Error processing job ${job.id}:`, error);
    
    // DAY 3: Retry logic - 1 time only
    const retryCount = (job.retry_count || 0) + 1;
    if (retryCount <= MAX_RETRIES) {
      updateJob(job.id, {
        retry_count: retryCount,
        kling_task_id: null, // Reset để retry
        status: "pending",
      });
      console.log(`[Worker] Will retry job ${job.id} (${retryCount}/${MAX_RETRIES})`);
    } else {
      updateJob(job.id, {
        status: "failed",
        error: error.message || "Max retries exceeded",
      });
      console.error(`[Worker] Job ${job.id} failed after ${retryCount} attempts`);
    }
  }
}

/**
 * Main worker loop
 */
async function workerLoop() {
  try {
    const { getAllJobs } = await import("./jobStore.js");
    const allJobs = getAllJobs();

    // Xử lý jobs pending hoặc processing
    const activeJobs = allJobs.filter(
      (job) => job.status === "pending" || job.status === "processing"
    );

    for (const job of activeJobs) {
      await processPendingJob(job);
    }
  } catch (error) {
    console.error("[Worker] Error in worker loop:", error);
  }
}

// Chạy worker mỗi POLL_INTERVAL
console.log(`[Worker] Starting worker (poll interval: ${POLL_INTERVAL}ms)`);
setInterval(workerLoop, POLL_INTERVAL);

// Chạy ngay lần đầu
workerLoop();

