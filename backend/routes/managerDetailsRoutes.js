import express from "express";
import {
  createManager,
  updateManager,
  getManagerById,
  deleteManager,
  getAllManagers,
} from "../controllers/manager/managerDetails.js";
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { validate } from "../middlewares/validate.js";
import { createManagerSchema, updateManagerSchema, deleteManagerSchema, getManagerSchema } from "../validators/manager.schema.js";

const router = express.Router();

router.use(authenticateToken);

router.post('/', validate(createManagerSchema), createManager);
router.put("/:id", validate(updateManagerSchema), updateManager);
router.get("/:id", validate(getManagerSchema), getManagerById);
router.get("/", getAllManagers);
router.delete("/:id", validate(deleteManagerSchema), deleteManager);

export default router;