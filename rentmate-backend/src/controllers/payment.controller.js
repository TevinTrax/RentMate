import pool from "../config/db.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import axios from "axios";
import moment from "moment";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// -------------------------------
// HELPERS
// -------------------------------
const addMonthsToDate = (date, months = 1) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

const formatMpesaPhone = (phone) => {
  if (!phone) return null;
  let formatted = phone.trim().replace(/\s+/g, "");
  if (formatted.startsWith("0")) {
    formatted = "254" + formatted.substring(1);
  } else if (formatted.startsWith("+254")) {
    formatted = formatted.replace("+", "");
  }
  return formatted;
};

const getMpesaAccessToken = async () => {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString("base64");

  const res = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    { headers: { Authorization: `Basic ${auth}` } }
  );
  return res.data.access_token;
};

const generateMpesaTimestamp = () => moment().format("YYYYMMDDHHmmss");

// -------------------------------
// ACTIVATE SUBSCRIPTION
// -------------------------------
export const activateSubscription = async ({
  userId,
  landlordId,
  plan,
  paymentId,
}) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const startDate = new Date();
    const endDate = addMonthsToDate(startDate, 1);

    // Expire any existing active subscriptions for this landlord
    await client.query(
      `UPDATE subscriptions
       SET status = 'expired', updated_at = now()
       WHERE landlord_id = $1 AND status = 'active'`,
      [landlordId]
    );

    // Insert new active subscription
    // NOTE: payment_id column is uuid — paymentId from payments table is uuid ✅
    await client.query(
      `INSERT INTO subscriptions
       (landlord_id, plan_id, payment_id, plan_name, start_date, end_date,
        status, billing_cycle, amount, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'active', 'monthly', $7, now(), now())`,
      [
        landlordId,
        plan.id,
        paymentId,   // uuid from payments.id
        plan.name,
        startDate.toISOString().split("T")[0],  // date columns expect YYYY-MM-DD
        endDate.toISOString().split("T")[0],
        plan.price,
      ]
    );

    // Update user subscription status
    await client.query(
      `UPDATE users
       SET subscription_status = 'active',
           subscription_start_date = $1,
           subscription_end_date = $2,
           updated_at = now()
       WHERE id = $3`,
      [startDate, endDate, userId]
    );

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

