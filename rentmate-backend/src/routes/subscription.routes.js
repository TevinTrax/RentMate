import { Router } from "express";
import * as ctrl from "../controllers/subscription.controller.js";
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

// ── Plans (admin only) ───────────────────────────────────────────────────────
router.get("/plans",                     verifyToken, requireRole("admin"), ctrl.getPlans);
router.post("/plans",                    verifyToken, requireRole("admin"), ctrl.createPlan);
router.put("/plans/:id",                 verifyToken, requireRole("admin"), ctrl.updatePlan);
router.patch("/plans/:id/toggle", verifyToken, requireRole("admin"), ctrl.togglePlanStatus);
router.delete("/plans/:id",              verifyToken, requireRole("admin"), ctrl.deletePlan);

// ── Subscriptions ─────────────────────────────────────────────────────────────
router.get("/subscriptions/stats",       verifyToken, requireRole("admin"), ctrl.getSubscriptionStats);
router.get("/subscriptions",             verifyToken, requireRole("admin"), ctrl.getSubscriptions);
router.post("/subscriptions",            verifyToken, requireRole("admin"), ctrl.createSubscription);
router.post("/subscriptions/:id/expire", verifyToken, requireRole("admin"), ctrl.expireSubscription);

export default router;