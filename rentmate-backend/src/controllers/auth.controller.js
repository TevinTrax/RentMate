import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOTPEmail } from "../utils/email.js"; // your email utility
import crypto from "crypto";
import { sendResetPasswordEmail } from "../utils/email.js"; // email utility for reset link
import dotenv from "dotenv";
dotenv.config();

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Cooldown time for resending OTP (in seconds)
const OTP_RESEND_COOLDOWN = 60;

// ===== STEP 1: LOGIN & SEND OTP =====
export const login2FA = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await pool.query(
      'SELECT id, email, password_hash, role, approval_status, is_2fa_enabled FROM users WHERE email=$1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0)
      return res.status(400).json({ error: 'Invalid credentials' });

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

    // If 2FA is disabled → issue token directly
    if (!user.is_2fa_enabled) {
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, approval_status: user.approval_status },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      return res.status(200).json({ message: 'Login successful', token, user });
    }

    // 2FA enabled → generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await pool.query(
      'INSERT INTO otp_verifications (user_id, email, otp_code, expires_at, is_verified, created_at) VALUES ($1, $2, $3, $4, FALSE, NOW())',
      [user.id, user.email, otp, expiresAt]
    );

    await sendOTPEmail(user.email, otp);

    res.status(200).json({ message: 'OTP sent to your email', userId: user.id });

  } catch (err) {
    console.error("login2FA error:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ===== STEP 2: VERIFY OTP =====
export const verifyOTP = async (req, res) => {
  const { userId, otp } = req.body;

  try {
    if (!userId || !otp) return res.status(400).json({ error: "User ID and OTP are required" });

    const otpResult = await pool.query(
      `SELECT * FROM otp_verifications
       WHERE user_id=$1 AND otp_code=$2 AND is_verified=FALSE AND expires_at>NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [userId, otp]
    );

    if (otpResult.rows.length === 0)
      return res.status(400).json({ error: 'Invalid or expired OTP' });

    // Mark OTP as verified
    await pool.query('UPDATE otp_verifications SET is_verified=TRUE WHERE id=$1', [otpResult.rows[0].id]);

    // Fetch user info
    const userResult = await pool.query(
      'SELECT id, email, role, approval_status FROM users WHERE id=$1',
      [userId]
    );
    const user = userResult.rows[0];

    // Issue JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, approval_status: user.approval_status },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ message: 'OTP verified', token, user });
  } catch (err) {
    console.error("verifyOTP error:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ===== RESEND OTP =====
export const resendOTP = async (req, res) => {
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ error: "User ID is required" });

  try {
    const lastOtpResult = await pool.query(
      `SELECT * FROM otp_verifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );

    if (lastOtpResult.rows.length === 0)
      return res.status(400).json({ error: "No previous OTP found" });

    const lastOtp = lastOtpResult.rows[0];
    const secondsSinceLastOTP = (Date.now() - new Date(lastOtp.created_at).getTime()) / 1000;

    if (secondsSinceLastOTP < OTP_RESEND_COOLDOWN)
      return res.status(429).json({ error: `Please wait ${Math.ceil(OTP_RESEND_COOLDOWN - secondsSinceLastOTP)} seconds before requesting a new OTP` });

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(
      'INSERT INTO otp_verifications (user_id, email, otp_code, expires_at, is_verified, created_at) VALUES ($1, $2, $3, $4, FALSE, NOW())',
      [lastOtp.user_id, lastOtp.email, otp, expiresAt]
    );

    await sendOTPEmail(lastOtp.email, otp);

    res.status(200).json({ message: "New OTP sent to email" });
  } catch (err) {
    console.error("resendOTP error:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ===== ADMIN: APPROVE LANDLORD =====
export const approveLandlord = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "UPDATE users SET approval_status='approved' WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "Landlord approved successfully", user: result.rows[0] });
  } catch (err) {
    console.error("approveLandlord error:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const userResult = await pool.query("SELECT id FROM users WHERE email=$1", [email.toLowerCase()]);
    if (!userResult.rows.length) return res.status(404).json({ error: "Email not found" });

    const userId = userResult.rows[0].id;
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await pool.query(
      "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [userId, token, expiresAt]
    );

    await sendResetPasswordEmail(email, token);

    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (err) {
    console.error("forgotPassword error:", err.message);
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const tokenResult = await pool.query(
      "SELECT user_id FROM password_reset_tokens WHERE token=$1 AND expires_at>NOW()",
      [token]
    );
    if (!tokenResult.rows.length) return res.status(400).json({ error: "Invalid or expired token" });

    const userId = tokenResult.rows[0].user_id;
    const passwordHash = await bcrypt.hash(password, 10);

    await pool.query("UPDATE users SET password_hash=$1 WHERE id=$2", [passwordHash, userId]);
    await pool.query("DELETE FROM password_reset_tokens WHERE token=$1", [token]);

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("resetPassword error:", err.message);
    res.status(500).json({ error: "Server error: " + err.message });
  }
};