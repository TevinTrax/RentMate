import express from "express";
import { createUserAdmin, createUserLandlord } from "../controllers/users.controller.js";

const router = express.Router();

router.post("/admin", createUserAdmin);
router.post("/landlord", createUserLandlord);

export default router;