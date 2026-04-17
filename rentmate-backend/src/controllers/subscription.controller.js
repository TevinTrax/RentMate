import pool from "../config/db.js";

/* ===================== PLANS ===================== */

// GET PLANS
export const getPlans = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        name,
        price,
        duration as cycle,
        description,
        features,
        popular as featured,
        is_active,
        (
          SELECT COUNT(*) FROM subscriptions s WHERE s.plan_id = plans.id AND s.status = 'active'
        ) as subscribers
      FROM plans
      ORDER BY created_at DESC
    `);

    const formatted = result.rows.map(p => ({
      ...p,
      status: p.is_active ? "active" : "inactive",
      features: p.features || []
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE PLAN
export const createPlan = async (req, res) => {
  try {
    const { name, price, cycle, description, features, featured } = req.body;

    const result = await pool.query(`
      INSERT INTO plans (name, price, duration, description, features, popular)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *
    `, [name, price, cycle, description, JSON.stringify(features), featured]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE PLAN
export const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, cycle, description, features, featured } = req.body;

    const result = await pool.query(`
      UPDATE plans
      SET name=$1, price=$2, duration=$3, description=$4, features=$5, popular=$6
      WHERE id=$7
      RETURNING *
    `, [name, price, cycle, description, JSON.stringify(features), featured, id]);

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE PLAN
export const deletePlan = async (req, res) => {
  try {
    await pool.query(`DELETE FROM plans WHERE id=$1`, [req.params.id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// TOGGLE PLAN
export const togglePlan = async (req, res) => {
  try {
    const { status } = req.body;
    const is_active = status === "active";

    await pool.query(
      `UPDATE plans SET is_active=$1 WHERE id=$2`,
      [is_active, req.params.id]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ===================== SUBSCRIPTIONS ===================== */

// GET SUBSCRIPTIONS
export const getSubscriptions = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.id,
        u.first_name || ' ' || u.last_name as landlord,
        u.email,
        s.plan_name as plan,
        s.status,
        s.start_date as start,
        s.end_date as end,
        s.amount,
        s.plan_id
      FROM subscriptions s
      JOIN users u ON u.id = s.landlord_id
      ORDER BY s.created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE SUBSCRIPTION
export const createSubscription = async (req, res) => {
  try {
    const { landlord, email, planId, start, end, status, amount, plan } = req.body;

    // find user
    const user = await pool.query(
      `SELECT id FROM users WHERE email=$1 LIMIT 1`,
      [email]
    );

    if (!user.rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const result = await pool.query(`
      INSERT INTO subscriptions 
      (landlord_id, plan_id, plan_name, start_date, end_date, status, amount)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
    `, [user.rows[0].id, planId, plan, start, end, status, amount]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE SUB STATUS
export const updateSubscriptionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    await pool.query(
      `UPDATE subscriptions SET status=$1 WHERE id=$2`,
      [status, req.params.id]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ===================== STATS ===================== */

export const getStats = async (req, res) => {
  try {
    const total = await pool.query(`SELECT COUNT(*) FROM subscriptions`);
    const active = await pool.query(`SELECT COUNT(*) FROM subscriptions WHERE status='active'`);
    const expired = await pool.query(`SELECT COUNT(*) FROM subscriptions WHERE status='expired'`);
    const revenue = await pool.query(`SELECT COALESCE(SUM(amount),0) FROM subscriptions WHERE status='active'`);

    res.json({
      totalSubscribers: { value: Number(total.rows[0].count), change: 0, trend: "up" },
      activeSubscriptions: { value: Number(active.rows[0].count), change: 0, trend: "up" },
      expired: { value: Number(expired.rows[0].count), change: 0, trend: "down" },
      revenue: { value: Number(revenue.rows[0].coalesce), change: 0, trend: "up" },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};