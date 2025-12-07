import { Router } from "express";
import { authController } from "./auth.controler";

const router = Router();
router.post("/login", authController.authControllerFun);

export const authRouter = router;
