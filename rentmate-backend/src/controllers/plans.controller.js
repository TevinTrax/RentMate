import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

// GET all plans
export const getPlans = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM plans ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch plans" });
  }
};

// CREATE new plan
export const createPlan = async (req, res) => {
  try {
    const { name, price, description, duration, features, popular } = req.body;
    const id = uuidv4();
    const result = await pool.query(
      `INSERT INTO plans (id, name, price, description, duration, features, popular)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [id, name, price, description, duration, features || {}, popular || false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create plan" });
  }
};

// UPDATE plan
export const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, duration, features, popular } = req.body;

    const result = await pool.query(
      `UPDATE plans
       SET name=$1, price=$2, description=$3, duration=$4, features=$5, popular=$6, updated_at=NOW()
       WHERE id=$7
       RETURNING *`,
      [name, price, description, duration, features || {}, popular || false, id]
    );

    if (!result.rows.length) return res.status(404).json({ error: "Plan not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update plan" });
  }
};

// DELETE plan
export const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM plans WHERE id=$1 RETURNING *", [id]);
    if (!result.rows.length) return res.status(404).json({ error: "Plan not found" });
    res.json({ message: "Plan deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete plan" });
  }
};