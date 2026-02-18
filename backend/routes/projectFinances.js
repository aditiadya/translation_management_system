import express from "express";
import {
  createFlatRateReceivable,
  getAllFlatRateReceivables,
  getFlatRateReceivableById,
  updateFlatRateReceivable,
  deleteFlatRateReceivable,
} from "../controllers/project/flatRateReceivables.js";

import {
  createUnitBasedReceivable,
  getAllUnitBasedReceivables,
  getUnitBasedReceivableById,
  updateUnitBasedReceivable,
  deleteUnitBasedReceivable,
} from "../controllers/project/unitBasedReceivables.js";

import { getMergedReceivables } from "../controllers/project/mergedReceivables.js";

import {
  createFlatRatePayable,
  getAllFlatRatePayables,
  getFlatRatePayableById,
  updateFlatRatePayable,
  deleteFlatRatePayable,
} from "../controllers/project/flatRatePayables.js";

import {
  createUnitBasedPayable,
  getAllUnitBasedPayables,
  getUnitBasedPayableById,
  updateUnitBasedPayable,
  deleteUnitBasedPayable,
} from "../controllers/project/unitBasedPayables.js";

import { getMergedPayables } from "../controllers/project/mergedPayables.js";

import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateToken);

// ============ FLAT RATE RECEIVABLES ============
router.post("/flat-rate-receivables", createFlatRateReceivable);
router.get("/flat-rate-receivables", getAllFlatRateReceivables);
router.get("/flat-rate-receivables/:id", getFlatRateReceivableById);
router.put("/flat-rate-receivables/:id", updateFlatRateReceivable);
router.delete("/flat-rate-receivables/:id", deleteFlatRateReceivable);

// ============ UNIT BASED RECEIVABLES ============
router.post("/unit-based-receivables", createUnitBasedReceivable);
router.get("/unit-based-receivables", getAllUnitBasedReceivables);
router.get("/unit-based-receivables/:id", getUnitBasedReceivableById);
router.put("/unit-based-receivables/:id", updateUnitBasedReceivable);
router.delete("/unit-based-receivables/:id", deleteUnitBasedReceivable);

// ============ MERGED RECEIVABLES ============
router.get("/receivables/merged", getMergedReceivables);

// ============ FLAT RATE PAYABLES ============
router.post("/flat-rate-payables", createFlatRatePayable);
router.get("/flat-rate-payables", getAllFlatRatePayables);
router.get("/flat-rate-payables/:payableId", getFlatRatePayableById);
router.put("/flat-rate-payables/:payableId", updateFlatRatePayable);
router.delete("/flat-rate-payables/:payableId", deleteFlatRatePayable);

// ============ UNIT BASED PAYABLES ============
router.post("/unit-based-payables", createUnitBasedPayable);
router.get("/unit-based-payables", getAllUnitBasedPayables);
router.get("/unit-based-payables/:payableId", getUnitBasedPayableById);
router.put("/unit-based-payables/:payableId", updateUnitBasedPayable);
router.delete("/unit-based-payables/:payableId", deleteUnitBasedPayable);

// ============ MERGED PAYABLES ============
router.get("/payables/merged", getMergedPayables);

export default router;