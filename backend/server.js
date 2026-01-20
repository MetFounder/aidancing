import express from "express";
import cors from "cors";
import { createJob, getJob } from "./jobStore.js";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import multer from "multer";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// DAY 3: Rate limiting - Track active jobs per session/IP
const sessionJobs = new Map(); // sessionId -> { jobId, createdAt }
const JOB_TIMEOUT = 10 * 60 * 1000; // 10 minutes
const MAX_JOBS_PER_SESSION = 1;

// Helper to get session ID from request (IP-based for MVP)
function getSessionId(req) {
  return req.ip || req.connection.remoteAddress || 'unknown';
}

// Middleware: Cleanup old sessions
function cleanupSessions() {
  const now = Date.now();
  for (const [sessionId, sessionData] of sessionJobs.entries()) {
    if (now - sessionData.createdAt > JOB_TIMEOUT) {
      sessionJobs.delete(sessionId);
    }
  }
}
setInterval(cleanupSessions, 60000); // Cleanup every minute

// Create uploads directories
const uploadsDir = join(__dirname, "uploads");
const imagesDir = join(uploadsDir, "images");
const videosDir = join(uploadsDir, "videos");
const tiktokDir = join(uploadsDir, "tiktok");

[uploadsDir, imagesDir, videosDir, tiktokDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'image') {
      cb(null, imagesDir);
    } else if (file.fieldname === 'video') {
      cb(null, videosDir);
    } else {
      cb(null, uploadsDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max
  }
});

// Middleware
app.use(cors());
app.use(express.json());
// DAY 3: Trust proxy for accurate IP detection
app.set('trust proxy', 1);

// Serve static files (main UI)
app.use(express.static(join(__dirname, "public")));

// Serve uploaded files
app.use("/uploads", express.static(uploadsDir));

/**
 * POST /api/dancing/create-job
 * Tạo job mới với image_url và video_url
 * DAY 3: Rate limit - 1 job per session
 */
