import pool from "../config/db.js";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// Add a new property
export const addProperty = async (req, res) => {
  try {
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
      total_units,
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
      rent_due_type
    } = req.body;

    // Convert numeric fields
    const lat = latitude ? parseFloat(latitude) : null;
    const lng = longitude ? parseFloat(longitude) : null;
    const rent = monthly_rent ? parseFloat(monthly_rent) : null;
    const deposit = security_deposit ? parseFloat(security_deposit) : null;
    const dueDay = rent_due_day ? parseInt(rent_due_day, 10) : null;

    const result = await pool.query(
      `
      INSERT INTO properties (
        landlord_id,
        apartment_name,
        property_type,
        total_units,
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
        documents,
        status,
        approval_status,
        created_at
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,
        $10,$11,$12,$13,$14,$15,$16,$17,$18, $19, 'draft', 'pending',NOW()
      )
      RETURNING *;
      `,
      [
        landlordId,
        apartment_name,
        property_type,
        total_units,
        manager_first_name,
        manager_last_name,
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
    return res.status(500).json({ error: "Server error: " + error.message });
  }
};

// Get properties for logged-in landlord
export const getMyProperties = async (req, res) => {
  try {
    const landlordId = req.user?.id;
    if (!landlordId) return res.status(401).json({ error: "Unauthorized" });

    const result = await pool.query(
      `SELECT * FROM properties WHERE landlord_id = $1 AND status= 'draft' ORDER BY created_at DESC`,
      [landlordId]
    );

    return res.status(200).json({ count: result.rows.length, properties: result.rows });
  } catch (error) {
    console.error("Get properties error:", error.message);
    return res.status(500).json({ error: "Server error: " + error.message });
  }
};

// Get all properties (Admin only)
export const getAllProperties = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Access denied" });

    const result = await pool.query(
      `
      SELECT p.*, u.first_name AS landlord_first_name, u.last_name AS landlord_last_name, u.email AS landlord_email
      FROM properties p
      JOIN users u ON p.landlord_id = u.id
      ORDER BY p.created_at DESC
      `
    );

    return res.status(200).json({ count: result.rows.length, properties: result.rows });
  } catch (error) {
    console.error("Get all properties error:", error.message);
    return res.status(500).json({ error: "Server error: " + error.message });
  }
};

// Get single property by ID
export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT * FROM properties WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: "Property not found" });

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Get property error:", error.message);
    return res.status(500).json({ error: "Server error: " + error.message });
  }
};

