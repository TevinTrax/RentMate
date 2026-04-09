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
    {
      headers: { Authorization: `Basic ${auth}` },
    }
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

    await client.query(
      `
      UPDATE subscriptions
      SET status = 'expired', updated_at = now()
      WHERE landlord_id = $1 AND status = 'active'
      `,
      [landlordId]
    );

    await client.query(
      `
      INSERT INTO subscriptions
      (
        landlord_id,
        plan_id,
        payment_id,
        plan_name,
        start_date,
        end_date,
        status,
        billing_cycle,
        amount,
        created_at,
        updated_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,'active','monthly',$7,now(),now())
      `,
      [
        landlordId,
        plan.id,
        paymentId,
        plan.name,
        startDate,
        endDate,
        plan.price,
      ]
    );

    await client.query(
      `
      UPDATE users
      SET
        subscription_status = 'active',
        subscription_start_date = $1,
        subscription_end_date = $2,
        updated_at = now()
      WHERE id = $3
      `,
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
    const userId = req.user.id;

    if (!planCode) {
      return res.status(400).json({ error: "Plan code is required" });
    }

    const userRes = await pool.query(
      `SELECT * FROM users WHERE id = $1 LIMIT 1`,
      [userId]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userRes.rows[0];
    const landlordId = user.id;

    // ✅ FIXED: fetch plan by NAME instead of UUID id
    const normalizedPlanName =
      planCode.toLowerCase() === "basic"
        ? "Basic"
        : planCode.toLowerCase() === "standard"
        ? "Standard"
        : planCode.toLowerCase() === "premium"
        ? "Premium"
        : null;

    if (!normalizedPlanName) {
      return res.status(400).json({ error: "Invalid plan selected" });
    }

    const planRes = await pool.query(
      `SELECT * FROM plans WHERE LOWER(name) = LOWER($1) LIMIT 1`,
      [normalizedPlanName]
    );

    if (planRes.rows.length === 0) {
      return res.status(404).json({
        error: `Plan "${normalizedPlanName}" not found in database`,
      });
    }

    const plan = planRes.rows[0];

    const activeSubRes = await pool.query(
      `
      SELECT * FROM subscriptions
      WHERE landlord_id = $1 AND status = 'active' AND plan_name = $2
      LIMIT 1
      `,
      [landlordId, plan.name]
    );

    if (activeSubRes.rows.length > 0) {
      return res.status(400).json({
        error: `You already have an active ${plan.name} subscription.`,
      });
    }

    const paymentRes = await pool.query(
      `
      INSERT INTO payments
      (
        user_id,
        landlord_id,
        plan_id,
        amount,
        expected_amount,
        method,
        payment_type,
        status,
        provider,
        currency,
        plan_name,
        billing_cycle,
        notes,
        created_at,
        updated_at
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,'subscription','pending',$7,'KES',$8,'monthly',$9,now(),now())
      RETURNING *
      `,
      [
        userId,
        landlordId,
        plan.id,
        plan.price,
        plan.price,
        paymentMethod,
        paymentMethod,
        plan.name,
        `Subscription payment for ${plan.name}`,
      ]
    );

    const payment = paymentRes.rows[0];

    // ============================
    // M-PESA
    // ============================
    if (paymentMethod === "mpesa") {
      if (!phone) {
        return res.status(400).json({ error: "Phone number is required" });
      }

      const formattedPhone = formatMpesaPhone(phone);

      if (!/^254(7|1)\d{8}$/.test(formattedPhone)) {
        return res.status(400).json({
          error: "Invalid M-Pesa phone number format. Use 07XXXXXXXX",
        });
      }

      const token = await getMpesaAccessToken();
      const timestamp = generateMpesaTimestamp();
      const password = Buffer.from(
        process.env.MPESA_SHORTCODE + process.env.MPESA_PASSKEY + timestamp
      ).toString("base64");

      const response = await axios.post(
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
          TransactionDesc: `Payment for ${plan.name}`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const stkData = response.data;

      if (!stkData.CheckoutRequestID) {
        await pool.query(
          `UPDATE payments SET status='failed', callback_payload=$1, updated_at=now() WHERE id=$2`,
          [JSON.stringify(stkData), payment.id]
        );

        return res.status(400).json({
          error: "Failed to initiate STK Push",
          details: stkData,
        });
      }

      await pool.query(
        `
        UPDATE payments
        SET
          checkout_request_id = $1,
          provider_reference = $1,
          callback_payload = $2,
          updated_at = now()
        WHERE id = $3
        `,
        [stkData.CheckoutRequestID, JSON.stringify(stkData), payment.id]
      );

      return res.json({
        success: true,
        method: "mpesa",
        message: "STK Push sent successfully",
        paymentId: payment.id,
      });
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
        `
        UPDATE payments
        SET provider_reference = $1, updated_at = now()
        WHERE id = $2
        `,
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
        message: "PayPal integration not yet completed",
      });
    }

    // ============================
    // BANK TRANSFER
    // ============================
    if (paymentMethod === "bank") {
      await pool.query(
        `
        UPDATE payments
        SET notes = $1, updated_at = now()
        WHERE id = $2
        `,
        [
          `Awaiting bank transfer confirmation for ${plan.name} plan`,
          payment.id,
        ]
      );

      return res.json({
        success: true,
        method: "bank",
        paymentId: payment.id,
        message: "Bank transfer initiated. Awaiting confirmation.",
        bankDetails: {
          bankName: "Equity Bank",
          accountName: "RentMate Ltd",
          accountNumber: "1234567890",
          branch: "Nairobi CBD",
        },
      });
    }

    return res.status(400).json({ error: "Unsupported payment method" });
  } catch (err) {
    console.error("INITIATE PAYMENT ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: err.message });
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
      return res.status(400).json({ error: "Invalid callback" });
    }

    const checkoutRequestID = callback.CheckoutRequestID;
    const resultCode = callback.ResultCode;

    const paymentRes = await pool.query(
      `
      SELECT p.*, pl.id as actual_plan_id, pl.name as actual_plan_name, pl.price
      FROM payments p
      JOIN plans pl ON p.plan_id = pl.id
      WHERE p.checkout_request_id = $1
      LIMIT 1
      `,
      [checkoutRequestID]
    );

    if (paymentRes.rows.length === 0) {
      return res.status(404).json({ error: "Payment not found" });
    }

    const payment = paymentRes.rows[0];

    if (payment.status === "paid") {
      return res.json({
        ResultCode: 0,
        ResultDesc: "Already processed",
      });
    }

    if (resultCode === 0) {
      let mpesaReceipt = null;

      const metadata = callback.CallbackMetadata?.Item || [];
      const receiptItem = metadata.find((i) => i.Name === "MpesaReceiptNumber");
      if (receiptItem) mpesaReceipt = receiptItem.Value;

      await pool.query(
        `
        UPDATE payments
        SET
          status = 'paid',
          transaction_id = $1,
          provider_reference = $1,
          callback_payload = $2,
          paid_at = now(),
          updated_at = now()
        WHERE id = $3
        `,
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
        `
        UPDATE payments
        SET
          status = 'failed',
          callback_payload = $1,
          updated_at = now()
        WHERE id = $2
        `,
        [JSON.stringify(data), payment.id]
      );
    }

    return res.json({
      ResultCode: 0,
      ResultDesc: "Accepted",
    });
  } catch (err) {
    console.error("MPESA CALLBACK ERROR:", err);
    res.status(500).json({ error: err.message });
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
      return res.status(400).json({ error: "Payment not completed" });
    }

    const paymentRes = await pool.query(
      `
      SELECT p.*, pl.id as actual_plan_id, pl.name as actual_plan_name, pl.price
      FROM payments p
      JOIN plans pl ON p.plan_id = pl.id
      WHERE p.id = $1
      LIMIT 1
      `,
      [paymentId]
    );

    if (paymentRes.rows.length === 0) {
      return res.status(404).json({ error: "Payment record not found" });
    }

    const payment = paymentRes.rows[0];

    if (payment.status !== "paid") {
      await pool.query(
        `
        UPDATE payments
        SET
          status = 'paid',
          transaction_id = $1,
          provider_reference = $1,
          callback_payload = $2,
          paid_at = now(),
          updated_at = now()
        WHERE id = $3
        `,
        [session.payment_intent, session.payment_intent, JSON.stringify(session), payment.id]
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
      message: "Stripe payment verified successfully",
      planName: payment.actual_plan_name,
      amount: payment.amount,
      status: "paid",
    });
  } catch (err) {
    console.error("VERIFY STRIPE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// -------------------------------
// MANUAL BANK CONFIRMATION (ADMIN)
// -------------------------------
export const confirmBankPayment = async (req, res) => {
  try {
    const { paymentId } = req.body;

    const paymentRes = await pool.query(
      `
      SELECT p.*, pl.id as actual_plan_id, pl.name as actual_plan_name, pl.price
      FROM payments p
      JOIN plans pl ON p.plan_id = pl.id
      WHERE p.id = $1
      LIMIT 1
      `,
      [paymentId]
    );

    if (paymentRes.rows.length === 0) {
      return res.status(404).json({ error: "Payment not found" });
    }

    const payment = paymentRes.rows[0];

    if (payment.status === "paid") {
      return res.json({
        success: true,
        message: "Payment already confirmed",
      });
    }

    await pool.query(
      `
      UPDATE payments
      SET
        status = 'paid',
        paid_at = now(),
        updated_at = now()
      WHERE id = $1
      `,
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
    res.status(500).json({ error: err.message });
  }
};