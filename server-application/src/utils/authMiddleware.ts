import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

interface AuthenticatedRequest extends Request {
  user?: { id: string; email?: string ;role?:string};
}

const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
     res.status(401).json({ message: "Unauthorized" });
     return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(decoded.id);

    if (!user) {
       res.status(401).json({ message: "User not found" });
       return;
    }

    req.user = { id: (user._id as any).toString(), email: user.email,role:user.role };
    next(); 
  } catch (err) {
     res.status(401).json({ message: "Invalid token" });
     return;
  }
};

export default authMiddleware;
export type { AuthenticatedRequest };