app.post("/api/dancing/create-job", async (req, res) => {
  try {
    const { image_url, video_url, keep_original_sound } = req.body;

    // DAY 3: Rate limit - Check if session already has active job
    const sessionId = getSessionId(req);
    const existingSession = sessionJobs.get(sessionId);
    
    if (existingSession) {
      const job = getJob(existingSession.jobId);
      
      // Check if job is still active (pending or processing)
      if (job && (job.status === 'pending' || job.status === 'processing')) {
        // Check timeout
        const jobAge = Date.now() - new Date(job.created_at).getTime();
        if (jobAge < JOB_TIMEOUT) {
          return res.status(429).json({
            error: "You already have an active job. Please wait for it to complete.",
            existing_job_id: job.id,
            existing_job_status: job.status,
          });
        } else {
          // Job timeout, allow new job
          sessionJobs.delete(sessionId);
        }
      } else {
        // Job completed/failed, allow new job
        sessionJobs.delete(sessionId);
      }
    }

    // Validation
    if (!image_url || !video_url) {
      return res.status(400).json({
        error: "Missing required fields: image_url and video_url",
      });
    }

    // Validate URLs
    try {
      new URL(image_url);
      new URL(video_url);
    } catch (e) {
      return res.status(400).json({
        error: "Invalid URL format",
      });
    }

    // Tạo job ID
    const jobId = uuidv4();

    // Tạo job trong store
    // keep_original_sound mặc định true nếu không được chỉ định
    const job = createJob(jobId, {
      image_url,
      video_url,
      keep_original_sound: keep_original_sound !== false, // default true
    });

    // DAY 3: Track session job
    sessionJobs.set(sessionId, {
      jobId: job.id,
      createdAt: Date.now(),
    });

    console.log(`[Server] Created job ${jobId} for session ${sessionId}`);

    res.json({
      job_id: job.id,
      status: job.status,
      created_at: job.created_at,
    });
  } catch (error) {
    console.error("[Server] Error creating job:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

/**
 * GET /api/dancing/job-status/:job_id
 * Lấy status của job
 */
app.get("/api/dancing/job-status/:job_id", (req, res) => {
  try {
    const { job_id } = req.params;

    const job = getJob(job_id);

    if (!job) {
      return res.status(404).json({
        error: "Job not found",
      });
    }

    res.json({
      job_id: job.id,
      status: job.status,
      output_url: job.output_url,
      error: job.error,
      created_at: job.created_at,
      updated_at: job.updated_at,
    });
  } catch (error) {
    console.error("[Server] Error getting job status:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

/**
 * Health check
 */
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

/**
 * POST /api/dancing/upload
 * Upload ảnh hoặc video
 */
app.post("/api/dancing/upload", upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded",
      });
    }

    const fileUrl = `/uploads/${req.file.fieldname === 'image' ? 'images' : 'videos'}/${req.file.filename}`;
    const fullUrl = `${req.protocol}://${req.get('host')}${fileUrl}`;

    console.log(`[Server] File uploaded: ${req.file.filename}`);

    res.json({
      url: fullUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (error) {
    console.error("[Server] Error uploading file:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

/**
 * POST /api/dancing/verify-payment
 * Verify Base blockchain payment
 */
app.post("/api/dancing/verify-payment", async (req, res) => {
  try {
    const { txHash, amount, recipient } = req.body;

    if (!txHash) {
      return res.status(400).json({
        error: "Missing transaction hash",
      });
    }

    // Base network RPC (Base Sepolia testnet hoặc Base mainnet)
    const BASE_RPC = process.env.BASE_RPC_URL || "https://sepolia.base.org";
    
    try {
      // Verify transaction using Base RPC
      const response = await fetch(BASE_RPC, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getTransactionReceipt',
          params: [txHash],
          id: 1
        })
      });
      
      const data = await response.json();
      
      if (!data.result || data.result.status !== '0x1') {
        return res.status(400).json({
          verified: false,
          error: "Transaction failed or not confirmed",
        });
      }

      // Get transaction details
      const txResponse = await fetch(BASE_RPC, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getTransactionByHash',
          params: [txHash],
          id: 1
        })
      });
      
      const txData = await txResponse.json();
      const tx = txData.result;
      
      if (!tx) {
        return res.status(400).json({
          verified: false,
          error: "Transaction not found",
        });
      }

      // Verify recipient if provided
      if (recipient && tx.to?.toLowerCase() !== recipient.toLowerCase()) {
        return res.status(400).json({
          verified: false,
          error: "Recipient mismatch",
        });
      }

      // Verify amount if provided (convert from hex to wei)
      if (amount) {
        const txValue = BigInt(tx.value);
        const expectedValue = BigInt(Math.floor(parseFloat(amount) * 1e18));
        if (txValue !== expectedValue) {
          return res.status(400).json({
            verified: false,
            error: "Amount mismatch",
          });
        }
      }

      console.log(`[Server] Payment verified: ${txHash}`);

      res.json({
        verified: true,
        txHash: txHash,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        blockNumber: data.result.blockNumber,
      });
    } catch (error) {
      console.error("[Server] Error verifying payment:", error);
      res.status(500).json({
        verified: false,
        error: "Error verifying transaction",
        message: error.message,
      });
    }
  } catch (error) {
    console.error("[Server] Error in verify-payment:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

/**
 * POST /api/tiktok/download
 * Download video from TikTok URL
 */
app.post("/api/tiktok/download", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        error: "Missing TikTok URL",
      });
    }

    // Validate TikTok URL
    if (!url.includes('tiktok.com')) {
      return res.status(400).json({
        error: "Invalid TikTok URL",
      });
    }

    // For MVP, return a placeholder
    // In production, you'd use a TikTok downloader library
    // Example: const videoUrl = await downloadTikTokVideo(url);
    
    // Simulate download (replace with actual TikTok downloader)
    const videoId = Date.now();
    const videoUrl = `/uploads/tiktok/tiktok-${videoId}.mp4`;
    const fullUrl = `${req.protocol}://${req.get('host')}${videoUrl}`;

    console.log(`[Server] TikTok download requested: ${url}`);

    // TODO: Implement actual TikTok download
    // For now, return placeholder
    res.json({
      url: fullUrl,
      original_url: url,
      message: "TikTok downloader - placeholder (implement actual download)",
    });
  } catch (error) {
    console.error("[Server] Error downloading TikTok:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

/**
 * Serve main UI at root
 */
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`[Server] Backend running on http://localhost:${PORT}`);
  console.log(`[Server] DAY 3: UX + Hardening`);
  console.log(`[Server] Rate limit: ${MAX_JOBS_PER_SESSION} job per session`);
  console.log(`[Server] Job timeout: ${JOB_TIMEOUT / 1000}s`);
});

