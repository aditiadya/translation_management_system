import express from "express";
import {
  getAdminDetailsById,
  updateAdminDetails,
  deleteAdminDetails,
} from "../controllers/admin/adminDetails.js";
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { validate } from "../middlewares/validate.js";
import { adminDetailsUpdateSchema } from "../validators/adminDetails.schema.js";

const router = express.Router();

router.use(authenticateToken); 

router.get("/", getAdminDetailsById);     
router.put("/", validate(adminDetailsUpdateSchema), updateAdminDetails);     
router.delete("/", deleteAdminDetails);  

export default router;
