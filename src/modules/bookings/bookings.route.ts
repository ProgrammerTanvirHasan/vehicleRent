import { Router } from "express";
import { bookingsController } from "./bookings.controller";
import auth from "../../middleware/auth";
import { requireCustomerOrAdmin } from "../../middleware/role";

const router = Router();

router.post(
  "/",
  auth(),
  requireCustomerOrAdmin(),
  bookingsController.createBooking
);

router.get(
  "/",
  auth(),
  requireCustomerOrAdmin(),
  bookingsController.getAllBookings
);

router.get(
  "/:bookingId",
  auth(),
  requireCustomerOrAdmin(),
  bookingsController.getBookingById
);

router.put(
  "/:bookingId",
  auth(),
  requireCustomerOrAdmin(),
  bookingsController.updateBooking
);

export const bookingsRouter = router;
