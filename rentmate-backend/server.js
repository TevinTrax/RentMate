import http from "http";
import dotenv from "dotenv";
import app from "./src/app.js";
import pool from "./src/config/db.js";
import { initSocket } from "./src/socket/socket.js";

dotenv.config();
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
    });
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error);
    process.exit(1);
  }
};

startServer();