import pool from "../config/db.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { syncPropertyOccupancy } from "../utils/propertyOccupancy.js";

dotenv.config();

// Password validation regex: min 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special char
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

// KENYAN VALIDATION HELPERS
// Normalize email
const normalizeEmail = (email) => email?.trim().toLowerCase();

// Kenyan National ID validation (usually 7–8 digits)
const isValidKenyanID = (id) => /^[0-9]{7,8}$/.test(String(id).trim());

// Normalize Kenyan phone to 2547XXXXXXXX or 2541XXXXXXXX
const normalizeKenyanPhone = (phone) => {
  if (!phone) return null;

  let cleaned = String(phone).replace(/\s+/g, "").replace(/-/g, "");

  if (cleaned.startsWith("+254")) {
    cleaned = cleaned.replace("+", "");
  } else if (cleaned.startsWith("0")) {
    cleaned = "254" + cleaned.slice(1);
  }

  return cleaned;
};

// Validate normalized Kenyan phone
const isValidKenyanPhone = (phone) => {
  const normalized = normalizeKenyanPhone(phone);
  return /^(2547\d{8}|2541\d{8})$/.test(normalized);
};

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

    // Normalize values
    const normalizedEmail = normalizeEmail(email);
    const normalizedPhone = normalizeKenyanPhone(phone_number);
    const normalizedAltPhone = alt_phone_number
      ? normalizeKenyanPhone(alt_phone_number)
      : null;
    const normalizedID = id_number ? String(id_number).trim() : null;
    const normalizedRole = role?.trim().toLowerCase();

    // Check required fields
    if (!first_name || !last_name || !email || !role || !password) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    // Validate allowed roles
    const allowedRoles = ["admin", "landlord", "tenant"];
    if (!allowedRoles.includes(normalizedRole)) {
      return res.status(400).json({
        error: "Invalid role selected"
      });
    }

    // Validate Kenyan ID if provided
    if (normalizedID && !isValidKenyanID(normalizedID)) {
      return res.status(400).json({
        error: "Enter a valid Kenyan ID number (7 to 8 digits)"
      });
    }

    // Validate primary Kenyan phone if provided
    if (phone_number && !isValidKenyanPhone(phone_number)) {
      return res.status(400).json({
        error: "Enter a valid Kenyan phone number"
      });
    }

    // Validate alternative Kenyan phone if provided
    if (alt_phone_number && !isValidKenyanPhone(alt_phone_number)) {
      return res.status(400).json({
        error: "Enter a valid alternative Kenyan phone number"
      });
    }

    // Validate password strength
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
      });
    }

    // Check duplicates
    const duplicateCheck = await pool.query(
      `
      SELECT email, id_number, phone_number
      FROM users
      WHERE email = $1 OR id_number = $2 OR phone_number = $3
      `,
      [normalizedEmail, normalizedID, normalizedPhone]
    );

    if (duplicateCheck.rows.length > 0) {
      return res.status(409).json({
        error: "User with this email, ID number, or phone already exists"
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Only admins are auto-approved
    const approvalStatus = normalizedRole === "admin" ? "Approved" : "Pending";

    // Optional: only landlords get trial subscription
    const subscriptionStatus = normalizedRole === "landlord" ? "Trial" : null;

    // Insert user
    const result = await pool.query(
      `
      INSERT INTO users
      (
        first_name,
        last_name,
        email,
        id_number,
        phone_number,
        alt_phone_number,
        role,
        subscription_status,
        password_hash,
        approval_status
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING id, first_name, last_name, email, role, approval_status
      `,
      [
        first_name.trim(),
        last_name.trim(),
        normalizedEmail,
        normalizedID,
        normalizedPhone,
        normalizedAltPhone || null,
        normalizedRole.charAt(0).toUpperCase() + normalizedRole.slice(1),
        subscriptionStatus,
        hashedPassword,
        approvalStatus
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

    // Normalize values
    const normalizedEmail = normalizeEmail(email);
    const normalizedPhone = normalizeKenyanPhone(phone_number);
    const normalizedAltPhone = alt_phone_number
      ? normalizeKenyanPhone(alt_phone_number)
      : null;
    const normalizedID = id_number ? String(id_number).trim() : null;

    /* Required fields validation */
    if (!first_name || !last_name || !email || !id_number || !phone_number || !password) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    /* Kenyan ID validation */
    if (!isValidKenyanID(normalizedID)) {
      return res.status(400).json({
        error: "Enter a valid Kenyan ID number (7 to 8 digits)"
      });
    }

    /* Kenyan phone validation */
    if (!isValidKenyanPhone(phone_number)) {
      return res.status(400).json({
        error: "Enter a valid Kenyan phone number"
      });
    }

    if (alt_phone_number && !isValidKenyanPhone(alt_phone_number)) {
      return res.status(400).json({
        error: "Enter a valid alternative Kenyan phone number"
      });
    }

    /*Password strength validation */
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
      });
    }

    /*Duplicate check */
    const duplicateCheck = await pool.query(
      `SELECT email, id_number, phone_number FROM users WHERE email=$1 OR id_number=$2 OR phone_number=$3`,
      [normalizedEmail, normalizedID, normalizedPhone]
    );

    if (duplicateCheck.rows.length > 0) {
      return res.status(409).json({
        error: "User with this email, ID number, or phone already exists"
      });
    }

    /*Hash password */
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    /*Insert user */
    const result = await pool.query(
      `
      INSERT INTO users
      (first_name, last_name, role, email, phone_number, alt_phone_number, id_number, password_hash, approval_status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING id, first_name, last_name, email, role, approval_status
      `,
      [
        first_name.trim(),
        last_name.trim(),
        "Admin",
        normalizedEmail,
        normalizedPhone,
        normalizedAltPhone || null,
        normalizedID,
        hashedPassword,
        "Approved" // Admins can be auto-approved
      ]
    );

    const admin = result.rows[0];

    /*Generate JWT token for admin */
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "Admin account created successfully",
      user: admin,
      token
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

    // Normalize values
    const normalizedEmail = normalizeEmail(email);
    const normalizedPhone = normalizeKenyanPhone(phone_number);
    const normalizedAltPhone = alt_phone_number
      ? normalizeKenyanPhone(alt_phone_number)
      : null;
    const normalizedID = id_number ? String(id_number).trim() : null;

    // Validate required fields
    if (!first_name || !last_name || !email || !phone_number || !password || !id_number) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    // Kenyan ID validation
    if (!isValidKenyanID(normalizedID)) {
      return res.status(400).json({
        error: "Enter a valid Kenyan ID number (7 to 8 digits)"
      });
    }

    // Kenyan phone validation
    if (!isValidKenyanPhone(phone_number)) {
      return res.status(400).json({
        error: "Enter a valid Kenyan phone number"
      });
    }

    if (alt_phone_number && !isValidKenyanPhone(alt_phone_number)) {
      return res.status(400).json({
        error: "Enter a valid alternative Kenyan phone number"
      });
    }

    // Password validation (enforce frontend rules)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters, include letters, numbers, and special characters",
      });
    }

    // Check if email already exists
    const emailCheck = await pool.query("SELECT id FROM users WHERE email = $1", [normalizedEmail]);
    if (emailCheck.rows.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Check if ID already exists
    const idCheck = await pool.query("SELECT id FROM users WHERE id_number = $1", [normalizedID]);
    if (idCheck.rows.length > 0) {
      return res.status(409).json({ error: "ID number already registered" });
    }

    // Check if phone already exists
    const phoneCheck = await pool.query("SELECT id FROM users WHERE phone_number = $1", [normalizedPhone]);
    if (phoneCheck.rows.length > 0) {
      return res.status(409).json({ error: "Phone number already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Trial setup: 14 days from now
    const trialStart = new Date();
    const trialEnd = new Date(trialStart);
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
        first_name.trim(),
        last_name.trim(),
        "Landlord",
        normalizedEmail,
        normalizedPhone,
        normalizedAltPhone || null,
        normalizedID,
        hashedPassword,
        ref || null,
        "Trial",
        trialStart,
        trialEnd,
      ]
    );

    const landlord = result.rows[0];

    // Generate JWT token
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
    return res.status(500).json({ error: "Internal server error" });
  }
};

