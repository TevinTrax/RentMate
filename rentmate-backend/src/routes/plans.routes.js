import express from "express";
import { getPlans, createPlan, updatePlan, deletePlan } from "../controllers/plans.controller.js";

const router = express.Router();

// GET all plans
router.get("/", getPlans);

// POST new plan
router.post("/", createPlan);

// PUT update plan
router.put("/:id", updatePlan);

// DELETE plan
router.delete("/:id", deletePlan);

export default router;