import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
import { sendOTPEmail, sendResetPasswordEmail } from "../utils/email.js";

dotenv.config();

/* CONFIG */
const OTP_EXPIRY_MINUTES = 10;
const OTP_RESEND_COOLDOWN = 60; // seconds
const MAX_OTP_ATTEMPTS = 5;
const SALT_ROUNDS = 10;

/* HELPERS*/
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const normalizePhone = (phone = "") => {
  let cleaned = phone.replace(/\s+/g, "").replace(/-/g, "");

  if (cleaned.startsWith("+254")) {
    cleaned = "0" + cleaned.slice(4);
  } else if (cleaned.startsWith("254")) {
    cleaned = "0" + cleaned.slice(3);
  }

  return cleaned;
};

const isValidKenyanPhone = (phone) => {
  const normalized = normalizePhone(phone);
  return /^(07|01)\d{8}$/.test(normalized);
};

const isValidKenyanID = (id) => {
  return /^[0-9]{7,8}$/.test(String(id).trim());
};

/**
 * Strong password for RentMate:
 * - at least 8 chars
 * - uppercase
 * - lowercase
 * - number
 * - special character
 */
const isStrongPassword = (password) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password);
};

const passwordValidationMessage =
  "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";

const createToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      approval_status: user.approval_status,
      is_verified: user.is_verified,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

