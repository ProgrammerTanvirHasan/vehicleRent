import { Request, Response } from "express";
import { vehicelsService } from "./vehicels.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    } = req.body;

    if (!vehicle_name || !type || !registration_number || !daily_rent_price) {
      return res.status(400).json({
        success: false,
        message:
          "vehicle_name, type, registration_number, and daily_rent_price are required",
      });
    }

    if (!["car", "bike", "van", "SUV"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "type must be one of: car, bike, van, SUV",
      });
    }

    if (daily_rent_price <= 0) {
      return res.status(400).json({
        success: false,
        message: "daily_rent_price must be positive",
      });
    }

    const vehicle = await vehicelsService.createVehicle({
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    });

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: vehicle,
    });
  } catch (error: any) {
    if (error.message === "Registration number already exists") {
      return res.status(409).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await vehicelsService.getAllVehicles();
    res.status(200).json({
      success: true,
      data: vehicles,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getVehicleById = async (req: Request, res: Response) => {
  try {
    const vehicleId = Number(req.params.vehicleId);
    const vehicle = await vehicelsService.getVehicleById(vehicleId);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleId = Number(req.params.vehicleId);
    const data = req.body;

    if (data.type && !["car", "bike", "van", "SUV"].includes(data.type)) {
      return res.status(400).json({
        success: false,
        message: "type must be one of: car, bike, van, SUV",
      });
    }

    if (
      data.availability_status &&
      !["available", "booked"].includes(data.availability_status)
    ) {
      return res.status(400).json({
        success: false,
        message: "availability_status must be 'available' or 'booked'",
      });
    }

    if (data.daily_rent_price !== undefined && data.daily_rent_price <= 0) {
      return res.status(400).json({
        success: false,
        message: "daily_rent_price must be positive",
      });
    }

    const vehicle = await vehicelsService.updateVehicle(vehicleId, data);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: vehicle,
    });
  } catch (error: any) {
    if (error.message === "Registration number already exists") {
      return res.status(409).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleId = Number(req.params.vehicleId);
    const vehicle = await vehicelsService.deleteVehicle(vehicleId);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
      data: vehicle,
    });
  } catch (error: any) {
    if (error.message === "Cannot delete vehicle with active bookings") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const vehicelsController = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
