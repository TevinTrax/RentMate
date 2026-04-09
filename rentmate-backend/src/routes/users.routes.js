import express from "express";
import { createUserAdmin, createUserLandlord, createUserTenant, fetchUsers, getProfile, registerUser, updateUser, getLandlordTenants, updateTenantApprovalStatus, getPendingTenants, getApprovedTenant, deleteUser, getLandlordOccupancyOverview} from "../controllers/users.controller.js";
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/admin",verifyToken, requireRole("Admin"),  createUserAdmin);
router.post("/register",verifyToken, requireRole("Admin"), registerUser);
router.post("/landlord",createUserLandlord);
router.post("/tenant",createUserTenant);
router.get("/",verifyToken, requireRole("Admin"), fetchUsers);
router.get("/profile", verifyToken, getProfile);
router.put("/:id", verifyToken, requireRole("Admin"), updateUser);

// GET pending tenants for logged-in landlord
router.get("/landlord/pending-tenants", verifyToken, requireRole("Landlord"), getPendingTenants);
router.get("/landlord/landlord-tenants", verifyToken, getLandlordTenants);
router.patch("/tenant/:tenantId/Tenant-Status", verifyToken, updateTenantApprovalStatus);
router.get("/tenant/approved", verifyToken, getApprovedTenant);
router.get("/landlord/occupancy-overview", verifyToken, requireRole("Landlord"), getLandlordOccupancyOverview);

// Delete user
router.delete("/delete-users/:id", verifyToken, requireRole("Admin"), deleteUser);

export default router;