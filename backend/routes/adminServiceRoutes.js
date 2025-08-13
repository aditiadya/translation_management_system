import express from 'express';
import {
  getAllServices,
  getServiceById,
  addService,
  updateService,
  deleteService,
} from '../controllers/setup/adminService.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';


const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.post('/', addService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);

export default router;  
