import express from "express";
import {
  getAllAdminCurrencies,
  addAdminCurrency,
  updateAdminCurrency,
  deleteAdminCurrency,
} from "../controllers/setup/adminCurrency.js";
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { validate } from "../middlewares/validate.js";
import { createAdminCurrencySchema, updateAdminCurrencySchema } from "../validators/adminCurrency.schema.js";

const router = express.Router();

router.use(authenticateToken); 

router.get("/", getAllAdminCurrencies);
router.post("/", validate(createAdminCurrencySchema), addAdminCurrency);
router.put("/:id", validate(updateAdminCurrencySchema), updateAdminCurrency);
router.delete("/:id", deleteAdminCurrency);

export default router;
