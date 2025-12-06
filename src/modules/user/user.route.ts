import { Router } from "express";
import { userControler } from "./user.controler";

const router = Router();

router.post("/", userControler.createUser);
router.get("/", userControler.getAllUsers);
router.get("/:userId", userControler.getUserById);
router.delete("/:userId", userControler.deleteUser);
export const userRouter = router;