// CREATE TENANT
export const createUserTenant = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      first_name,
      last_name,
      email,
      id_number,
      phone_number,
      alt_phone_number,
      apartment_id,
      unit_id,
      password,
      reference,
    } = req.body;

    // Normalize values
    const normalizedEmail = normalizeEmail(email);
    const normalizedPhone = normalizeKenyanPhone(phone_number);
    const normalizedAltPhone = alt_phone_number
      ? normalizeKenyanPhone(alt_phone_number)
      : null;
    const normalizedID = id_number ? String(id_number).trim() : null;

    // Validate required fields
    if (
      !first_name ||
      !last_name ||
      !email ||
      !id_number ||
      !phone_number ||
      !password ||
      !apartment_id ||
      !unit_id
    ) {
      return res.status(400).json({
        success: false,
        error: "All required fields must be filled, including apartment and unit",
      });
    }

    // Kenyan ID validation
    if (!isValidKenyanID(normalizedID)) {
      return res.status(400).json({
        success: false,
        error: "Enter a valid Kenyan ID number (7 to 8 digits)",
      });
    }

    // Kenyan phone validation
    if (!isValidKenyanPhone(phone_number)) {
      return res.status(400).json({
        success: false,
        error: "Enter a valid Kenyan phone number",
      });
    }

    if (alt_phone_number && !isValidKenyanPhone(alt_phone_number)) {
      return res.status(400).json({
        success: false,
        error: "Enter a valid alternative Kenyan phone number",
      });
    }

    // PASSWORD VALIDATION
    const validatePassword = (password) => {
      if (password.length < 8) return "Password must be at least 8 characters long";
      if (!/[A-Z]/.test(password)) return "Password must include at least one uppercase letter";
      if (!/[a-z]/.test(password)) return "Password must include at least one lowercase letter";
      if (!/\d/.test(password)) return "Password must include at least one number";
      if (!/[\W_]/.test(password)) return "Password must include at least one special character";
      return "";
    };

    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({ success: false, error: passwordError });
    }

    await client.query("BEGIN");

    // Check if email already exists
    const emailCheck = await client.query(
      "SELECT id FROM users WHERE LOWER(email) = LOWER($1)",
      [normalizedEmail]
    );

    if (emailCheck.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        success: false,
        error: "Email already registered",
      });
    }

    // Check if ID number already exists
    const idCheck = await client.query(
      "SELECT id FROM users WHERE id_number = $1",
      [normalizedID]
    );

    if (idCheck.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        success: false,
        error: "ID number already registered",
      });
    }

    // Check if phone number already exists
    const phoneCheck = await client.query(
      "SELECT id FROM users WHERE phone_number = $1",
      [normalizedPhone]
    );

    if (phoneCheck.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        success: false,
        error: "Phone number already registered",
      });
    }

    // Verify apartment exists and is available
    const propertyQuery = await client.query(
      `SELECT id, landlord_id, status, property_status, vacant_units
       FROM properties
       WHERE id = $1`,
      [apartment_id]
    );

    if (propertyQuery.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        error: "Apartment not found",
      });
    }

    const property = propertyQuery.rows[0];

    // Ensure property is visible/usable
    if (property.status !== "Added") {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        error: "This apartment is not currently available",
      });
    }

    if (property.property_status !== "Vacant") {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        error: "This apartment is not vacant",
      });
    }

    // Verify unit exists, belongs to apartment, and is vacant
    const unitQuery = await client.query(
      `SELECT id, house_number, is_occupied
       FROM units
       WHERE id = $1 AND property_id = $2`,
      [unit_id, apartment_id]
    );

    if (unitQuery.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        error: "Unit not found in this apartment",
      });
    }

    const unit = unitQuery.rows[0];

    if (unit.is_occupied) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        error: "This unit is already occupied",
      });
    }

    // Prevent duplicate pending/approved request for same unit
    const existingTenantForUnit = await client.query(
      `SELECT id, tenant_approval_status
       FROM users
       WHERE unit_id = $1
         AND role = 'Tenant'
         AND tenant_approval_status IN ('pending', 'approved')`,
      [unit_id]
    );

    if (existingTenantForUnit.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        error: "This unit already has a pending or approved tenant request",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert tenant request
    const result = await client.query(
      `INSERT INTO users (
        first_name,
        last_name,
        role,
        email,
        phone_number,
        alt_phone_number,
        id_number,
        password_hash,
        property_id,
        landlord_id,
        unit_id,
        tenant_approval_status,
        reference
      )
      VALUES (
        $1, $2, 'Tenant', $3, $4, $5, $6, $7, $8, $9, $10, 'pending', $11
      )
      RETURNING 
        id,
        first_name,
        last_name,
        email,
        role,
        property_id,
        landlord_id,
        unit_id,
        tenant_approval_status`,
      [
        first_name.trim(),
        last_name.trim(),
        normalizedEmail,
        normalizedPhone,
        normalizedAltPhone || null,
        normalizedID,
        hashedPassword,
        apartment_id,
        property.landlord_id,
        unit_id,
        reference?.trim() || null,
      ]
    );

    const tenant = result.rows[0];

    await client.query("COMMIT");

    // JWT
    const token = jwt.sign(
      {
        id: tenant.id,
        role: tenant.role,
        property_id: tenant.property_id,
        landlord_id: tenant.landlord_id,
        unit_id: tenant.unit_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "Tenant registered successfully. Waiting for landlord approval.",
      tenant,
      token,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Create tenant error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  } finally {
    client.release();
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
             reference, is_verified, account_status, created_at, subscription_status, trial_start_date, trial_end_date, approval_status
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
      SELECT id, first_name, last_name, email, role, approval_status, phone_number, alt_phone_number, id_number, apartment_name, house_number, reference, subscription_status, trial_start_date, trial_end_date
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

// Admin can update user details (including approval_status and account_status)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      first_name,
      last_name,
      phone_number,
      alt_phone_number,
      role,
      account_status
    } = req.body;

    const result = await pool.query(
      `
      UPDATE users
      SET first_name=$1,
          last_name=$2,
          phone_number=$3,
          alt_phone_number=$4,
          role=$5,
          account_status=$6
      WHERE id=$7
      RETURNING *
      `,
      [
        first_name,
        last_name,
        phone_number,
        alt_phone_number,
        role,
        account_status,
        id
      ]
    );

    res.json({
      message: "User updated successfully",
      user: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// APPROVE TENANT
export const approveTenant = async (req, res) => {
  try {
    const { tenant_id } = req.params;
    const landlord_id = req.user.id; // assuming JWT middleware sets req.user

    // Get tenant and their unit
    const tenantQuery = await pool.query(
      `SELECT id, unit_id, property_id, tenant_approval_status 
       FROM users 
       WHERE id = $1 AND landlord_id = $2`,
      [tenant_id, landlord_id]
    );

    if (tenantQuery.rows.length === 0) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    const tenant = tenantQuery.rows[0];

    if (tenant.tenant_approval_status === "approved") {
      return res.status(400).json({ error: "Tenant already approved" });
    }

    // Update tenant approval
    await pool.query(
      `UPDATE users 
       SET tenant_approval_status = 'approved' 
       WHERE id = $1`,
      [tenant_id]
    );

    // Update unit occupancy
    await pool.query(
      `UPDATE units 
       SET is_occupied = TRUE 
       WHERE id = $1`,
      [tenant.unit_id]
    );

    return res.status(200).json({
      message: "Tenant approved successfully and unit marked as occupied",
    });

  } catch (error) {
    console.error("Approve tenant error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch pending tenants for a landlord
export const getPendingTenants = async (req, res) => {
  try {
    const landlordId = req.user?.id;

    if (!landlordId || req.user.role !== "Landlord") {
      return res.status(403).json({ error: "Access denied" });
    }

    const result = await pool.query(
      `SELECT u.id, u.first_name, u.last_name, u.email, u.phone_number,  u.id_number,
              u.property_id, u.unit_id, u.tenant_approval_status,
              un.house_number AS unit_house_number, p.apartment_name
       FROM users u
       JOIN units un ON u.unit_id = un.id
       JOIN properties p ON u.property_id = p.id
       WHERE u.role = 'Tenant'
         AND u.landlord_id = $1
         AND u.tenant_approval_status = 'pending'
       ORDER BY u.created_at DESC`,
      [landlordId]
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      tenants: result.rows,
    });
  } catch (error) {
    console.error("Error fetching pending tenants:", error);
    res.status(500).json({ error: "Server error: " + error.message });
  }
};

// GET ALL TENANTS FOR LOGGED-IN LANDLORD + STATS
export const getLandlordTenants = async (req, res) => {
  try {
    const landlordId = req.user?.id;
    const userRole = req.user?.role;

    if (!landlordId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized. No landlord ID found.",
      });
    }

    // Allow both "Landlord" and "landlord"
    if (!["Landlord", "landlord"].includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    const result = await pool.query(
      `
      SELECT
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.id_number,
        u.phone_number,
        u.alt_phone_number,
        u.role,
        u.is_verified,
        u.tenant_approval_status,
        u.created_at,
        u.property_id,
        u.unit_id,
        u.landlord_id,

        p.apartment_name,
        p.id AS apartment_id,
        p.property_type,
        p.city,
        p.area,
        p.monthly_rent,

        un.house_number AS unit_house_number,
        un.is_occupied

      FROM users u
      LEFT JOIN properties p ON u.property_id = p.id
      LEFT JOIN units un ON u.unit_id = un.id

      WHERE 
        LOWER(u.role) = 'tenant'
        AND u.landlord_id = $1

      ORDER BY 
        CASE 
          WHEN LOWER(u.tenant_approval_status) = 'pending' THEN 1
          WHEN LOWER(u.tenant_approval_status) = 'approved' THEN 2
          WHEN LOWER(u.tenant_approval_status) = 'rejected' THEN 3
          ELSE 4
        END,
        u.created_at DESC
      `,
      [landlordId]
    );

    const tenants = result.rows || [];

    // Calculate stats
    const approvedCount = tenants.filter(
      (t) => (t.tenant_approval_status || "").toLowerCase() === "approved"
    ).length;

    const pendingCount = tenants.filter(
      (t) => (t.tenant_approval_status || "").toLowerCase() === "pending"
    ).length;

    const rejectedCount = tenants.filter(
      (t) => (t.tenant_approval_status || "").toLowerCase() === "rejected"
    ).length;

    return res.status(200).json({
      success: true,
      count: tenants.length,
      approvedCount,
      pendingCount,
      rejectedCount,
      tenants,
    });
  } catch (error) {
    console.error("Error fetching landlord tenants:", error);
    return res.status(500).json({
      success: false,
      error: "Server error while fetching landlord tenants",
      details: error.message,
    });
  }
};

// APPROVE / REJECT TENANT REQUEST
export const updateTenantApprovalStatus = async (req, res) => {
  const client = await pool.connect();

  try {
    const user = req.user; // logged-in user
    const { tenantId } = req.params;
    const { tenant_approval_status } = req.body;

    // Validate role
    if (!user || !["landlord", "admin"].includes(user.role)) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    // Validate tenant_approval_status
    if (!["approved", "rejected"].includes(tenant_approval_status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid tenant approval status",
      });
    }

    await client.query("BEGIN");

    // Fetch tenant + property info
    const tenantResult = await client.query(
      `
      SELECT 
        u.id,
        u.property_id,
        u.unit_id,
        u.tenant_approval_status,
        p.landlord_id
      FROM users u
      LEFT JOIN properties p ON u.property_id = p.id
      WHERE u.id = $1 AND u.role = 'Tenant'
      `,
      [tenantId]
    );

    if (tenantResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ success: false, error: "Tenant not found" });
    }

    const tenant = tenantResult.rows[0];

    //Landlord can only manage their own properties
    if (user.role === "Landlord" && tenant.landlord_id !== user.id) {
      await client.query("ROLLBACK");
      return res.status(403).json({
        success: false,
        error: "You can only manage tenants for your own properties",
      });
    }

    //Update tenant status
    const updatedTenantResult = await client.query(
      `
      UPDATE users
      SET tenant_approval_status = $1
      WHERE id = $2
      RETURNING *
      `,
      [tenant_approval_status, tenantId]
    );

    // Handle unit occupancy
    if (tenant.unit_id) {
      if (tenant_approval_status === "approved") {
        // Check if unit already occupied
        const unitCheck = await client.query(
          `SELECT is_occupied FROM units WHERE id = $1`,
          [tenant.unit_id]
        );
        if (unitCheck.rows.length > 0 && unitCheck.rows[0].is_occupied) {
          await client.query("ROLLBACK");
          return res.status(400).json({
            success: false,
            error: "This unit is already occupied",
          });
        }

        // Mark unit as occupied
        await client.query(
          `UPDATE units SET is_occupied = true WHERE id = $1`,
          [tenant.unit_id]
        );

        // Reduce vacant units in property
        await client.query(
          `UPDATE properties SET vacant_units = GREATEST(vacant_units - 1, 0), updated_at = NOW() WHERE id = $1`,
          [tenant.property_id]
        );
      }

      if (tenant_approval_status === "rejected") {
        // Ensure unit is not occupied
        await client.query(
          `UPDATE units SET is_occupied = false WHERE id = $1`,
          [tenant.unit_id]
        );
      }
    }

    // Fetch updated tenant info for frontend
    const finalTenant = await client.query(
      `
      SELECT
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone_number,
        u.alt_phone_number,
        u.role,
        u.is_verified,
        u.tenant_approval_status,
        u.created_at,
        u.property_id,
        u.unit_id,
        p.apartment_name,
        un.house_number AS unit_house_number,
        un.is_occupied
      FROM users u
      LEFT JOIN properties p ON u.property_id = p.id
      LEFT JOIN units un ON u.unit_id = un.id
      WHERE u.id = $1
      `,
      [tenantId]
    );

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: `Tenant ${tenant_approval_status} successfully`,
      tenant: finalTenant.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating tenant approval status:", error);
    return res.status(500).json({
      success: false,
      error: "Server error: " + error.message,
    });
  } finally {
    client.release();
  }
};

// GET APPROVED TENANT DASHBOARD DATA
export const getApprovedTenant = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1) FETCH TENANT + PROPERTY + UNIT + LANDLORD DETAILS
    const tenantQuery = `
      SELECT 
        u.id AS tenant_id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone_number,
        u.role,
        u.tenant_approval_status,
        u.approval_status,
        u.property_id,
        u.unit_id,
        u.landlord_id,
        u.house_number AS user_house_number,
        u.apartment_name AS user_apartment_name,

        -- Property details
        p.apartment_name AS property_name,
        p.property_type,
        p.country,
        p.city,
        p.area,
        p.street_address,
        p.postal_code,
        p.monthly_rent,
        p.security_deposit,
        p.bedrooms,
        p.bathrooms,
        p.size_sqft,
        p.has_pool,
        p.has_parking,
        p.has_gym,
        p.wifi,
        p.security,
        p.furnished,
        p.image_url,
        p.rent_due_day,
        p.rent_due_type,
        p.rent_cycle,
        p.landlord_id AS property_landlord_id,
        p.property_status,

        -- Unit details
        un.house_number AS unit_house_number,
        un.is_occupied,

        -- Landlord details (owner who approved tenant)
        l.first_name AS landlord_first_name,
        l.last_name AS landlord_last_name,
        l.email AS landlord_email,
        l.phone_number AS landlord_phone_number

      FROM users u
      LEFT JOIN properties p ON u.property_id = p.id
      LEFT JOIN units un ON u.unit_id = un.id
      LEFT JOIN users l ON p.landlord_id = l.id
      WHERE u.id = $1
        AND LOWER(u.role) = 'tenant'
      LIMIT 1
    `;

    const tenantResult = await pool.query(tenantQuery, [userId]);

    if (tenantResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
    }

    const t = tenantResult.rows[0];

    // 2) FETCH LATEST RENT/DEPOSIT PAYMENT RECORDS
    const latestPaymentsQuery = `
      SELECT *
      FROM payments
      WHERE user_id = $1
        AND (
          property_id = $2
          OR $2 IS NULL
        )
      ORDER BY COALESCE(paid_at, created_at) DESC
    `;

    const paymentsResult = await pool.query(latestPaymentsQuery, [
      userId,
      t.property_id,
    ]);

    const allPayments = paymentsResult.rows || [];

    // Only rent-related payments
    const rentPayments = allPayments.filter(
      (p) => p.payment_type === "rent"
    );

    const depositPayments = allPayments.filter(
      (p) => p.payment_type === "deposit"
    );

    // Latest paid rent
    const latestPaidRent = rentPayments.find((p) =>
      ["paid", "partial"].includes((p.status || "").toLowerCase())
    );

    // Latest deposit
    const latestDeposit = depositPayments.find((p) =>
      ["paid", "partial"].includes((p.status || "").toLowerCase())
    );

    // 3) FIND NEXT UPCOMING RENT PAYMENT
    const today = new Date();

    const upcomingRentPayments = rentPayments
      .filter((p) => p.due_date)
      .filter((p) => new Date(p.due_date) >= new Date(today.toDateString()))
      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

    const nextRentPayment = upcomingRentPayments[0] || null;

    // 4) FIND CURRENT / MOST RECENT RENT RECORD
    const sortedRentPayments = [...rentPayments].sort((a, b) => {
      const dateA = new Date(a.due_date || a.created_at);
      const dateB = new Date(b.due_date || b.created_at);
      return dateB - dateA;
    });

    const currentRentRecord = nextRentPayment || sortedRentPayments[0] || null;

    // 5) CALCULATE NEXT RENT DUE
    let nextRentDue = null;
    let daysRemaining = null;

    if (nextRentPayment?.due_date) {
      nextRentDue = nextRentPayment.due_date;

      const due = new Date(nextRentPayment.due_date);
      const diffMs = due.setHours(0, 0, 0, 0) - new Date(today.setHours(0, 0, 0, 0));
      daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    } else if (t.rent_due_day) {
      const currentDate = new Date();
      let dueDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        t.rent_due_day
      );

      // If due date already passed this month, move to next month
      if (dueDate < currentDate) {
        dueDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          t.rent_due_day
        );
      }

      nextRentDue = dueDate.toISOString().split("T")[0];

      const diffMs = dueDate.setHours(0, 0, 0, 0) - new Date(currentDate.setHours(0, 0, 0, 0));
      daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    }

    // 6) CALCULATE OUTSTANDING BALANCE
    let outstandingBalance = 0;

    if (currentRentRecord) {
      const expectedAmount = Number(currentRentRecord.expected_amount || 0);
      const paidAmount = Number(currentRentRecord.amount || 0);

      if ((currentRentRecord.status || "").toLowerCase() === "partial") {
        outstandingBalance = Math.max(expectedAmount - paidAmount, 0);
      } else if ((currentRentRecord.status || "").toLowerCase() === "pending") {
        outstandingBalance = expectedAmount || Number(t.monthly_rent || 0);
      } else if ((currentRentRecord.status || "").toLowerCase() === "failed") {
        outstandingBalance = expectedAmount || Number(t.monthly_rent || 0);
      } else {
        outstandingBalance = Number(currentRentRecord.balance_after_payment || 0);
      }
    } else {
      outstandingBalance = Number(t.monthly_rent || 0);
    }

    // 7) LAST PAYMENT DATE
    const lastSuccessfulPayment = allPayments.find((p) =>
      ["paid", "partial"].includes((p.status || "").toLowerCase())
    );

    const lastPaymentDate = lastSuccessfulPayment
      ? (
          lastSuccessfulPayment.paid_at ||
          lastSuccessfulPayment.created_at
        )
          ?.toISOString?.()
          ?.split("T")[0] ||
        new Date(
          lastSuccessfulPayment.paid_at || lastSuccessfulPayment.created_at
        )
          .toISOString()
          .split("T")[0]
      : null;

    // 8) LEASE DATES
    const leaseStartDate =
      latestPaidRent?.lease_start_date ||
      latestDeposit?.lease_start_date ||
      null;

    const leaseEndDate =
      latestPaidRent?.lease_end_date ||
      latestDeposit?.lease_end_date ||
      null;

    // 9) PAYMENT STATS SUMMARY
    const totalPaid = allPayments
      .filter((p) => (p.status || "").toLowerCase() === "paid")
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    const totalPending = allPayments
      .filter((p) => (p.status || "").toLowerCase() === "pending")
      .reduce((sum, p) => sum + Number(p.expected_amount || p.amount || 0), 0);

    const totalPartialBalance = allPayments
      .filter((p) => (p.status || "").toLowerCase() === "partial")
      .reduce((sum, p) => {
        const expected = Number(p.expected_amount || 0);
        const paid = Number(p.amount || 0);
        return sum + Math.max(expected - paid, 0);
      }, 0);

    // 10) RECENT PAYMENTS FOR FRONTEND HISTORY
    const recentPayments = allPayments.slice(0, 5).map((p) => ({
      id: p.id,
      payment_type: p.payment_type,
      amount: Number(p.amount || 0),
      expected_amount: Number(p.expected_amount || 0),
      balance_after_payment: Number(p.balance_after_payment || 0),
      method: p.method,
      status: p.status,
      due_date: p.due_date,
      paid_at: p.paid_at,
      transaction_id: p.transaction_id,
      payment_month: p.payment_month,
      payment_year: p.payment_year,
      notes: p.notes,
    }));

    // 11) BUILD FINAL TENANT OBJECT
    const tenant = {
      // Basic Tenant Info
      id: t.tenant_id,
      first_name: t.first_name || "Tenant",
      last_name: t.last_name || "",
      email: t.email || "",
      phone_number: t.phone_number || "",
      role: t.role || "tenant",
      tenant_approval_status: t.tenant_approval_status || "pending",
      approval_status: t.approval_status || "pending",

      // Assignment Info
      property_id: t.property_id,
      unit_id: t.unit_id,
      landlord_id: t.property_landlord_id || t.landlord_id,

      // Property Info
      apartment_name: t.user_apartment_name || t.property_name || "Unknown",
      property_name: t.property_name || "Unknown",
      house_number: t.unit_house_number || t.user_house_number || "Unknown",
      property_type: t.property_type || "",
      address: [
        t.country,
        t.city,
        t.area,
        t.street_address,
        t.postal_code,
      ]
        .filter(Boolean)
        .join(", "),

      // Landlord Info (owner)
      landlord_name: `${t.landlord_first_name || ""} ${t.landlord_last_name || ""}`.trim(),
      landlord_first_name: t.landlord_first_name || "",
      landlord_last_name: t.landlord_last_name || "",
      landlord_email: t.landlord_email || "",
      landlord_phone_number: t.landlord_phone_number || "",

      // Property Extra Details
      monthly_rent: Number(t.monthly_rent || 0),
      security_deposit: Number(t.security_deposit || 0),
      bedrooms: Number(t.bedrooms || 0),
      bathrooms: Number(t.bathrooms || 0),
      size_sqft: Number(t.size_sqft || 0),
      has_pool: Boolean(t.has_pool),
      has_parking: Boolean(t.has_parking),
      has_gym: Boolean(t.has_gym),
      wifi: Boolean(t.wifi),
      security: Boolean(t.security),
      furnished: Boolean(t.furnished),
      image_url: t.image_url || "",
      rent_due_day: Number(t.rent_due_day || 1),
      rent_due_type: t.rent_due_type || "ON_OR_BEFORE",
      rent_cycle: t.rent_cycle || "MONTHLY",
      property_status: t.property_status || "Vacant",
      is_occupied: Boolean(t.is_occupied),

      // Rent / Lease / Payment Info
      next_rent_due: nextRentDue,
      days_remaining: daysRemaining,
      outstanding_balance: outstandingBalance,
      lease_start_date: leaseStartDate,
      lease_end_date: leaseEndDate,
      last_payment_date: lastPaymentDate,

      // Payment Summary
      total_paid: totalPaid,
      total_pending: totalPending,
      total_partial_balance: totalPartialBalance,

      // Recent payments
      recent_payments: recentPayments,
    };

    return res.status(200).json({
      success: true,
      tenant,
    });
  } catch (error) {
    console.error("Error fetching approved tenant:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching tenant data",
      error: error.message,
    });
  }
};

