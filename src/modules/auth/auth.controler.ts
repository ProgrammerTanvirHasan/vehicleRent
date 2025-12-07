import { Request, Response } from "express";
import { authService } from "./auth.service";

const authControllerFun = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await authService.authServiceFun(email, password);

    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
  }
};

export const authController = {
  authControllerFun,
};