/* REGISTER USER (ADMIN / TENANT / LANDLORD) */
export const registerUser = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      alt_phone_number,
      id_number,
      password,
      role,
    } = req.body;

    if (
      !first_name ||
      !last_name ||
      !email ||
      !phone_number ||
      !id_number ||
      !password ||
      !role
    ) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    const normalizedEmail = normalizeEmail(email);
    const normalizedPhone = normalizePhone(phone_number);
    const normalizedAltPhone = alt_phone_number
      ? normalizePhone(alt_phone_number)
      : null;

    if (!["Admin", "Tenant", "Landlord"].includes(role)) {
      return res.status(400).json({ error: "Invalid role selected" });
    }

    if (!isValidKenyanPhone(normalizedPhone)) {
      return res.status(400).json({
        error: "Invalid Kenyan phone number. Use 07XXXXXXXX or 01XXXXXXXX",
      });
    }

    if (normalizedAltPhone && !isValidKenyanPhone(normalizedAltPhone)) {
      return res.status(400).json({
        error: "Invalid alternative Kenyan phone number",
      });
    }

    if (!isValidKenyanID(id_number)) {
      return res.status(400).json({
        error: "Invalid Kenyan ID number. It should be 7 or 8 digits.",
      });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({ error: passwordValidationMessage });
    }

    await client.query("BEGIN");

    const existingUser = await client.query(
      `SELECT id FROM users 
       WHERE email = $1 OR phone_number = $2 OR id_number = $3`,
      [normalizedEmail, normalizedPhone, id_number]
    );

    if (existingUser.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        error: "A user with this email, phone number, or ID already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const approvalStatus = role === "Admin" ? "approved" : "pending";

    const insertedUser = await client.query(
      `INSERT INTO users (
        first_name,
        last_name,
        email,
        phone_number,
        alt_phone_number,
        id_number,
        password_hash,
        role,
        is_verified,
        approval_status,
        account_status,
        is_2fa_enabled,
        created_at,
        updated_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,FALSE,$9,'active',TRUE,NOW(),NOW())
      RETURNING id, first_name, last_name, email, role, is_verified, approval_status`,
      [
        first_name.trim(),
        last_name.trim(),
        normalizedEmail,
        normalizedPhone,
        normalizedAltPhone,
        id_number.trim(),
        hashedPassword,
        role,
        approvalStatus,
      ]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      message: "User registered successfully",
      user: insertedUser.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("registerUser error:", error);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
};

/* STEP 1: LOGIN + SEND OTP */
export const login2FA = async (req, res) => {
  const { role, email, password } = req.body;

  try {
    // =========================
    // VALIDATION
    // =========================
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    // =========================
    // FETCH USER
    // =========================
    const result = await pool.query(
      `SELECT 
         id,
         email,
         password_hash,
         role,
         approval_status,
         is_2fa_enabled,
         is_verified,
         account_status
       FROM users
       WHERE email = $1`,
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }

    const user = result.rows[0];

    // =========================
    // OPTIONAL ROLE CHECK
    // =========================
    if (role && user.role?.toLowerCase() !== role.toLowerCase()) {
      return res.status(403).json({
        error: `This account is registered as ${user.role}, not ${role}`,
      });
    }

    // =========================
    // ACCOUNT STATUS CHECK
    // =========================
    if (user.account_status?.toLowerCase() === "suspended") {
      return res.status(403).json({
        error: "Your account has been suspended",
      });
    }

    // =========================
    // PASSWORD CHECK
    // =========================
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }

    // =========================
    // IF 2FA DISABLED → LOGIN DIRECTLY
    // =========================
    if (!user.is_2fa_enabled) {
      const token = createToken(user);

      return res.status(200).json({
        message: "Login successful",
        requiresOTP: false,
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          approval_status: user.approval_status,
          is_verified: user.is_verified,
        },
      });
    }

    // =========================
    // CHECK IF ACTIVE OTP EXISTS
    // =========================
    const existingOtpResult = await pool.query(
      `SELECT *
       FROM otp_verifications
       WHERE user_id = $1
         AND purpose = 'login_2fa'
         AND is_verified = FALSE
         AND expires_at > NOW()
       ORDER BY created_at DESC
       LIMIT 1`,
      [user.id]
    );

    // =========================
    // OTP ALREADY EXISTS → DO NOT CREATE NEW ONE
    // =========================
    if (existingOtpResult.rows.length > 0) {
      return res.status(200).json({
        message: "OTP already sent to your email",
        requiresOTP: true,
        step: "otp",
        userId: user.id,
        email: user.email,
      });
    }

    // =========================
    // GENERATE NEW OTP
    // =========================
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await pool.query(
      `INSERT INTO otp_verifications (
        user_id,
        email,
        otp_code,
        purpose,
        expires_at,
        attempts,
        is_verified,
        created_at
      )
      VALUES ($1, $2, $3, 'login_2fa', $4, 0, FALSE, NOW())`,
      [user.id, user.email, otp, expiresAt]
    );

    // =========================
    // SEND EMAIL
    // =========================
    await sendOTPEmail(user.email, otp);

    // =========================
    // RETURN OTP STEP RESPONSE
    // =========================
    return res.status(200).json({
      message: "OTP sent to your email",
      requiresOTP: true,
      step: "otp",
      userId: user.id,
      email: user.email,
    });
  } catch (err) {
    console.error("login2FA error:", err);
    return res.status(500).json({
      error: "Server error",
    });
  }
};

