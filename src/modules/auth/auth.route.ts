import { Router } from "express";
import { authController } from "./auth.controler";

const router = Router();
router.post("/signup", authController.signupController);
router.post("/signin", authController.signinController);

export const authRouter = router;
