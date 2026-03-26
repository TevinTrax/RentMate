import express from "express";
import { initiatePayment, mpesaCallback } from "../controllers/payment.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { stkPush } from "../controllers/stkPush.controller.js";
import { createCheckoutSession } from "../controllers/stripe.controller.js";

const router = express.Router();

router.post("/pay", verifyToken, initiatePayment);
router.post("/mpesa/callback", mpesaCallback);
router.post("/mpesa", stkPush);
router.post("/stripe", createCheckoutSession);

export default router;