/* STEP 2: VERIFY OTP + MARK USER VERIFIED*/
export const verifyOTP = async (req, res) => {
  const { userId, otp } = req.body;

  try {
    if (!userId || !otp) {
      return res.status(400).json({
        error: "User ID and OTP are required",
      });
    }

    // =========================
    // GET LATEST ACTIVE OTP
    // =========================
    const otpResult = await pool.query(
      `SELECT *
       FROM otp_verifications
       WHERE user_id = $1
         AND purpose = 'login_2fa'
         AND is_verified = FALSE
         AND expires_at > NOW()
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId]
    );

    if (otpResult.rows.length === 0) {
      return res.status(400).json({
        error: "Invalid or expired OTP",
      });
    }

    const otpRecord = otpResult.rows[0];

    // =========================
    // ATTEMPT LIMIT CHECK
    // =========================
    if (otpRecord.attempts >= 3) {
      return res.status(429).json({
        error: "Maximum OTP attempts reached. Please request a new OTP.",
      });
    }

    // =========================
    // WRONG OTP
    // =========================
    if (otpRecord.otp_code !== otp.trim()) {
      await pool.query(
        `UPDATE otp_verifications
         SET attempts = attempts + 1
         WHERE id = $1`,
        [otpRecord.id]
      );

      return res.status(400).json({
        error: "Incorrect OTP",
      });
    }

    // =========================
    // MARK OTP VERIFIED
    // =========================
    await pool.query(
      `UPDATE otp_verifications
       SET is_verified = TRUE
       WHERE id = $1`,
      [otpRecord.id]
    );

    // =========================
    // MARK USER VERIFIED
    // =========================
    await pool.query(
      `UPDATE users
       SET is_verified = TRUE,
           updated_at = NOW()
       WHERE id = $1`,
      [userId]
    );

    // =========================
    // FETCH UPDATED USER
    // =========================
    const userResult = await pool.query(
      `SELECT
         id,
         email,
         role,
         approval_status,
         is_verified
       FROM users
       WHERE id = $1`,
      [userId]
    );

    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // =========================
    // ISSUE JWT TOKEN
    // =========================
    const token = createToken(user);

    return res.status(200).json({
      message: "OTP verified successfully",
      token,
      user,
    });
  } catch (err) {
    console.error("verifyOTP error:", err);
    return res.status(500).json({
      error: "Server error",
    });
  }
};

/*RESEND OTP */
export const resendOTP = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const lastOtpResult = await pool.query(
      `SELECT * FROM otp_verifications
       WHERE user_id = $1
         AND purpose = 'login_2fa'
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId]
    );

    if (lastOtpResult.rows.length === 0) {
      return res.status(400).json({ error: "No previous OTP found" });
    }

    const lastOtp = lastOtpResult.rows[0];
    const now = new Date();
    const secondsSinceLastOTP =
      (now.getTime() - new Date(lastOtp.created_at).getTime()) / 1000;

    // cooldown
    if (secondsSinceLastOTP < OTP_RESEND_COOLDOWN) {
      const waitTime = Math.ceil(OTP_RESEND_COOLDOWN - secondsSinceLastOTP);
      return res.status(429).json({
        error: `Please wait ${waitTime} seconds before requesting a new OTP`,
      });
    }

    // if still active and unverified, reuse same OTP
    if (!lastOtp.is_verified && new Date(lastOtp.expires_at) > now) {
      await sendOTPEmail(lastOtp.email, lastOtp.otp_code);
      return res.status(200).json({ message: "OTP resent to your email" });
    }

    // otherwise create new OTP
    const otp = generateOTP();
    const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await pool.query(
      `INSERT INTO otp_verifications (
        user_id, email, otp_code, purpose, expires_at, attempts, is_verified, created_at
      )
      VALUES ($1, $2, $3, 'login_2fa', $4, 0, FALSE, NOW())`,
      [lastOtp.user_id, lastOtp.email, otp, expiresAt]
    );

    await sendOTPEmail(lastOtp.email, otp);

    return res.status(200).json({ message: "New OTP sent to email" });
  } catch (err) {
    console.error("resendOTP error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

/*ADMIN: APPROVE LANDLORD */
export const approveLandlord = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE users
       SET approval_status = 'approved',
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: "Landlord approved successfully",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("approveLandlord error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

/*FORGOT PASSWORD */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: "Email is required" });

    const normalizedEmail = normalizeEmail(email);

    const userResult = await pool.query(
      "SELECT id, email FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = userResult.rows[0].id;

    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "30m",
    });

    await sendResetPasswordEmail(normalizedEmail, token);

    return res.status(200).json({ message: "Reset email sent" });
  } catch (error) {
    console.error("forgotPassword error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


  //  RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    if (!token) return res.status(400).json({ error: "Reset token is required" });
    if (!password) return res.status(400).json({ error: "Password is required" });

    if (!isStrongPassword(password)) {
      return res.status(400).json({ error: passwordValidationMessage });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    await pool.query(
      `UPDATE users
       SET password_hash = $1,
           updated_at = NOW()
       WHERE id = $2`,
      [hashedPassword, decoded.id]
    );

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ error: "Reset link has expired" });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ error: "Invalid reset token" });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
};