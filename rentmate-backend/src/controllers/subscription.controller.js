import pool from "../config/db.js";

// ── Utility ───────────────────────────────────────────────────────────────────
// Always returns a JSON body — never leaves the client with an empty response
const jsonError = (res, status, message) =>
  res.status(status).json({ error: message });

// ─── PLANS ────────────────────────────────────────────────────────────────────
// plans.id          → uuid (gen_random_uuid())
// plans.name        → varchar(100) UNIQUE NOT NULL
// plans.price       → numeric(12,2) NOT NULL
// plans.description → text
// plans.duration    → varchar(50) DEFAULT 'monthly'
// plans.features    → jsonb
// plans.popular     → boolean DEFAULT false

export const getPlans = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        p.*,
        COUNT(s.id)::int AS subscribers
      FROM plans p
      LEFT JOIN subscriptions s ON s.plan_id = p.id
      GROUP BY p.id
      ORDER BY p.created_at ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error("getPlans:", err);
    jsonError(res, 500, "Failed to fetch plans");
  }
};

export const createPlan = async (req, res) => {
  const { name, price, duration, description, features, popular } = req.body;

  if (!name || !String(name).trim()) {
    return jsonError(res, 400, "Plan name is required");
  }
  if (price === undefined || price === null || price === "") {
    return jsonError(res, 400, "Price is required");
  }
  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice) || parsedPrice < 0) {
    return jsonError(res, 400, "Price must be a non-negative number");
  }

  // Normalise features: accept array or comma-string from the frontend
  let featuresArray = [];
  if (Array.isArray(features)) {
    featuresArray = features.map((f) => String(f).trim()).filter(Boolean);
  } else if (typeof features === "string" && features.trim()) {
    featuresArray = features.split(",").map((f) => f.trim()).filter(Boolean);
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO plans (name, price, duration, description, features, popular)
       VALUES ($1, $2, $3, $4, $5::jsonb, $6)
       RETURNING *`,
      [
        String(name).trim(),
        parsedPrice,
        duration || "monthly",
        String(description || "").trim(),
        JSON.stringify(featuresArray),
        !!popular,
      ]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return jsonError(res, 409, "A plan with that name already exists");
    }
    console.error("createPlan:", err);
    jsonError(res, 500, "Failed to create plan");
  }
};

export const updatePlan = async (req, res) => {
  const { id } = req.params;          // uuid
  const { name, price, duration, description, features, popular } = req.body;

  if (!id) return jsonError(res, 400, "Plan ID is required");

  // Only update features column if the client actually sent it
  let featuresJson = null;
  if (features !== undefined) {
    let arr = [];
    if (Array.isArray(features)) {
      arr = features.map((f) => String(f).trim()).filter(Boolean);
    } else if (typeof features === "string") {
      arr = features.split(",").map((f) => f.trim()).filter(Boolean);
    }
    featuresJson = JSON.stringify(arr);
  }

  let parsedPrice = null;
  if (price !== undefined && price !== null && price !== "") {
    parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return jsonError(res, 400, "Price must be a non-negative number");
    }
  }

  try {
    const { rows } = await pool.query(
      `UPDATE plans
       SET name        = COALESCE($1, name),
           price       = COALESCE($2, price),
           duration    = COALESCE($3, duration),
           description = COALESCE($4, description),
           features    = COALESCE($5::jsonb, features),
           popular     = COALESCE($6, popular),
           updated_at  = NOW()
       WHERE id = $7
       RETURNING *`,
      [
        name ? String(name).trim() : null,
        parsedPrice,
        duration    ?? null,
        description !== undefined ? String(description).trim() : null,
        featuresJson,
        popular !== undefined ? !!popular : null,
        id,                              // uuid — passed as string, pg casts it
      ]
    );
    if (!rows.length) return jsonError(res, 404, "Plan not found");
    res.json(rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return jsonError(res, 409, "A plan with that name already exists");
    }
    // Invalid UUID format from client
    if (err.code === "22P02") {
      return jsonError(res, 400, "Invalid plan ID format");
    }
    console.error("updatePlan:", err);
    jsonError(res, 500, "Failed to update plan");
  }
};

export const deletePlan = async (req, res) => {
  const { id } = req.params;
  if (!id) return jsonError(res, 400, "Plan ID is required");

  try {
    const { rowCount } = await pool.query(
      "DELETE FROM plans WHERE id = $1",
      [id]
    );
    if (!rowCount) return jsonError(res, 404, "Plan not found");
    res.json({ success: true });
  } catch (err) {
    if (err.code === "22P02") {
      return jsonError(res, 400, "Invalid plan ID format");
    }
    console.error("deletePlan:", err);
    jsonError(res, 500, "Failed to delete plan");
  }
};

// ─── SUBSCRIPTIONS ─────────────────────────────────────────────────────────────
// subscriptions.id          → uuid
// subscriptions.landlord_id → integer (FK → users.id)
// subscriptions.plan_id     → uuid    (FK → plans.id, nullable)
// subscriptions.status      → CHECK IN ('active','expired')  ← no 'trial' allowed
// subscriptions.start_date  → date NOT NULL
// subscriptions.end_date    → date NOT NULL

export const getSubscriptions = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        s.id,
        s.landlord_id,
        s.plan_id,
        s.plan_name,
        s.amount,
        s.billing_cycle,
        s.auto_renew,
        s.status,
        s.start_date,
        s.end_date,
        s.cancelled_at,
        s.created_at,
        u.first_name,
        u.last_name,
        u.email,
        u.phone_number,
        u.subscription_status   AS user_sub_status,
        p.name                  AS plan_name_from_plans,
        p.price                 AS plan_price,
        p.duration              AS plan_duration
      FROM subscriptions s
      JOIN  users u ON u.id = s.landlord_id
      LEFT JOIN plans p ON p.id = s.plan_id
      WHERE u.role = 'landlord'
      ORDER BY s.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("getSubscriptions:", err);
    jsonError(res, 500, "Failed to fetch subscriptions");
  }
};

export const getSubscriptionStats = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        COUNT(*)::int                                                  AS total,
        COUNT(*) FILTER (WHERE status = 'active')::int                AS active_count,
        COUNT(*) FILTER (WHERE status = 'expired')::int               AS expired_count,
        COALESCE(SUM(amount) FILTER (WHERE status = 'active'), 0)     AS mrr,
        COALESCE(SUM(amount) FILTER (WHERE status = 'active'), 0) * 12 AS arr,
        CASE
          WHEN COUNT(*) FILTER (WHERE status = 'active') > 0
          THEN ROUND(
            SUM(amount)  FILTER (WHERE status = 'active') /
            COUNT(*)::numeric FILTER (WHERE status = 'active'), 2)
          ELSE 0
        END AS arpu
      FROM subscriptions
    `);

    // Always return a populated object — never an empty body
    res.json(rows[0] ?? {
      total: 0, active_count: 0, expired_count: 0,
      mrr: 0, arr: 0, arpu: 0,
    });
  } catch (err) {
    console.error("getSubscriptionStats:", err);
    jsonError(res, 500, "Failed to fetch stats");
  }
};

