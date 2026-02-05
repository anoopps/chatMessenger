// main router
import { Router } from "express";
import * as authController from "../modules/auth/authController";
import { userValidator, validateRequest, loginValidator } from "../middlewares/authUserValidator";
import authenticateToken from "../middlewares/authenticateToken";
const router = Router();

router.post("/register", authenticateToken, userValidator, validateRequest, authController.register);
router.post("/login", loginValidator, validateRequest, authController.login);
router.post("/logout", authController.logout);

export default router;