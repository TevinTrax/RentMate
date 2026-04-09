import pool from "../config/db.js";

export const getCurrentSubscription = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT s.*, p.name, p.price, p.billing_cycle, p.property_limit, p.unit_limit
      FROM subscriptions s
      JOIN plans p ON s.plan_id = p.id
      WHERE s.landlord_id = $1
      ORDER BY s.start_date DESC
      LIMIT 1
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No subscription found" });
    }

    res.json({
      success: true,
      subscription: result.rows[0],
    });
  } catch (error) {
    console.error("GET CURRENT SUBSCRIPTION ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};