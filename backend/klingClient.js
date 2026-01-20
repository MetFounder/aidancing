import dotenv from "dotenv";

dotenv.config();

const KLING_API_KEY = process.env.KLING_API_KEY;
const USE_MOCK = process.env.USE_MOCK_KLING === "true";
const KLING_BASE_URL = USE_MOCK 
  ? (process.env.MOCK_KLING_URL || "http://localhost:3002")
  : (process.env.KLING_BASE_URL || "https://api.kie.ai");
const KLING_MODEL_VERSION = process.env.KLING_MODEL_VERSION || "motion-control";

/**
 * Tạo job Kling Motion Control với ảnh và video
 * @param {string} imageUrl - URL ảnh public
 * @param {string} videoUrl - URL video public
 * @param {boolean} keepOriginalSound - Giữ âm thanh gốc từ video (default: true)
 * @returns {Promise<string>} - task ID từ Kling
 */
export async function createKlingMotionControlJob(imageUrl, videoUrl, keepOriginalSound = true) {
  try {
    // Mock mode không cần API key
    if (!USE_MOCK && !KLING_API_KEY) {
      throw new Error("KLING_API_KEY is not set in environment variables");
    }

    // Endpoint tạo task - có thể thay đổi tùy theo API provider
    const endpoint = `${KLING_BASE_URL}/api/v1/jobs/createTask`;
    
    // Request body theo format Kling Motion Control API
    const requestBody = {
      model: KLING_MODEL_VERSION,
      input_urls: [imageUrl],
      video_urls: [videoUrl],
      keep_original_sound: keepOriginalSound,
      character_orientation: "video", // "video" cho video dài tối đa 30s, "image" cho ~10s
      mode: "720p", // "720p" hoặc "1080p" - có thể config sau
    };

    const headers = {
      "Content-Type": "application/json",
    };
    
    // Chỉ thêm Authorization header nếu không phải mock mode
    if (!USE_MOCK && KLING_API_KEY) {
      headers["Authorization"] = `Bearer ${KLING_API_KEY}`;
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Kling API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // Kling API trả về task_id hoặc job_id
    // Format có thể khác nhau tùy provider, cần điều chỉnh theo tài liệu thực tế
    const taskId = data.task_id || data.job_id || data.id;
    
    if (!taskId) {
      throw new Error("Kling API did not return task_id. Response: " + JSON.stringify(data));
    }

    return taskId;
  } catch (error) {
    console.error("Error creating Kling Motion Control job:", error);
    throw error;
  }
}

/**
 * Lấy status của task từ Kling
 * @param {string} taskId - Task ID từ Kling
 * @returns {Promise<Object>} - Status object với { status, output_url }
 */
export async function getKlingTaskStatus(taskId) {
  try {
    // Mock mode không cần API key
    if (!USE_MOCK && !KLING_API_KEY) {
      throw new Error("KLING_API_KEY is not set in environment variables");
    }

    // Endpoint lấy status - có thể thay đổi tùy theo API provider
    const endpoint = `${KLING_BASE_URL}/api/v1/jobs/${taskId}`;
    
    const headers = {};
    
    // Chỉ thêm Authorization header nếu không phải mock mode
    if (!USE_MOCK && KLING_API_KEY) {
      headers["Authorization"] = `Bearer ${KLING_API_KEY}`;
    }

    const response = await fetch(endpoint, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Kling API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // Map status từ Kling sang format internal
    // Kling có thể dùng: "pending", "processing", "completed", "failed"
    // Hoặc: "queued", "running", "succeeded", "failed"
    let status = data.status || data.state || "unknown";
    
    // Normalize status
    if (status === "succeeded" || status === "completed") {
      status = "succeeded";
    } else if (status === "failed" || status === "error") {
      status = "failed";
    } else if (status === "running" || status === "processing") {
      status = "processing";
    } else {
      status = "processing"; // pending, queued, starting -> processing
    }

    return {
      status: status, // "processing" | "succeeded" | "failed"
      output_url: data.output_url || data.output || data.result?.url || null,
      error: data.error || data.error_message || null,
    };
  } catch (error) {
    console.error("Error getting Kling task status:", error);
    throw error;
  }
}

