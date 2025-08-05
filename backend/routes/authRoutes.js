import express from 'express';
import { signup, login, refreshToken, logout } from '../controllers/admin/authController.js';
import { validateSignup } from '../middlewares/validateSignup.js';
import { validateLogin } from '../middlewares/validateLogin.js';

const router = express.Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

export default router;
