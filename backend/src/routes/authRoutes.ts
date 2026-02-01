// main router
import { Router } from "express";
import * as authController from "../modules/auth/authController";
import { userValidator, validateRequest } from "../middlewares/authUserValidator";
const router = Router();

router.post("/register", userValidator, validateRequest, authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

export default router;