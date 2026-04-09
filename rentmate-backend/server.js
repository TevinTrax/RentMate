import http from "http";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, ".env") });

import app from "./src/app.js";
import pool from "./src/config/db.js";
import { initSocket } from "./src/socket/socket.js";

const PORT = process.env.PORT || 5000;

// Create HTTP server from Express app
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

const startServer = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Database connected successfully");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🌍 CLIENT_URL: ${process.env.CLIENT_URL}`);
      console.log(`🌍 FRONTEND_URL: ${process.env.FRONTEND_URL}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error);
    process.exit(1);
  }
};

startServer();