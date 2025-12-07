import { Request, Response } from "express";
import { pool } from "../../database/db";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUserService(req.body);
    return res.status(201).json({
      success: true,
      message: "user created successfullt",
      data: result.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(Number(req.params.userId));
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUserController = async (req: Request, res: Response) => {
  try {
    const userIdToUpdate = Number(req.params.userId);
    const user = req.user;
    const data = req.body;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Check authorization: Admin can update anyone, Customer can only update themselves
    if (user.role !== "admin" && user.id !== userIdToUpdate) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update another user's profile",
      });
    }

    // Only admin can change roles
    if (user.role !== "admin" && data.role) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to change your role",
      });
    }

    // If email is being updated, check for duplicates
    if (data.email) {
      const emailCheck = await pool.query(
        `SELECT id FROM users WHERE email = $1 AND id != $2`,
        [data.email.toLowerCase(), userIdToUpdate]
      );
      if (emailCheck.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }
      data.email = data.email.toLowerCase();
    }

    const updatedUser = await userService.updateUser(userIdToUpdate, data);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const deletedUser = await userService.deleteUser(Number(req.params.userId));
    if (!deletedUser)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully", data: deletedUser });
  } catch (error: any) {
    if (error.message === "Cannot delete user with active bookings") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const userControler = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserController,
  deleteUser,
};
