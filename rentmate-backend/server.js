import app from "./src/app.js";
import dotenv from "dotenv";
import { pool } from "./src/config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await pool.query("SELECT 1"); // simple test query
    console.log("Database connected successfully ✅");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1); // stop server if DB connection fails
  }
};

startServer();
