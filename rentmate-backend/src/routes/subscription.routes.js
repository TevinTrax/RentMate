import express from "express";
import {
  getPlans, createPlan, updatePlan, deletePlan, togglePlan,
  getSubscriptions, createSubscription, updateSubscriptionStatus,
  getStats
} from "../controllers/subscription.controller.js";

const router = express.Router();

/* PLANS */
router.get("/plans/all", getPlans);
router.post("/plans", createPlan);
router.put("/plans/:id", updatePlan);
router.delete("/plans/:id", deletePlan);
router.patch("/plans/:id/status", togglePlan);

/* SUBSCRIPTIONS */
router.get("/subscriptions/all", getSubscriptions);
router.post("/subscriptions", createSubscription);
router.patch("/subscriptions/:id/status", updateSubscriptionStatus);

/* STATS */
router.get("/stats/subscriptions", getStats);

export default router;