import { Request, Response } from "express";
import { bookingsService } from "./bookings.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const { vehicle_id, rent_start_date, rent_end_date } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!vehicle_id || !rent_start_date || !rent_end_date) {
      return res.status(400).json({
        success: false,
        message: "vehicle_id, rent_start_date, and rent_end_date are required",
      });
    }

    const startDate = new Date(rent_start_date);
    const endDate = new Date(rent_end_date);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: "rent_end_date must be after rent_start_date",
      });
    }

    const booking = await bookingsService.createBooking({
      customer_id: user.id,
      vehicle_id: Number(vehicle_id),
      rent_start_date,
      rent_end_date,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error: any) {
    if (
      error.message === "Vehicle not found" ||
      error.message === "Vehicle is not available" ||
      error.message === "Vehicle is already booked for the selected dates" ||
      error.message === "Rent start date cannot be in the past" ||
      error.message === "Rent end date must be after start date"
    ) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const bookings = await bookingsService.getAllBookings(user.id, user.role);

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBookingById = async (req: Request, res: Response) => {
  try {
    const bookingId = Number(req.params.bookingId);
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const booking = await bookingsService.getBookingById(
      bookingId,
      user.id,
      user.role
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = Number(req.params.bookingId);
    const { action } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!action || (action !== "cancel" && action !== "return")) {
      return res.status(400).json({
        success: false,
        message: "action must be 'cancel' or 'return'",
      });
    }

    if (action === "cancel" && user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Only customers can cancel bookings",
      });
    }

    if (action === "return" && user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can mark bookings as returned",
      });
    }

    const booking = await bookingsService.updateBooking(
      bookingId,
      action,
      user.id,
      user.role
    );

    res.status(200).json({
      success: true,
      message: `Booking ${
        action === "cancel" ? "cancelled" : "marked as returned"
      } successfully`,
      data: booking,
    });
  } catch (error: any) {
    if (
      error.message === "Booking not found" ||
      error.message === "Cannot cancel booking after start date" ||
      error.message === "Only active bookings can be cancelled" ||
      error.message === "Only active bookings can be marked as returned" ||
      error.message === "Only customers can cancel bookings" ||
      error.message === "Only admin can mark bookings as returned"
    ) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const bookingsController = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
};
