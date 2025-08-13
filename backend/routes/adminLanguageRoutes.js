import express from 'express';
import {
  getAllLanguagePairs,
  addLanguagePair,
  updateLanguagePair,
  deleteLanguagePair
} from '../controllers/setup/adminLanguagePair.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken); 

router.get('/', getAllLanguagePairs);
router.post('/', addLanguagePair);
router.put('/:id', updateLanguagePair);
router.delete('/:id', deleteLanguagePair);

export default router;
