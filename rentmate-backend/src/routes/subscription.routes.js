import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getCurrentSubscription } from "../controllers/subscription.controller.js";

const router = express.Router();

router.get("/current", verifyToken, getCurrentSubscription);

export default router;