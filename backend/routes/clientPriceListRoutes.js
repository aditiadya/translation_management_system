import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";

import {
  createClientPrice,
  getAllClientPrices,
  getClientPriceById,
  updateClientPrice,
  deleteClientPrice,
} from "../controllers/client/clientPriceList.js";

const router = express.Router();
router.use(authenticateToken);


router.post("/", createClientPrice);
router.get("/", getAllClientPrices);
router.get("/:id", getClientPriceById);
router.put("/:id", updateClientPrice);
router.delete("/:id", deleteClientPrice);

export default router;
