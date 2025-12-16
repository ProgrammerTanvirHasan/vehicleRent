import { Router } from "express";
import { userControler } from "./user.controler";
import auth from "../../middleware/auth";
import { requireAdmin } from "../../middleware/role";

const router = Router();

router.get("/", auth(), requireAdmin(), userControler.getAllUsers);

router.put("/:userId", auth(), userControler.updateUserController);
router.delete("/:userId", auth(), requireAdmin(), userControler.deleteUser);

export const userRouter = router;
