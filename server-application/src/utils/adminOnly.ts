import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../utils/authMiddleware";

const adminOnly = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "admin") {
     res.status(403).json({ message: "Admin access only" });
     return;
  }
  next();
};

export default adminOnly;
