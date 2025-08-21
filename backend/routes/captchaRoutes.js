import express from "express";
import { verifyCaptcha } from "../controllers/captcha/captchaController";

const router = express.Router();

router.post("/verify-captcha", verifyCaptcha);

export default router;
