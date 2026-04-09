import pool from "../config/db.js";

export const requireActiveSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const userRes = await pool.query(
      `
      SELECT subscription_status, subscription_end_date
      FROM users
      WHERE id = $1
      `,
      [userId]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userRes.rows[0];

    const now = new Date();
    const endDate = user.subscription_end_date
      ? new Date(user.subscription_end_date)
      : null;

    if (
      user.subscription_status !== "active" ||
      !endDate ||
      endDate < now
    ) {
      return res.status(403).json({
        error: "Your subscription is inactive or expired. Please renew your plan.",
      });
    }

    next();
  } catch (error) {
    console.error("SUBSCRIPTION CHECK ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};