// -------------------------------
// INITIATE PAYMENT
// -------------------------------
export const initiatePayment = async (req, res) => {
  try {
    const { planCode, paymentMethod, phone } = req.body;
    const userId = req.user?.id;

    // ── Validate inputs ──────────────────────────────────────────────────────
    if (!planCode) {
      return res.status(400).json({ error: "Plan code is required" });
    }

    if (!paymentMethod) {
      return res.status(400).json({ error: "Payment method is required" });
    }

    const validMethods = ["mpesa", "card", "paypal", "bank"];
    if (!validMethods.includes(paymentMethod)) {
      return res.status(400).json({ error: "Unsupported payment method" });
    }

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    // ── Fetch user ───────────────────────────────────────────────────────────
    const userRes = await pool.query(
      `SELECT * FROM users WHERE id = $1 LIMIT 1`,
      [userId]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userRes.rows[0];
    const landlordId = user.id;

    // ── Fetch plan by name (case-insensitive) ────────────────────────────────
    const planRes = await pool.query(
      `SELECT * FROM plans WHERE LOWER(name) = LOWER($1) AND is_active = true LIMIT 1`,
      [planCode.trim()]
    );

    if (planRes.rows.length === 0) {
      return res.status(404).json({
        error: `Plan "${planCode}" not found. Please go back and select a valid plan.`,
      });
    }

    const plan = planRes.rows[0];

    // ── Check for duplicate active subscription ──────────────────────────────
    // Only block if they already have this EXACT plan active
    const activeSubRes = await pool.query(
      `SELECT id FROM subscriptions
       WHERE landlord_id = $1 AND status = 'active' AND LOWER(plan_name) = LOWER($2)
       LIMIT 1`,
      [landlordId, plan.name]
    );

    if (activeSubRes.rows.length > 0) {
      return res.status(400).json({
        error: `You already have an active ${plan.name} subscription. To upgrade, contact support.`,
      });
    }

    // ── Create pending payment record ────────────────────────────────────────
    const paymentRes = await pool.query(
      `INSERT INTO payments
       (user_id, landlord_id, plan_id, amount, expected_amount, method,
        payment_type, status, provider, currency, plan_name, billing_cycle,
        notes, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,'subscription','pending',$7,'KES',$8,'monthly',$9,now(),now())
       RETURNING *`,
      [
        userId,
        landlordId,
        plan.id,
        plan.price,
        plan.price,
        paymentMethod,
        paymentMethod,
        plan.name,
        `Subscription payment for ${plan.name} plan`,
      ]
    );

    const payment = paymentRes.rows[0];

    // ============================
    // M-PESA STK PUSH
    // ============================
    if (paymentMethod === "mpesa") {
      if (!phone) {
        return res.status(400).json({ error: "Phone number is required for M-Pesa" });
      }

      const formattedPhone = formatMpesaPhone(phone);

      if (!formattedPhone || !/^254(7|1)\d{8}$/.test(formattedPhone)) {
        return res.status(400).json({
          error: "Invalid M-Pesa phone number. Use format: 07XXXXXXXX or 01XXXXXXXX",
        });
      }

      try {
        const token = await getMpesaAccessToken();
        const timestamp = generateMpesaTimestamp();
        const password = Buffer.from(
          process.env.MPESA_SHORTCODE + process.env.MPESA_PASSKEY + timestamp
        ).toString("base64");

        const stkResponse = await axios.post(
          "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
          {
            BusinessShortCode: process.env.MPESA_SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: Math.round(Number(plan.price)),
            PartyA: formattedPhone,
            PartyB: process.env.MPESA_SHORTCODE,
            PhoneNumber: formattedPhone,
            CallBackURL: `${process.env.SERVER_URL}/api/payments/mpesa/callback`,
            AccountReference: `RentMate-${plan.name}`,
            TransactionDesc: `${plan.name} Plan - RentMate`,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const stkData = stkResponse.data;

        if (!stkData.CheckoutRequestID) {
          await pool.query(
            `UPDATE payments SET status='failed', callback_payload=$1, updated_at=now() WHERE id=$2`,
            [JSON.stringify(stkData), payment.id]
          );
          return res.status(400).json({
            error: "Failed to initiate M-Pesa STK Push. Please try again.",
            details: stkData,
          });
        }

        await pool.query(
          `UPDATE payments
           SET checkout_request_id = $1, provider_reference = $1,
               callback_payload = $2, updated_at = now()
           WHERE id = $3`,
          [stkData.CheckoutRequestID, JSON.stringify(stkData), payment.id]
        );

        return res.json({
          success: true,
          method: "mpesa",
          message: "STK Push sent! Check your phone and enter your M-Pesa PIN.",
          paymentId: payment.id,
        });
      } catch (mpesaErr) {
        console.error("M-PESA STK ERROR:", mpesaErr.response?.data || mpesaErr.message);
        await pool.query(
          `UPDATE payments SET status='failed', updated_at=now() WHERE id=$1`,
          [payment.id]
        );
        return res.status(500).json({
          error: "M-Pesa service unavailable. Please try again shortly.",
        });
      }
    }

    // ============================
    // STRIPE CARD
    // ============================
    if (paymentMethod === "card") {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: user.email,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${plan.name} Plan`,
                description: plan.description || "RentMate Subscription",
              },
              // Convert KES to USD cents (approximate — ideally use live rate)
              unit_amount: Math.round(Number(plan.price) * 100),
            },
            quantity: 1,
          },
        ],
        metadata: {
          paymentId: String(payment.id),
          userId: String(userId),
          planId: String(plan.id),
        },
        success_url: `${process.env.CLIENT_URL}/checkout-success?paymentId=${payment.id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/checkout-cancel?paymentId=${payment.id}`,
      });

      await pool.query(
        `UPDATE payments SET provider_reference = $1, updated_at = now() WHERE id = $2`,
        [session.id, payment.id]
      );

      return res.json({
        success: true,
        method: "card",
        url: session.url,
        paymentId: payment.id,
      });
    }

    // ============================
    // PAYPAL
    // ============================
    if (paymentMethod === "paypal") {
      return res.json({
        success: true,
        method: "paypal",
        url: `${process.env.CLIENT_URL}/paypal-placeholder?paymentId=${payment.id}`,
        paymentId: payment.id,
        message: "PayPal integration pending",
      });
    }

    // ============================
    // BANK TRANSFER
    // ============================
    if (paymentMethod === "bank") {
      await pool.query(
        `UPDATE payments SET notes = $1, updated_at = now() WHERE id = $2`,
        [`Awaiting bank transfer for ${plan.name} plan`, payment.id]
      );

      return res.json({
        success: true,
        method: "bank",
        paymentId: payment.id,
        message: "Use the bank details below to complete your transfer.",
        bankDetails: {
          bankName: "Equity Bank",
          accountName: "RentMate Ltd",
          accountNumber: "1234567890",
          branch: "Nairobi CBD",
          reference: `RM-${payment.id.toString().slice(0, 8).toUpperCase()}`,
        },
      });
    }

    return res.status(400).json({ error: "Unsupported payment method" });
  } catch (err) {
    console.error("INITIATE PAYMENT ERROR:", err.response?.data || err.message);
    return res.status(500).json({ error: "Payment initiation failed. Please try again." });
  }
};

// -------------------------------
// M-PESA CALLBACK
// -------------------------------
export const mpesaCallback = async (req, res) => {
  try {
    const data = req.body;
    console.log("MPESA CALLBACK:", JSON.stringify(data, null, 2));

    const callback = data.Body?.stkCallback;
    if (!callback) {
      return res.status(400).json({ error: "Invalid callback payload" });
    }

    const { CheckoutRequestID: checkoutRequestID, ResultCode: resultCode } = callback;

    const paymentRes = await pool.query(
      `SELECT p.*, pl.id as actual_plan_id, pl.name as actual_plan_name, pl.price
       FROM payments p
       JOIN plans pl ON p.plan_id = pl.id
       WHERE p.checkout_request_id = $1
       LIMIT 1`,
      [checkoutRequestID]
    );

    if (paymentRes.rows.length === 0) {
      console.warn("MPESA CALLBACK: Payment not found for CheckoutRequestID:", checkoutRequestID);
      return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    const payment = paymentRes.rows[0];

    if (payment.status === "paid") {
      return res.json({ ResultCode: 0, ResultDesc: "Already processed" });
    }

    if (resultCode === 0) {
      const metadata = callback.CallbackMetadata?.Item || [];
      const receiptItem = metadata.find((i) => i.Name === "MpesaReceiptNumber");
      const mpesaReceipt = receiptItem?.Value || null;

      await pool.query(
        `UPDATE payments
         SET status = 'paid', transaction_id = $1, provider_reference = $1,
             callback_payload = $2, paid_at = now(), updated_at = now()
         WHERE id = $3`,
        [mpesaReceipt, JSON.stringify(data), payment.id]
      );

      await activateSubscription({
        userId: payment.user_id,
        landlordId: payment.landlord_id,
        plan: {
          id: payment.plan_id,
          name: payment.actual_plan_name,
          price: payment.price,
        },
        paymentId: payment.id,
      });
    } else {
      await pool.query(
        `UPDATE payments
         SET status = 'failed', callback_payload = $1, updated_at = now()
         WHERE id = $2`,
        [JSON.stringify(data), payment.id]
      );
    }

    return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (err) {
    console.error("MPESA CALLBACK ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
};

// -------------------------------
// STRIPE VERIFY SUCCESS
// -------------------------------
export const verifyStripeSuccess = async (req, res) => {
  try {
    const { session_id, paymentId } = req.query;

    if (!session_id || !paymentId) {
      return res.status(400).json({ error: "Missing session_id or paymentId" });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ error: "Payment not yet completed" });
    }

    const paymentRes = await pool.query(
      `SELECT p.*, pl.id as actual_plan_id, pl.name as actual_plan_name, pl.price
       FROM payments p
       JOIN plans pl ON p.plan_id = pl.id
       WHERE p.id = $1 LIMIT 1`,
      [paymentId]
    );

    if (paymentRes.rows.length === 0) {
      return res.status(404).json({ error: "Payment record not found" });
    }

    const payment = paymentRes.rows[0];

    if (payment.status !== "paid") {
      await pool.query(
        `UPDATE payments
         SET status = 'paid', transaction_id = $1, provider_reference = $1,
             callback_payload = $2, paid_at = now(), updated_at = now()
         WHERE id = $3`,
        [session.payment_intent, JSON.stringify(session), payment.id]
      );

      await activateSubscription({
        userId: payment.user_id,
        landlordId: payment.landlord_id,
        plan: {
          id: payment.plan_id,
          name: payment.actual_plan_name,
          price: payment.price,
        },
        paymentId: payment.id,
      });
    }

    return res.json({
      success: true,
      message: "Payment verified successfully",
      planName: payment.actual_plan_name,
      amount: payment.amount,
      status: "paid",
    });
  } catch (err) {
    console.error("VERIFY STRIPE ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
};

// -------------------------------
// MANUAL BANK CONFIRMATION (ADMIN)
// -------------------------------
export const confirmBankPayment = async (req, res) => {
  try {
    const { paymentId } = req.body;

    if (!paymentId) {
      return res.status(400).json({ error: "paymentId is required" });
    }

    const paymentRes = await pool.query(
      `SELECT p.*, pl.id as actual_plan_id, pl.name as actual_plan_name, pl.price
       FROM payments p
       JOIN plans pl ON p.plan_id = pl.id
       WHERE p.id = $1 LIMIT 1`,
      [paymentId]
    );

    if (paymentRes.rows.length === 0) {
      return res.status(404).json({ error: "Payment not found" });
    }

    const payment = paymentRes.rows[0];

    if (payment.status === "paid") {
      return res.json({ success: true, message: "Payment already confirmed" });
    }

    await pool.query(
      `UPDATE payments SET status = 'paid', paid_at = now(), updated_at = now() WHERE id = $1`,
      [paymentId]
    );

    await activateSubscription({
      userId: payment.user_id,
      landlordId: payment.landlord_id,
      plan: {
        id: payment.plan_id,
        name: payment.actual_plan_name,
        price: payment.price,
      },
      paymentId: payment.id,
    });

    return res.json({
      success: true,
      message: "Bank payment confirmed and subscription activated",
    });
  } catch (err) {
    console.error("CONFIRM BANK PAYMENT ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
};