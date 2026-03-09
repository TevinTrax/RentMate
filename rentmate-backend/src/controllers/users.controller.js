import pool from "../config/db.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

// create user from admin
export const registerUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      id_number,
      phone_number,
      alt_phone_number,
      role,
      password
    } = req.body;

    // check required fields
    if (!first_name || !last_name || !email || !role || !password) {
      return res.status(400).json({
        error: "All required fields must be filled"
      });
    }

    const duplicateCheck = await pool.query(
      `
      SELECT email, id_number, phone_number
      FROM users
      WHERE email = $1 OR id_number = $2 OR phone_number = $3
      `,
      [email, id_number, phone_number]
    );

    if (duplicateCheck.rows.length > 0) {
      return res.status(409).json({
        error: "User with this email, ID number, or phone already exists"
      });
    }

    // hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // insert user
    const result = await pool.query(
      `
      INSERT INTO users
      (first_name, last_name, email, id_number, phone_number, alt_phone_number, role, subscription_status, password_hash)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING id, first_name, last_name, email, role
      `,
      [
        first_name,
        last_name,
        email,
        id_number,
        phone_number,
        alt_phone_number,
        role,
        "Trial",
        hashedPassword
      ]
    );

    res.status(201).json({
      message: "User created successfully",
      user: result.rows[0]
    });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/* CREATE ADMIN */
export const createUserAdmin = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      id_number,
      phone_number,
      alt_phone_number,
      password
    } = req.body;

    /* 1. Validation */
    if (!first_name || !last_name || !email || !id_number || !phone_number || !password) {
      return res.status(400).json({
        error: "All required fields must be filled",
      });
    }

    const duplicateCheck = await pool.query(
      `
      SELECT email, id_number, phone_number
      FROM users
      WHERE email = $1 OR id_number = $2 OR phone_number = $3
      `,
      [email, id_number, phone_number]
    );

    if (duplicateCheck.rows.length > 0) {
      return res.status(409).json({
        error: "User with this email, ID number, or phone already exists"
      });
    }

    /* 4. Hash password (saltRounds RESTORED) */
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    /* 5. Insert user */
    const result = await pool.query(
      `
      INSERT INTO users
      (first_name, last_name, role, email, phone_number, alt_phone_number, id_number, password_hash)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, first_name, last_name, email, role
      `,
      [
        first_name,
        last_name,
        "Admin",
        email,
        phone_number,
        alt_phone_number,
        id_number,
        hashedPassword,
      ]
    );

    const admin = result.rows[0];

    /* 6. Generate JWT token for admin */
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "Admin account created successfully",
      user: result.rows[0],
      token,
    });

  } catch (error) {
    console.error("Create admin error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create a new landlord user
export const createUserLandlord = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      id_number,
      phone_number,
      alt_phone_number,
      password,
      ref,
    } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !email || !phone_number || !alt_phone_number || !password || !id_number) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // Check if email already exists
    const emailCheck = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Trial setup: 14 days from now
    const trialStart = new Date();
    const trialEnd = new Date();
    trialEnd.setDate(trialStart.getDate() + 14);

    // Insert landlord into database
    const result = await pool.query(
      `
      INSERT INTO users
      (first_name, last_name, role, email, phone_number, alt_phone_number, id_number, password_hash, reference, subscription_status, trial_start_date, trial_end_date)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING id, first_name, last_name, email, role, subscription_status, trial_end_date
      `,
      [
        first_name,
        last_name,
        "Landlord", // enforce role
        email,
        phone_number,
        alt_phone_number,
        id_number,
        hashedPassword,
        ref || null,
        "Trial",
        trialStart,
        trialEnd,
      ]
    );

    const landlord = result.rows[0];

    // Generate JWT token for landlord
    const token = jwt.sign(
      { id: landlord.id, email: landlord.email, role: landlord.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "Landlord created successfully",
      user: landlord,
      token,
    });

  } catch (error) {
    console.error("Create landlord error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


/* CREATE TENANT */
export const createUserTenant = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      id_number,
      phone_number,
      alt_phone_number,
      apartment_name,
      house_number,
      password,
      reference,
    } = req.body;

    if (!first_name || !last_name || !email || !id_number || !phone_number || !password) {
      return res.status(400).json({
        error: "All required fields must be filled",
      });
    }

    const emailCheck = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Trial setup
    const trialStart = new Date();
    const trialEnd = new Date();
    trialEnd.setDate(trialStart.getDate() + 14);

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await pool.query(
      `
      INSERT INTO users
      (first_name, last_name, role, email, phone_number, alt_phone_number, id_number, password_hash, apartment_name, house_number, reference, subscription_status, trial_start_date, trial_end_date)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING id, first_name, last_name, email, role
      `,
      [
        first_name,
        last_name,
        "Tenant",
        email,
        phone_number,
        alt_phone_number,
        id_number,
        hashedPassword,
        apartment_name,
        house_number,
        reference,
        "Trial",
        trialStart,
        trialEnd
      ]
    );

    const tenant= result.rows[0];

    // Generate JWT token for tenant
    const token = jwt.sign(
      { id: tenant.id, email: tenant.email, role: tenant.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "Tenant created successfully",
      token,
    });

  } catch (error) {
    console.error("Create tenant error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* FETCH USERS */
export const fetchUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT id, first_name, last_name, role, email,
             phone_number, alt_phone_number,
             id_number, apartment_name, house_number,
             reference, is_verified, status, created_at, subscription_status, trial_start_date, trial_end_date
      FROM users
      ORDER BY created_at DESC
      `
    );

    res.json(result.rows);

  } catch (error) {
    console.error("Fetch users error:", error.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // comes from verifyToken middleware

    const result = await pool.query(
      `
      SELECT id, first_name, last_name, email, role
      FROM users
      WHERE id = $1
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error("Profile error:", error.message);

    res.status(500).json({
      error: "Server error: " + error.message
    });
  }
};