// Download ownership document
export const downloadOwnershipDocument = async (req, res) => {
  try {
    const { id } = req.params;

    // Get property details
    const propertyResult = await pool.query(
      `SELECT landlord_id, documents FROM properties WHERE id = $1`,
      [id]
    );

    if (!propertyResult.rows.length) {
      return res.status(404).json({ error: "Property not found" });
    }

    const property = propertyResult.rows[0];

    // Authorization check
    if (req.user.role !== "admin" && property.landlord_id !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const fileName = property.documents;

    if (!fileName) {
      return res.status(404).json({ error: "No document uploaded" });
    }

    const filePath = path.join(process.cwd(), "uploads", "Documents", fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    res.download(filePath, fileName);

  } catch (error) {
    console.error("Download document error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};


export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check if property exists
    const propertyResult = await pool.query("SELECT * FROM properties WHERE id = $1", [id]);
    if (!propertyResult.rows.length) return res.status(404).json({ error: "Property not found" });

    const property = propertyResult.rows[0];

    // Only the owner (landlord) or admin can delete
    if (property.landlord_id !== userId && userRole !== "admin") {
      return res.status(403).json({ error: "You are not allowed to delete this property" });
    }

    // Delete files from uploads
    if (property.image_url) {
      const imagePath = path.join(process.cwd(), "uploads", "Images", property.image_url);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }
    if (property.documents) {
      const docPath = path.join(process.cwd(), "uploads", "Documents", property.documents);
      if (fs.existsSync(docPath)) fs.unlinkSync(docPath);
    }

    // Delete property from DB
    await pool.query("DELETE FROM properties WHERE id = $1", [id]);

    return res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Delete property error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};


export const updateProperty = async (req, res) => {
  try {
    const propertyId = req.params.id;

    // Check if property exists and belongs to landlord
    const propertyCheck = await pool.query(
      `SELECT * FROM properties WHERE id = $1`,
      [propertyId]
    );

    if (propertyCheck.rows.length === 0) {
      return res.status(404).json({
        error: "Property not found or you do not have permission to edit it"
      });
    }

    const existingProperty = propertyCheck.rows[0];

    // Handle uploaded files
    const imagePath = req.files?.image_url
      ? req.files.image_url[0].filename
      : existingProperty.image_url;

    const documentPath = req.files?.documents
      ? req.files.documents[0].filename
      : existingProperty.documents;

    // Extract form fields
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

    // Convert numeric values
    const lat = latitude ? parseFloat(latitude) : existingProperty.latitude;
    const lng = longitude ? parseFloat(longitude) : existingProperty.longitude;

    const rent = monthly_rent
      ? parseFloat(monthly_rent)
      : existingProperty.monthly_rent;

    const deposit = security_deposit
      ? parseFloat(security_deposit)
      : existingProperty.security_deposit;

    const dueDay = rent_due_day
      ? parseInt(rent_due_day, 10)
      : existingProperty.rent_due_day;

    const result = await pool.query(
      `
      UPDATE properties
      SET
        apartment_name = $1,
        property_type = $2,
        manager_first_name = $3,
        manager_last_name = $4,
        country = $5,
        city = $6,
        area = $7,
        street_address = $8,
        postal_code = $9,
        latitude = $10,
        longitude = $11,
        monthly_rent = $12,
        security_deposit = $13,
        rent_due_day = $14,
        rent_due_type = $15,
        image_url = $16,
        documents = $17
      WHERE id = $18
      RETURNING *;
      `,
      [
        apartment_name || existingProperty.apartment_name,
        property_type || existingProperty.property_type,
        first_name || existingProperty.manager_first_name,
        last_name || existingProperty.manager_last_name,
        country || existingProperty.country,
        city || existingProperty.city,
        area || existingProperty.area,
        street_address || existingProperty.street_address,
        postal_code || existingProperty.postal_code,
        lat,
        lng,
        rent,
        deposit,
        dueDay,
        rent_due_type || existingProperty.rent_due_type,
        imagePath,
        documentPath,
        propertyId
      ]
    );

    return res.status(200).json({
      message: "Property updated successfully",
      property: result.rows[0]
    });

  } catch (error) {
    console.error("Error updating property:", error);
    return res.status(500).json({
      error: "Server error: " + error.message
    });
  }
};

// POST /properties
export const postProperty = async (req, res) => {
  try {
    const landlordId = req.user?.id;
    if (!landlordId) {
      return res.status(401).json({ error: "Unauthorized: landlord not found" });
    }

    // Uploaded files
    const imagePath = req.files?.image_url ? req.files.image_url[0].filename : null;
    const documentPath = req.files?.documents ? req.files.documents[0].filename : null;

    // Check if landlord has active subscription
    // const subCheck = await pool.query(
    //   `SELECT * FROM subscriptions 
    //    WHERE landlord_id = $1 AND status='active' AND end_date >= CURRENT_DATE`,
    //   [landlordId]
    // );

    // if (!subCheck.rows.length) {
    //   return res.status(403).json({ error: "You must have an active subscription to post a property." });
    // }


    // Form data
    const {
      apartment_name,
      property_type,
      manager_first_name,
      manager_last_name,
      property_status,
      vacant_units,
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
      bedrooms,
      bathrooms,
      size_sqft,
      has_pool,
      has_parking,
      has_gym,
      wifi,
      security,
      furnished,
      rent_cycle,
      description,
      caretaker_first_name,
      caretaker_last_name,
      caretaker_phone_number,
      caretaker_alt_phone_number,
      caretaker_id_number
    } = req.body;

    // Convert numeric fields
    const lat = latitude ? parseFloat(latitude) : null;
    const lng = longitude ? parseFloat(longitude) : null;
    const rent = monthly_rent ? parseFloat(monthly_rent) : null;
    const deposit = security_deposit ? parseFloat(security_deposit) : null;
    const dueDay = rent_due_day ? parseInt(rent_due_day, 10) : null;
    const beds = bedrooms ? parseInt(bedrooms, 10) : null;
    const baths = bathrooms ? parseInt(bathrooms, 10) : null;
    const size = size_sqft ? parseFloat(size_sqft) : null;

    const result = await pool.query(
      `
      INSERT INTO properties (
        id,
        landlord_id,
        apartment_name,
        property_type,
        manager_first_name,
        manager_last_name,
        property_status,
        vacant_units,
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
        bedrooms,
        bathrooms,
        size_sqft,
        has_pool,
        has_parking,
        has_gym,
        wifi,
        security,
        furnished,
        rent_cycle,
        description,
        caretaker_first_name,
        caretaker_last_name,
        caretaker_phone_number,
        caretaker_alt_phone_number,
        caretaker_id_number,
        image_url,
        documents,
        status,
        approval_status,
        created_at
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
        $21,$22,$23,$24,$25,$26,$27,$28,$29,$30, $31,$32,$33,$34,$35, $36, $37'posted','pending',NOW()
      )
      RETURNING *;
      `,
      [
        uuidv4(),
        landlordId,
        apartment_name,
        property_type,
        manager_first_name,
        manager_last_name,
        property_status,
        vacant_units,
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
        beds,
        baths,
        size,
        has_pool,
        has_parking,
        has_gym,
        wifi,
        security,
        furnished,
        rent_cycle,
        description,
        caretaker_first_name,
        caretaker_last_name,
        caretaker_phone_number,
        caretaker_alt_phone_number,
        caretaker_id_number,
        imagePath,
        documentPath
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Property posted successfully",
      property: result.rows[0]
    });

  } catch (error) {
    console.error("Error in postProperty controller:", error);
    return res.status(500).json({ error: "Server error: " + error.message });
  }
};


// landlord posted properties
export const getMyPostedProperties = async (req, res) => {
  try {
    const landlordId = req.user?.id;
    if (!landlordId) {
      return res.status(401).json({ error: "Unauthorized: landlord not found" });
    }

    // Fetch only properties that are posted/live
    const result = await pool.query(
      `SELECT * FROM properties 
       WHERE landlord_id = $1 AND status = 'posted' 
       ORDER BY created_at DESC`,
      [landlordId]
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      properties: result.rows
    });
  } catch (error) {
    console.error("Error fetching posted properties:", error);
    return res.status(500).json({ error: "Server error: " + error.message });
  }
};


// controllers/properties.controller.js

// Fetch all posted properties waiting for admin approval
export const getPendingProperties = async (req, res) => {
  try {
    // Ensure user exists and is admin
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    const result = await pool.query(
      `SELECT 
          p.*, 
          u.first_name AS landlord_first_name, 
          u.last_name AS landlord_last_name, 
          u.email AS landlord_email
       FROM properties p
       JOIN users u ON p.landlord_id = u.id
       WHERE p.status = 'posted'
       AND p.approval_status = 'pending'
       ORDER BY p.created_at DESC`
    );

    return res.status(200).json({
      success: true,
      count: result.rowCount,
      properties: result.rows
    });

  } catch (error) {
    console.error("Error fetching pending properties:", error);
    return res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
};


// properties posted public
export const getPostedPropertiesPublic = async (req, res) => {
  try {

    const result = await pool.query(
      `SELECT * FROM properties 
       WHERE status = 'posted'
       AND approval_status = 'approved'
       ORDER BY created_at DESC`
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      properties: result.rows
    });

  } catch (error) {
    console.error("Error fetching posted properties:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// admin approves property
export const approveProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE properties 
       SET approval_status = 'approved' 
       WHERE id = $1 
       RETURNING *`,
      [id]
    );

    res.json({
      message: "Property approved successfully",
      property: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// admin rejects property
export const rejectProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE properties 
       SET approval_status = 'rejected' 
       WHERE id = $1 
       RETURNING *`,
      [id]
    );

    res.json({
      message: "Property rejected",
      property: result.rows[0]
    });

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};