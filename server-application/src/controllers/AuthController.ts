import { Request, Response, NextFunction } from "express";
import AuthService from "../services/AuthService";
import { HTTP_STATUS, MESSAGES } from "../constants/constants";

class AuthController {
  async registerUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { username, email, password, role } = req.body;
      const result = await AuthService.registerUser(
        username,
        email,
        password,
        role
      );
      res.status(HTTP_STATUS.CREATED).json(result);
    } catch (err: any) {
      res
        .status(err.status || HTTP_STATUS.SERVER_ERROR)
        .json({ message: err.message || "Registration failed" });
    }
  }

  async loginUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await AuthService.loginUser(email, password);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (err: any) {
      res
        .status(err.status || HTTP_STATUS.SERVER_ERROR)
        .json({ message: err.message || "Login failed" });
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
      const result = await AuthService.verifyToken(token);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (err: any) {
      res
        .status(err.status || HTTP_STATUS.UNAUTHORIZED)
        .json({ message: err.message || MESSAGES.TOKEN_INVALID });
    }
  }
}

export default new AuthController();
