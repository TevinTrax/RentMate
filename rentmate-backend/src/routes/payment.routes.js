import express from "express";
import {
  initiatePayment,
  mpesaCallback,
  verifyStripeSuccess,
  confirmBankPayment,
} from "../controllers/payment.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// initiate any payment
router.post("/pay", verifyToken, initiatePayment);

// mpesa callback
router.post("/mpesa/callback", mpesaCallback);

// stripe success verification
router.get("/stripe/verify", verifyToken, verifyStripeSuccess);

// manual bank confirmation (protect with admin middleware later)
router.post("/bank/confirm", verifyToken, confirmBankPayment);

export default router;