import express from "express";
import {
  addContactPerson,
  getAllContactPersons,
  getContactPersonById,
  updateContactPerson,
  deleteContactPerson,
} from "../controllers/client/clientContactPerson.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import {
  createContactPersonSchema,
  getAllContactPersonsSchema,
  getContactPersonSchema,
  updateContactPersonSchema,
  deleteContactPersonSchema,
} from "../validators/clientContactPerson.schema.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/", validate(createContactPersonSchema), addContactPerson);
router.get("/", validate(getAllContactPersonsSchema), getAllContactPersons);
router.get("/:id", validate(getContactPersonSchema), getContactPersonById);
router.put("/:id", validate(updateContactPersonSchema), updateContactPerson);
router.delete("/:id", validate(deleteContactPersonSchema), deleteContactPerson);

export default router;