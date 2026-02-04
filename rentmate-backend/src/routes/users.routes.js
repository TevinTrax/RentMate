import express from "express";
import { createUserAdmin, createUserLandlord, createUserTenant } from "../controllers/users.controller.js";

const router = express.Router();

router.post("/admin", createUserAdmin);
router.post("/landlord", createUserLandlord);
router.post("/tenant", createUserTenant);

export default router;