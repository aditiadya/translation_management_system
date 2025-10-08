import express from "express";
import {
  getAllPaymentMethods,
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from "../controllers/setup/adminPaymentMethod.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import {
  createPaymentMethodSchema,
  updatePaymentMethodSchema,
  deletePaymentMethodSchema,
} from "../validators/adminPaymentMethods.schema.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", getAllPaymentMethods);
router.post("/", validate(createPaymentMethodSchema), addPaymentMethod);
router.put("/:id", validate(updatePaymentMethodSchema), updatePaymentMethod);
router.delete("/:id", validate(deletePaymentMethodSchema), deletePaymentMethod);

export default router;