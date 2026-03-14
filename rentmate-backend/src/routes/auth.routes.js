import express from "express";
import {loginUser, approveLandlord} from "../controllers/auth.controller.js"

const router= express.Router();

router.post("/login", loginUser);
router.put("/approve-landlord/:id", approveLandlord);

export default router;