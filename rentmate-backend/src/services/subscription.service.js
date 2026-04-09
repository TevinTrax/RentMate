import pool from "../config/db.js";

/**
 * Activates or renews a landlord subscription after successful payment
 */
export const activateSubscription = async ({
  landlordId,
  planId,
  paymentId,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Get plan details
    const planRes = await client.query(
      `SELECT * FROM plans WHERE id = $1`,
      [planId]
    );

    if (planRes.rows.length === 0) {
      throw new Error("Plan not found");
    }

    const plan = planRes.rows[0];

    // 2. Determine duration
    const today = new Date();
    const startDate = new Date(today);

    let endDate = new Date(today);

    if ((plan.billing_cycle || "monthly").toLowerCase() === "yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    // 3. Expire any previous active subscriptions
    await client.query(
      `
      UPDATE subscriptions
      SET status = 'expired',
          updated_at = CURRENT_TIMESTAMP
      WHERE landlord_id = $1
        AND status = 'active'
      `,
      [landlordId]
    );

    // 4. Create new active subscription
    const subRes = await client.query(
      `
      INSERT INTO subscriptions (
        landlord_id,
        plan_id,
        plan_name,
        payment_id,
        amount,
        billing_cycle,
        start_date,
        end_date,
        status,
        auto_renew,
        created_at,
        updated_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'active',false,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
      RETURNING *
      `,
      [
        landlordId,
        plan.id,
        plan.name,
        paymentId,
        plan.price,
        plan.billing_cycle || "monthly",
        startDate,
        endDate,
      ]
    );

    const subscription = subRes.rows[0];

    // 5. Update user fast-access subscription fields
    await client.query(
      `
      UPDATE users
      SET subscription_status = 'active',
          subscription_start_date = $1,
          subscription_end_date = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      `,
      [startDate, endDate, landlordId]
    );

    // 6. Update payment record as paid
    await client.query(
      `
      UPDATE payments
      SET status = 'paid',
          paid_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      `,
      [paymentId]
    );

    await client.query("COMMIT");

    return {
      success: true,
      subscription,
      plan,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};