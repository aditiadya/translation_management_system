import express from 'express';
import {
  getAllServices,
  addService,
  updateService,
  deleteService,
} from '../controllers/setup/adminService.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { createAdminServiceSchema, updateAdminServiceSchema } from '../validators/adminService.schema.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllServices);
router.post('/', validate(createAdminServiceSchema), addService);
router.put('/:id', validate(updateAdminServiceSchema), updateService);
router.delete('/:id', deleteService);

export default router;  
