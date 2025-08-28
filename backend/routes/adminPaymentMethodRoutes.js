import express from "express";
import {
  getAllPaymentMethods,
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from "../controllers/setup/adminPaymentMethod.js";
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { validate } from "../middlewares/validate.js";
import { createAdminPaymentMethodSchema, updateAdminPaymentMethodSchema } from "../validators/adminPaymentMethods.schema.js";


const router = express.Router();

router.use(authenticateToken); 

router.get("/", getAllPaymentMethods);
router.post("/", validate(createAdminPaymentMethodSchema), addPaymentMethod);
router.put("/:id", validate(updateAdminPaymentMethodSchema), updatePaymentMethod);
router.delete("/:id", deletePaymentMethod);

export default router;
