import express from "express";
import { createUserAdmin, createUserLandlord, createUserTenant, fetchUsers, getProfile, registerUser, updateUser} from "../controllers/users.controller.js";
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/admin", verifyToken, requireRole("admin"), createUserAdmin);
router.post("/register", registerUser);
router.post("/landlord",verifyToken, createUserLandlord);
router.post("/tenant",verifyToken, createUserTenant);
router.get("/",verifyToken, requireRole("admin"), fetchUsers);
router.get("/profile", verifyToken, getProfile);
router.put("/:id", verifyToken, requireRole("admin"), updateUser);

export default router;