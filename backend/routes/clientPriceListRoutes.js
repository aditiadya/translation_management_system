import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";

import {
  createClientPrice,
  getAllClientPrices,
  getClientPriceById,
  updateClientPrice,
  deleteClientPrice,
  getClientPriceListForClient,
  getServicesWithPriceList,
  getLanguagePairsWithPriceList,
  getCurrenciesWithPriceList,
} from "../controllers/client/clientPriceList.js";

const router = express.Router();
router.use(authenticateToken);


router.post("/", createClientPrice);
router.get("/", getAllClientPrices);

router.get("/client/:id/price-list", getClientPriceListForClient);
router.get("/client/:id/services", getServicesWithPriceList);
router.get("/client/:id/language-pairs", getLanguagePairsWithPriceList);
router.get("/client/:id/currencies", getCurrenciesWithPriceList);

router.get("/:id", getClientPriceById);
router.put("/:id", updateClientPrice);
router.delete("/:id", deleteClientPrice);

export default router;
