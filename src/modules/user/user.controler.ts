import { Request, Response } from "express";

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
    const userIdToUpdate = Number(req.params.id);
    const user = req.body;
    const data = req.body;

    if (user.role !== "admin" && user.id !== userIdToUpdate) {
      return res.status(403).json({
        message: "You are not allowed to update another user’s profile",
      });
    }

    if (user.role !== "admin" && data.role) {
      return res.status(403).json({
        message: "You are not allowed to change your role",
      });
    }

    const updatedUser = await userService.updateUser(userIdToUpdate, data);

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    return res.status(500).json({
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
      .json({ success: true, message: "User deleted", data: deletedUser });
  } catch (error: any) {
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
