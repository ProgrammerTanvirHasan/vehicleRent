import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";

const auth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      const decoded = jwt.verify(token, config.SECRET_KEY as string);

      req.user = decoded as any;

      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};
export default auth;
