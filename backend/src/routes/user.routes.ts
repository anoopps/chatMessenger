import { Router } from "express";
import authenticateToken from "../middlewares/authenticateToken";
import * as userController from "../modules/user/userController";

const router = Router();

router.get("/", authenticateToken, userController.getUserData);
router.put("/", authenticateToken, userController.updateUserData);
router.delete("/", authenticateToken, userController.disableUser);

export default router;