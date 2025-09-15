import express from "express";
import {
  createClient,
//   updateClient,
  getClientById,
  deleteClient,
  getAllClients,
} from "../controllers/client/clientDetails.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import {
  createClientSchema,
  updateClientSchema,
  deleteClientSchema,
  getClientSchema,
} from "../validators/client.schema.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/", validate(createClientSchema), createClient);
// router.put("/:id", validate(updateClientSchema), updateClient);
router.get("/:id", validate(getClientSchema), getClientById);
router.get("/", getAllClients);
router.delete("/:id", validate(deleteClientSchema), deleteClient);

export default router;
