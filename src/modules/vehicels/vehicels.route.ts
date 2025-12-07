import { Router } from "express";
import { vehicelsController } from "./vehicels.controler";
import auth from "../../middleware/auth";
import { requireAdmin } from "../../middleware/role";

const router = Router();

router.get("/", vehicelsController.getAllVehicles);
router.get("/:vehicleId", vehicelsController.getVehicleById);

router.post("/", auth(), requireAdmin(), vehicelsController.createVehicle);
router.put(
  "/:vehicleId",
  auth(),
  requireAdmin(),
  vehicelsController.updateVehicle
);
router.delete(
  "/:vehicleId",
  auth(),
  requireAdmin(),
  vehicelsController.deleteVehicle
);

export const vehicelsRouter = router;
