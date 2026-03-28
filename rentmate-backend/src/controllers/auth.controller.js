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

// ===== STEP 1: LOGIN & SEND OTP (updated) =====
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

    // Check for existing unexpired OTP
    const existingOtpResult = await pool.query(
      `SELECT * FROM otp_verifications 
       WHERE user_id=$1 AND is_verified=FALSE AND expires_at>NOW() 
       ORDER BY created_at DESC LIMIT 1`,
      [user.id]
    );

    if (existingOtpResult.rows.length > 0) {
      // OTP already exists → do not create a new one
      return res.status(200).json({ message: 'OTP already sent to your email', userId: user.id });
    }

    // No active OTP → generate new OTP
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

// RESEND OTP
export const resendOTP = async (req, res) => {
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ error: "User ID is required" });

  try {
    // Get the latest OTP for this user
    const lastOtpResult = await pool.query(
      `SELECT * FROM otp_verifications 
       WHERE user_id=$1 
       ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );

    if (lastOtpResult.rows.length === 0)
      return res.status(400).json({ error: "No previous OTP found" });

    const lastOtp = lastOtpResult.rows[0];
    const now = new Date();
    const secondsSinceLastOTP = (now.getTime() - new Date(lastOtp.created_at).getTime()) / 1000;

    // If cooldown is not over → reject
    if (secondsSinceLastOTP < OTP_RESEND_COOLDOWN) {
      const waitTime = Math.ceil(OTP_RESEND_COOLDOWN - secondsSinceLastOTP);
      return res.status(429).json({ error: `Please wait ${waitTime} seconds before requesting a new OTP` });
    }

    // If last OTP is still valid and unverified → reuse it
    if (!lastOtp.is_verified && new Date(lastOtp.expires_at) > now) {
      await sendOTPEmail(lastOtp.email, lastOtp.otp_code);
      return res.status(200).json({ message: "OTP resent to your email" });
    }

    // Otherwise → generate a new OTP
    const otp = generateOTP();
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes

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

// Generate reset token & send email
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: "Email is required" });

    const userResult = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0) return res.status(404).json({ error: "User not found" });

    const userId = userResult.rows[0].id;
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "30m" });

    await sendResetPasswordEmail(email, token);

    return res.status(200).json({ message: "Reset email sent" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Reset password with token
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params; // get token from URL

    if (!token) return res.status(400).json({ error: "Reset token is required" });
    if (!password) return res.status(400).json({ error: "Password is required" });

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters and include uppercase, lowercase, and a number",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
      hashedPassword,
      decoded.id,
    ]);

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error.message);

    if (error.name === "TokenExpiredError")
      return res.status(400).json({ error: "Reset link has expired" });
    if (error.name === "JsonWebTokenError")
      return res.status(400).json({ error: "Invalid reset token" });

    return res.status(500).json({ error: "Internal server error" });
  }
};