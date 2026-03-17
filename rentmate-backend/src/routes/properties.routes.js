import express from "express";
import upload from "../middlewares/upload.js";
import { addProperty, getMyProperties, getPropertyById, getAllProperties, downloadOwnershipDocument, deleteProperty, updateProperty, postProperty, getMyPostedProperties, getPostedPropertiesPublic,  getPendingProperties, approveProperty, rejectProperty} from "../controllers/properties.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js"; // JWT verification middleware
import { requireRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/postedproperties", getPostedPropertiesPublic); // PUBLIC
router.get("/myproperties", verifyToken, getMyProperties);
router.get("/mypostedproperties", verifyToken, getMyPostedProperties);
router.get("/allproperties", verifyToken, requireRole("admin"), getAllProperties);
// Only admins can fetch pending properties
router.get("/pending", verifyToken, requireRole("admin"), getPendingProperties);

router.post(
  "/add",
  verifyToken,
  upload.fields([
    { name: "image_url", maxCount: 1 },
    { name: "documents", maxCount: 1 }
  ]),
  addProperty
);
router.post("/post-property",
   verifyToken,
   upload.fields([
    { name: "image_url", maxCount: 1 },
    { name: "documents", maxCount: 1 }
  ]),
  postProperty
);

// Approve property
router.put("/approve-property/:id", verifyToken, approveProperty);

// Reject property
router.put("/reject-property/:id", verifyToken, rejectProperty);

// Dynamic routes at the bottom
router.get("/:id/download", verifyToken, downloadOwnershipDocument);
router.get("/:id", verifyToken, getPropertyById);
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

export default router;