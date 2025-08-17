import express from "express";
import {
  getAllAdminCurrencies,
  addAdminCurrency,
  updateAdminCurrency,
  deleteAdminCurrency,
} from "../controllers/setup/adminCurrency.js";
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken); 

router.get("/", getAllAdminCurrencies);
router.post("/", addAdminCurrency);
router.put("/:id", updateAdminCurrency);
router.delete("/:id", deleteAdminCurrency);

export default router;
