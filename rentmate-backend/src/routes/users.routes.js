import express from "express";
import { createUserAdmin, createUserLandlord, createUserTenant, fetchUsers, getProfile, registerUser} from "../controllers/users.controller.js";
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/admin", verifyToken, requireRole("admin"), createUserAdmin);
router.post("/register", registerUser);
router.post("/landlord", createUserLandlord);
router.post("/tenant", createUserTenant);
router.get("/", fetchUsers);
router.get("/profile", verifyToken, getProfile);

export default router;