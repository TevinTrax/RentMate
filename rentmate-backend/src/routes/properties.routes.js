import express from "express";
import upload from "../middlewares/upload.js";
import { addProperty, getMyProperties, getPropertyById, getAllProperties, downloadOwnershipDocument, deleteProperty, updateProperty, postProperty, getMyPostedProperties } from "../controllers/properties.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js"; // JWT verification middleware
import { requireRole } from "../middlewares/auth.middleware.js";

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
router.get("/allproperties", verifyToken, requireRole("admin"), getAllProperties);
router.get("/:id", verifyToken, getPropertyById);
router.get("/:id/download", verifyToken, downloadOwnershipDocument);
router.delete("/:id", verifyToken, deleteProperty);
router.put(
  "/:id",
  verifyToken,
  upload.fields([
    { name: "image_url", maxCount: 1 },
    { name: "documents", maxCount: 1 }
  ]),
  updateProperty
);

router.post(
  "/post-property",
  verifyToken,
  // requireRole(["admin", "Landlord"]), // pass roles as an array
  upload.fields([
    { name: "image_url", maxCount: 1 },
    { name: "documents", maxCount: 1 }
  ]),
  postProperty
);


router.get("/mypostedproperties", verifyToken, getMyPostedProperties);

export default router;