import { pool } from "../config/db.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

export const createUser = async (req, res) => {
  try {
    const {
      full_name,
      email,
      id_number,
      phone_number,
      alt_phone_number,
      password,
      role, // if you want to save role too
    } = req.body;

    // 1. Validation
    if (
      !full_name ||
      !email ||
      !id_number ||
      !phone_number ||
      !password
    ) {
      return res.status(400).json({
        error: "All required fields must be filled",
      });
    }

    // 2. Check if email already exists
    const emailCheck = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(409).json({
        error: "Email already registered",
      });
    }

    // 3. Hash password
    const saltRounds = 10; // good default
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Insert user into database
    const result = await pool.query(
      `
      INSERT INTO users
      (full_name, role, email, id_number, phone_number, alt_phone_number, password_hash)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, full_name, email, role
      `,
      [
        full_name,
        role || "user", // default role if missing
        email,
        id_number,
        phone_number,
        alt_phone_number,
        hashedPassword,
      ]
    );

    // 5. Response
    res.status(201).json({
      message: "Account created successfully",
      user: result.rows[0],
    });

  } catch (error) {
    console.error("Create user error:", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};
