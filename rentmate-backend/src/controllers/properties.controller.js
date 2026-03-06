import pool from "../config/db.js";

// addProperty controller
export const addProperty = async (req, res) => {
  try {
    // Make sure the user is logged in (landlord_id comes from verifyToken middleware)
    const landlordId = req.user?.id;
    if (!landlordId) {
      return res.status(401).json({ error: "Unauthorized: landlord not found" });
    }

    // Handle uploaded files
    const imagePath = req.files?.image_url ? req.files.image_url[0].filename : null;
    const documentPath = req.files?.documents ? req.files.documents[0].filename : null;

    // Extract form data
    const {
      apartment_name,
      property_type,
      first_name,
      last_name,
      country,
      city,
      area,
      street_address,
      postal_code,
      latitude,
      longitude,
      monthly_rent,
      security_deposit,
      rent_due_day,
      rent_due_type
    } = req.body;

    // Convert numeric fields to proper types
    const lat = latitude ? parseFloat(latitude) : null;
    const lng = longitude ? parseFloat(longitude) : null;
    const rent = monthly_rent ? parseFloat(monthly_rent) : null;
    const deposit = security_deposit ? parseFloat(security_deposit) : null;
    const dueDay = rent_due_day ? parseInt(rent_due_day, 10) : null;

    // Insert into DB
    const result = await pool.query(
      `
      INSERT INTO properties (
        landlord_id,
        apartment_name,
        property_type,
        manager_first_name,
        manager_last_name,
        country,
        city,
        area,
        street_address,
        postal_code,
        latitude,
        longitude,
        monthly_rent,
        security_deposit,
        rent_due_day,
        rent_due_type,
        image_url,
        documents
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,
        $10,$11,$12,$13,$14,$15,$16,$17,$18
      )
      RETURNING *;
      `,
      [
        landlordId,
        apartment_name,
        property_type,
        first_name,
        last_name,
        country,
        city,
        area,
        street_address,
        postal_code,
        lat,
        lng,
        rent,
        deposit,
        dueDay,
        rent_due_type,
        imagePath,
        documentPath
      ]
    );

    return res.status(201).json({
      message: "Property added successfully",
      property: result.rows[0]
    });

  } catch (error) {
    console.error("Error in addProperty controller:", error);
    return res.status(500).json({
      error: "Server error: " + error.message
    });
  }
};

// Get properties for logged-in landlord
export const getMyProperties = async (req, res) => {
  try {
    const landlordId = req.user?.id;

    if (!landlordId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await pool.query(
      `
      SELECT *
      FROM properties
      WHERE landlord_id = $1
      ORDER BY created_at DESC
      `,
      [landlordId]
    );

    return res.status(200).json({
      count: result.rows.length,
      properties: result.rows,
    });

  } catch (error) {
    console.error("Get properties error:", error.message);
    return res.status(500).json({
      error: "Server error: " + error.message,
    });
  }
};

// Get all properties (Admin only)
export const getAllProperties = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const result = await pool.query(
      `
      SELECT p.*, u.first_name, u.last_name, u.email
      FROM properties p
      JOIN users u ON p.landlord_id = u.id
      ORDER BY p.created_at DESC
      `
    );

    return res.status(200).json({
      count: result.rows.length,
      properties: result.rows,
    });

  } catch (error) {
    console.error("Get all properties error:", error.message);
    return res.status(500).json({
      error: "Server error: " + error.message,
    });
  }
};


// Get single property by ID
export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM properties
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Property not found" });
    }

    return res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error("Get property error:", error.message);
    return res.status(500).json({
      error: "Server error: " + error.message,
    });
  }
};