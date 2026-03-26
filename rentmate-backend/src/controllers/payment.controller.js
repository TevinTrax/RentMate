import pool from "../config/db.js";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

// ✅ Use built-in fetch (Node 18+)
const fetchAPI = global.fetch;

// ✅ Validate Stripe key early (prevents crash)
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing in .env");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

// Helper: Generate M-Pesa Timestamp
const generateTimestamp = () => {
  const date = new Date();
  return date
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);
};

// Initiate Payment
export const initiatePayment = async (req, res) => {
  try {
    const { planId, paymentMethod, phone } = req.body;
    const userId = req.user.id;

    // 1. Get plan
    const planRes = await pool.query(
      "SELECT * FROM plans WHERE id=$1",
      [planId]
    );

    if (planRes.rows.length === 0) {
      return res.status(404).json({ error: "Plan not found" });
    }

    const plan = planRes.rows[0];

    // 2. Save transaction as pending
    const paymentRes = await pool.query(
      `INSERT INTO payments (user_id, plan_id, amount, method, status)
       VALUES ($1,$2,$3,$4,'pending') RETURNING *`,
      [userId, planId, plan.price, paymentMethod]
    );

    const payment = paymentRes.rows[0];

    // ============================
    // 🟢 M-PESA PAYMENT
    // ============================
    if (paymentMethod === "mpesa") {
      if (!phone) {
        return res
          .status(400)
          .json({ error: "Phone number required for M-Pesa" });
      }

      // Format phone (2547XXXXXXXX)
      let formattedPhone = phone;
      if (phone.startsWith("0")) {
        formattedPhone = "254" + phone.substring(1);
      }

      const timestamp = generateTimestamp();

      // Generate password
      const password = Buffer.from(
        process.env.MPESA_SHORTCODE +
          process.env.MPESA_PASSKEY +
          timestamp
      ).toString("base64");

      const response = await fetchAPI(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.MPESA_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            BusinessShortCode: process.env.MPESA_SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: plan.price,
            PartyA: formattedPhone,
            PartyB: process.env.MPESA_SHORTCODE,
            PhoneNumber: formattedPhone,
            CallBackURL: `${process.env.SERVER_URL}/api/payments/mpesa-callback`,
            AccountReference: `plan_${plan.id}`,
            TransactionDesc: `Payment for ${plan.name}`,
          }),
        }
      );

      const stkData = await response.json();

      if (!stkData.CheckoutRequestID) {
        return res.status(400).json({
          error: "Failed to initiate STK Push",
          stkData,
        });
      }

      // Save CheckoutRequestID
      await pool.query(
        `UPDATE payments SET checkout_request_id=$1 WHERE id=$2`,
        [stkData.CheckoutRequestID, payment.id]
      );

      return res.json({
        message: "STK Push sent to phone",
        payment,
        stkData,
      });
    }

    // ============================
    // 💳 STRIPE PAYMENT
    // ============================
    if (paymentMethod === "card") {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "kes",
              product_data: {
                name: plan.name,
              },
              unit_amount: Math.round(plan.price * 100), // cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/checkout-success?paymentId=${payment.id}`,
        cancel_url: `${process.env.CLIENT_URL}/checkout-cancel?paymentId=${payment.id}`,
      });

      return res.json({
        url: session.url,
        payment,
      });
    }

    // ============================
    // ⚠️ UNKNOWN METHOD
    // ============================
    return res.status(400).json({
      error: "Unsupported payment method",
    });
  } catch (err) {
    console.error("INITIATE PAYMENT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ============================
// 📩 M-PESA CALLBACK
// ============================
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

    const status = resultCode === 0 ? "completed" : "failed";

    await pool.query(
      `UPDATE payments 
       SET status=$1, response=$2 
       WHERE checkout_request_id=$3`,
      [status, JSON.stringify(data), checkoutRequestID]
    );

    return res.json({
      ResultCode: 0,
      ResultDesc: "Accepted",
    });
  } catch (err) {
    console.error("MPESA CALLBACK ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};