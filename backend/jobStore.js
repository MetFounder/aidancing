/**
 * In-memory job store (DAY 1 scope - không dùng DB)
 * Lưu trữ job state trong memory
 */

const jobs = new Map();

/**
 * Tạo job mới
 * @param {string} jobId - Unique job ID
 * @param {Object} data - Job data { image_url, video_url, replicate_id }
 * @returns {Object} - Job object
 */
export function createJob(jobId, data) {
  const job = {
    id: jobId,
    image_url: data.image_url,
    video_url: data.video_url,
    keep_original_sound: data.keep_original_sound !== false, // default true
    kling_task_id: data.kling_task_id || null,
    status: "pending", // "pending" | "processing" | "completed" | "failed"
    output_url: null,
    error: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  jobs.set(jobId, job);
  return job;
}

/**
 * Lấy job theo ID
 * @param {string} jobId - Job ID
 * @returns {Object|null} - Job object hoặc null
 */
export function getJob(jobId) {
  return jobs.get(jobId) || null;
}

/**
 * Cập nhật job
 * @param {string} jobId - Job ID
 * @param {Object} updates - Updates { status, output_url, error, replicate_id }
 * @returns {Object|null} - Updated job hoặc null
 */
export function updateJob(jobId, updates) {
  const job = jobs.get(jobId);
  if (!job) return null;

  Object.assign(job, updates, {
    updated_at: new Date().toISOString(),
  });

  return job;
}

/**
 * Lấy tất cả jobs (debug)
 * @returns {Array} - Array of jobs
 */
export function getAllJobs() {
  return Array.from(jobs.values());
}

/**
 * Xóa job (cleanup)
 * @param {string} jobId - Job ID
 */
export function deleteJob(jobId) {
  jobs.delete(jobId);
}

