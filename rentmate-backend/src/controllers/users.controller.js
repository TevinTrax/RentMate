import pool from "../config/db.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

export const createUserAdmin = async (req, res) => {
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

    // name check
    const nameCheck= await pool.query(
        "SELECT id FROM users WHERE full_name=$1",
        [full_name]
    );

    if (nameCheck.rows.length>0) {
        return res.status(409).json({
            error: "User with this name already exists",
        });
    }

    // 3. Hash password
    const saltRounds = 10; // good default
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Insert user into database
    const result = await pool.query(
      `
      INSERT INTO users
      (full_name, role, email, phone_number, alt_phone_number, id_number, password_hash)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, full_name, email, role
      `,
      [
        full_name,
        role || "user", // default role if missing
        email,
        phone_number,
        alt_phone_number,
        id_number,
        hashedPassword,
      ]
    );

    // 5. Response
    return res.status(201).json({
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



export const createUserLandlord = async(req,res)=>{
    try {
        const {
            full_name,
            email,
            role,
            id_number,
            phone_number,
            alt_phone_number,
            password,
            ref
        } = req.body

        // validation
        if (
            !full_name ||
            !email ||
            !phone_number ||
            !password ||
            !id_number
        ) {
            return res.status(400).json({
                error:"All required fields must be filled"
            });
        }

        // check if email already exists
        const emailCheck = await pool.query(
            "SELECT id FROM users WHERE email=$1",
            [email]
        );
        if (emailCheck.rows.length > 0) {
            return res.status(409).json({
                error:"Email already registered",
            });
        }

        // name check
        const nameCheck = await pool.query(
            "SELECT id FROM users WHERE full_name = $1",
            [full_name]
        );
        if (nameCheck.rows.length>0) {
            return res.status(409).json({
                error: "User with this name already exists",
            });
        }

        // hash password
        const saltRounds= 10;
        const hashedPassword = await bcrypt.hash(password,saltRounds);

        // insert data into db
        const result= await pool.query(
            `INSERT INTO users (full_name, role, email, phone_number, alt_phone_number, id_number, password_hash, reference)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id, full_name, role, email, phone_number`,
            [
                full_name,
                role || "user",
                email,
                phone_number,
                alt_phone_number,
                id_number,
                hashedPassword,
                ref
            ]
        );

        // response
        return res.status(201).json({
            message:"Account created successfully",
            user: result.rows[0],
        });
    } catch (error) {
        console.error("Create user error:", error.message);
        res.status(500).json({
            error:"Internal server error"
        });
    }
};



export const createUserTenant= async(req, res)=>{
    try {
        const{
            full_name,
            role,
            email,
            id_number,
            phone_number,
            alt_phone_number,
            apartment_name,
            house_number,
            password,
            reference
        } = req.body;

        // validation
        if (
            !full_name,
            !email,
            !id_number,
            !phone_number,
            !password
        ) {
            return res.json({
                error:"All required fields must be filled"
            });
        }

        // check if email exists
        const emailCheck= await pool.query(
            "SELECT id FROM users WHERE email=$1",
            [email]
        );
        if (emailCheck.rows.length >0) {
            return res.status(409).json({
                error:"Email already registered",
            });
        }

        // check if username exists
        const nameCheck= await pool.query(
            "SELECT id FROM users WHERE full_name=$1",
            [full_name]
        );

        if (nameCheck.rows.length > 0) {
            return res.json({
                error:"User with this name already exists"
            });
        }

        // hash password
        const saltRounds= 10;
        const hashedPassword= await bcrypt.hash(password, saltRounds);

        // insert data to db
        const result = await pool.query(
            `INSERT INTO users (full_name, role, email, phone_number, alt_phone_number, id_number, password_hash, apartment_name, house_number, reference)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id, full_name, role, email, id_number`,
            [
                full_name,
                role,
                email,
                phone_number,
                alt_phone_number,
                id_number,
                hashedPassword,
                apartment_name,
                house_number,
                reference
            ]
        );
        if (result.ok) {
            return res.status(201).json({
                message:"User created successfully"
            });
        }
    } catch (error) {
        console.error("Create user error:", error.message);
        res.status(500).json({
            error:"Internal server error"
        });
    }
}
