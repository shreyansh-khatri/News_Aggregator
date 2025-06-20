import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import User from "../models/User";
import {
  HTTP_STATUS,
  DEFAULT_ROLE,
  TOKEN_EXPIRY,
  MESSAGES,
} from "../constants/constants";
import { JWT_SECRET } from "../app";

interface DecodedToken extends JwtPayload {
  id: string;
  email?: string;
  role?: string;
}

class AuthController {
  async registerUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { username, email, password, role } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: MESSAGES.USER_EXISTS });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        role: role || DEFAULT_ROLE,
      });

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY.REGISTER } as SignOptions
      );

      res.status(HTTP_STATUS.CREATED).json({
        message: MESSAGES.USER_REGISTERED,
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async loginUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      const isMatch = user && (await bcrypt.compare(password, user.password));

      if (!user || !isMatch) {
        res
          .status(HTTP_STATUS.UNAUTHORIZED)
          .json({ message: MESSAGES.INVALID_CREDENTIALS });
        return;
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY.LOGIN } as SignOptions
      );

      res.status(HTTP_STATUS.OK).json({
        token,
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async verifyToken(req: Request, res: Response): Promise<void> {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: MESSAGES.UNAUTHORIZED });
      return;
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
      const user = await User.findById(decoded.id);

      if (!user) {
        res
          .status(HTTP_STATUS.UNAUTHORIZED)
          .json({ message: MESSAGES.USER_NOT_FOUND });
        return;
      }

      res.status(HTTP_STATUS.OK).json({ valid: true });
    } catch {
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: MESSAGES.TOKEN_INVALID });
    }
  }
}

export default new AuthController();
