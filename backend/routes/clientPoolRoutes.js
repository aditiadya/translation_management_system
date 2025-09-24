import express from "express";
import {
  createClientPool,
  updateClientPool,
  getClientPoolById,
  deleteClientPool,
  getAllClientPools,
} from "../controllers/client/clientPools.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import {
  createClientPoolSchema,
  updateClientPoolSchema,
  deleteClientPoolSchema,
  getClientPoolSchema,
} from "../validators/clientPools.schema.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/", validate(createClientPoolSchema), createClientPool);
router.put("/:id", validate(updateClientPoolSchema), updateClientPool);
router.get("/:id", validate(getClientPoolSchema), getClientPoolById);
router.get("/", getAllClientPools);
router.delete("/:id", validate(deleteClientPoolSchema), deleteClientPool);

export default router;
