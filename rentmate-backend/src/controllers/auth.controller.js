import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const loginUser = async (req, res) => {
  try {
    const { role, email, password } = req.body;

    // Validation
    if (!role || !email || !password) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    // Normalize inputs
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedRole = role.toLowerCase();

    // Fetch user
    const result = await pool.query(
      `SELECT id, email, password_hash, role FROM users WHERE email=$1 AND LOWER(role)=$2`,
      [normalizedEmail, normalizedRole]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Send response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export default loginUser;