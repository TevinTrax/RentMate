import express from "express";
import upload from "../middlewares/upload.js";
import { addProperty, getMyProperties, getPropertyById, getAllProperties } from "../controllers/properties.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js"; // JWT verification middleware

const router = express.Router();

// POST /api/properties/add
// Protected route: only logged-in landlords can add properties
router.post(
  "/add",
  verifyToken, // ensures req.user is populated with landlord info from JWT
  upload.fields([
    { name: "image_url", maxCount: 1 },
    { name: "documents", maxCount: 1 }
  ]),
  addProperty
);
router.get("/myproperties", verifyToken, getMyProperties);
router.get("/allproperties", verifyToken, getAllProperties);
router.get("/:id", verifyToken, getPropertyById);

export default router;