// delete user
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {
    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    await client.query("BEGIN");

    const userCheck = await client.query(
      `
      SELECT id, role, property_id, unit_id, landlord_id, tenant_approval_status
      FROM users
      WHERE id = $1
      `,
      [id]
    );

    if (userCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "User not found" });
    }

    const user = userCheck.rows[0];

    // If deleting approved tenant, free the unit
    if (
      String(user.role).toLowerCase() === "tenant" &&
      user.unit_id &&
      String(user.tenant_approval_status || "").toLowerCase() === "approved"
    ) {
      await client.query(
        `UPDATE units SET is_occupied = false WHERE id = $1`,
        [user.unit_id]
      );

      if (user.property_id) {
        await syncPropertyOccupancy(client, user.property_id);
      }
    }

    await client.query("DELETE FROM otp_verifications WHERE user_id = $1", [id]);
    await client.query("DELETE FROM users WHERE id = $1", [id]);

    await client.query("COMMIT");

    const io = req.app.get("io");
    if (io && user.landlord_id) {
      io.to(`landlord_${user.landlord_id}`).emit("tenant_updated");
      io.to(`landlord_${user.landlord_id}`).emit("dashboard_refresh", {
        source: "tenant_deleted",
      });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Delete user error:", error);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
};

// LANDLORD DASHBOARD - OCCUPANCY OVERVIEW + PROPERTY BREAKDOWN
export const getLandlordOccupancyOverview = async (req, res) => {
  try {
    const landlordId = req.user.id;

    const summaryResult = await pool.query(
      `
      SELECT
        COUNT(u.id)::int AS total_units,
        COUNT(u.id) FILTER (WHERE u.is_occupied = true)::int AS occupied_units,
        COUNT(u.id) FILTER (WHERE COALESCE(u.is_occupied, false) = false)::int AS vacant_units
      FROM units u
      INNER JOIN properties p ON u.property_id = p.id
      WHERE p.landlord_id = $1
      `,
      [landlordId]
    );

    const row = summaryResult.rows[0] || {};
    const totalUnits = Number(row.total_units || 0);
    const occupiedUnits = Number(row.occupied_units || 0);
    const vacantUnits = Number(row.vacant_units || 0);

    const occupancyRate =
      totalUnits > 0
        ? Number(((occupiedUnits / totalUnits) * 100).toFixed(1))
        : 0;

    const propertyBreakdown = await pool.query(
      `
      SELECT
        p.id,
        p.apartment_name AS property,
        COUNT(u.id)::int AS total_units,
        COUNT(u.id) FILTER (WHERE u.is_occupied = true)::int AS occupied,
        COUNT(u.id) FILTER (WHERE COALESCE(u.is_occupied, false) = false)::int AS vacant
      FROM properties p
      LEFT JOIN units u ON u.property_id = p.id
      WHERE p.landlord_id = $1
      GROUP BY p.id, p.apartment_name
      ORDER BY p.created_at DESC
      `,
      [landlordId]
    );

    const expiringSoonResult = await pool.query(
      `
      SELECT COUNT(*)::int AS expiring_soon
      FROM leases l
      INNER JOIN properties p ON l.property_id = p.id
      WHERE p.landlord_id = $1
        AND l.status = 'active'
        AND l.move_out_date IS NOT NULL
        AND l.move_out_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
      `,
      [landlordId]
    );

    const activeLeasesResult = await pool.query(
      `
      SELECT COUNT(*)::int AS active_leases
      FROM leases l
      INNER JOIN properties p ON l.property_id = p.id
      WHERE p.landlord_id = $1
        AND l.status = 'active'
        AND (l.move_out_date IS NULL OR l.move_out_date >= CURRENT_DATE)
      `,
      [landlordId]
    );

    return res.status(200).json({
      success: true,
      occupancyRate,
      activeLeases: Number(activeLeasesResult.rows[0]?.active_leases || 0),
      vacantUnits,
      occupiedUnits,
      totalUnits,
      expiringSoon: Number(expiringSoonResult.rows[0]?.expiring_soon || 0),
      leaseTrend: 0,
      occupancyTrend: 0,
      propertyOccupancyBreakdown: propertyBreakdown.rows || [],
    });
  } catch (error) {
    console.error("Occupancy overview error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch occupancy overview",
    });
  }
};