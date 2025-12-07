import { NextFunction, Request, Response } from "express";

export const requireAdmin = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }

    next();
  };
};

export const requireCustomerOrAdmin = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== "admin" && req.user.role !== "customer") {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    next();
  };
};

