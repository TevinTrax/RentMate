import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import usersRoutes from "./routes/users.routes.js";
import authRoutes from "./routes/auth.routes.js";
import propertiesRoutes from "./routes/properties.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import messagesRoutes from "./routes/messages.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();

/**
 * =========================================
 * CORS CONFIG
 * =========================================
 */
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow Postman / server-to-server / same-origin requests
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn(`❌ Blocked by CORS: ${origin}`);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

/**
 * IMPORTANT:
 * Do NOT use app.options("*", cors()) in Express 5
 * It crashes with path-to-regexp error.
 */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

/**
 * =========================================
 * MIDDLEWARE
 * =========================================
 */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/**
 * =========================================
 * STATIC FILES
 * =========================================
 */
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

/**
 * =========================================
 * HEALTH CHECK
 * =========================================
 */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "RentMate API is running...",
    timestamp: new Date().toISOString(),
  });
});

/**
 * =========================================
 * API ROUTES
 * =========================================
 */
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertiesRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

/**
 * =========================================
 * 404 HANDLER
 * =========================================
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/**
 * =========================================
 * GLOBAL ERROR HANDLER
 * =========================================
 */
app.use((err, req, res, next) => {
  console.error("❌ Global error:", err);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS blocked this request.",
    });
  }

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error.",
  });
});

export default app;