export const expireSubscription = async (req, res) => {
  const { id } = req.params;   // uuid
  if (!id) return jsonError(res, 400, "Subscription ID is required");

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `UPDATE subscriptions
       SET status       = 'expired',
           cancelled_at = NOW(),
           updated_at   = NOW()
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (!rows.length) {
      await client.query("ROLLBACK");
      return jsonError(res, 404, "Subscription not found");
    }

    // Reflect on the user — users.subscription_status allows 'trial'
    // so reverting to 'trial' is intentional here (mirrors original logic)
    await client.query(
      `UPDATE users
       SET subscription_status   = 'trial',
           subscription_end_date = NOW(),
           updated_at            = NOW()
       WHERE id = $1`,
      [rows[0].landlord_id]   // landlord_id is integer — matches users.id
    );

    await client.query("COMMIT");
    res.json(rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    if (err.code === "22P02") {
      return jsonError(res, 400, "Invalid subscription ID format");
    }
    console.error("expireSubscription:", err);
    jsonError(res, 500, "Failed to expire subscription");
  } finally {
    client.release();
  }
};

export const createSubscription = async (req, res) => {
  const {
    landlord_id,    // integer
    plan_id,        // uuid
    billing_cycle,
    amount,
    start_date,
    end_date,
    auto_renew,
  } = req.body;

  if (!landlord_id || !plan_id) {
    return jsonError(res, 400, "landlord_id and plan_id are required");
  }

  // subscriptions.start_date and end_date are NOT NULL in the schema
  const resolvedStart = start_date ?? new Date().toISOString().split("T")[0];
  if (!end_date && !start_date) {
    return jsonError(res, 400, "end_date is required");
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Verify plan exists and grab defaults
    const planRes = await client.query(
      "SELECT name, price, duration FROM plans WHERE id = $1",
      [plan_id]
    );
    if (!planRes.rows.length) {
      await client.query("ROLLBACK");
      return jsonError(res, 404, "Plan not found");
    }
    const plan = planRes.rows[0];

    const resolvedAmount =
      amount !== undefined && amount !== null && amount !== ""
        ? parseFloat(amount)
        : parseFloat(plan.price);

    if (isNaN(resolvedAmount) || resolvedAmount < 0) {
      await client.query("ROLLBACK");
      return jsonError(res, 400, "Invalid amount");
    }

    const { rows } = await client.query(
      `INSERT INTO subscriptions
         (landlord_id, plan_id, plan_name, amount, billing_cycle, auto_renew,
          start_date, end_date, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active')
       RETURNING *`,
      [
        landlord_id,
        plan_id,
        plan.name,
        resolvedAmount,
        billing_cycle ?? plan.duration,
        auto_renew ?? false,
        resolvedStart,
        end_date,         // NOT NULL in schema — caller must provide
      ]
    );

    await client.query(
      `UPDATE users
       SET subscription_status     = 'active',
           subscription_start_date = $1,
           subscription_end_date   = $2,
           updated_at              = NOW()
       WHERE id = $3`,
      [rows[0].start_date, rows[0].end_date, landlord_id]
    );

    await client.query("COMMIT");
    res.status(201).json(rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    if (err.code === "22P02") {
      return jsonError(res, 400, "Invalid UUID format in plan_id");
    }
    if (err.code === "23503") {
      return jsonError(res, 400, "Landlord or plan does not exist");
    }
    console.error("createSubscription:", err);
    jsonError(res, 500, "Failed to create subscription");
  } finally {
    client.release();
  }
};

export const togglePlanStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(
      `UPDATE plans
       SET is_active = NOT is_active,
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (!rows.length) return jsonError(res, 404, "Plan not found");

    res.json(rows[0]);
  } catch (err) {
    console.error("togglePlanStatus:", err);
    jsonError(res, 500, "Failed to toggle plan status");
  }
};