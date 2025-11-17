import express from "express";
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { getManagerRoles, getManagerRoleById } from "../controllers/roles/managerRoles.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", getManagerRoles);
router.get("/:id", getManagerRoleById);

export default router;