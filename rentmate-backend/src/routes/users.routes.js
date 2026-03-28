import express from "express";
import { createUserAdmin, createUserLandlord, createUserTenant, fetchUsers, getProfile, registerUser, updateUser, getLandlordTenants, updateTenantApprovalStatus, getPendingTenants, getApprovedTenant, deleteUser} from "../controllers/users.controller.js";
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/admin",  createUserAdmin);
router.post("/register", registerUser);
router.post("/landlord",createUserLandlord);
router.post("/tenant",createUserTenant);
router.get("/",verifyToken, requireRole("admin"), fetchUsers);
router.get("/profile", verifyToken, getProfile);
router.put("/:id", verifyToken, requireRole("admin"), updateUser);

// GET pending tenants for logged-in landlord
router.get("/landlord/pending-tenants", verifyToken, requireRole("Landlord"), getPendingTenants);
router.get("/landlord/landlord-tenants", verifyToken, getLandlordTenants);
router.patch("/tenant/:tenantId/Tenant-Status", verifyToken, updateTenantApprovalStatus);
router.get("/tenant/approved", verifyToken, getApprovedTenant);

// Delete user
router.delete("/delete-users/:id", verifyToken, requireRole("admin"), deleteUser);

export default router;