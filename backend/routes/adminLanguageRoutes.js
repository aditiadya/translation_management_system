import express from 'express';
import {
  getAllLanguagePairs,
  addLanguagePair,
  updateLanguagePair,
  deleteLanguagePair
} from '../controllers/setup/adminLanguagePair.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { createAdminLanguagePairSchema, updateAdminLanguagePairSchema } from '../validators/adminLanguagePair.schema.js';


const router = express.Router();

router.use(authenticateToken); 

router.get('/', getAllLanguagePairs);
router.post('/', validate(createAdminLanguagePairSchema), addLanguagePair);
router.put('/:id', validate(updateAdminLanguagePairSchema), updateLanguagePair);
router.delete('/:id', deleteLanguagePair);

export default router;
