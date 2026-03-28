// routes/auth.routes.js
import express from "express";
import { login2FA, verifyOTP, approveLandlord, forgotPassword, resetPassword} from "../controllers/auth.controller.js";

const router = express.Router();

// 2FA login flow
router.post("/login", login2FA);       // Step 1: send OTP
router.post("/verify-otp", verifyOTP); // Step 2: verify OTP & get token

// Admin/Landlord approval routes
router.put("/approve-landlord/:id", approveLandlord);

// Forgot/Reset password routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;