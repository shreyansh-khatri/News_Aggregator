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

class AuthService {
  async registerUser(
    username: string,
    email: string,
    password: string,
    role?: string
  ) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw { status: HTTP_STATUS.BAD_REQUEST, message: MESSAGES.USER_EXISTS };
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

    return {
      message: MESSAGES.USER_REGISTERED,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  async loginUser(email: string, password: string) {
    const user = await User.findOne({ email });
    const isMatch = user && (await bcrypt.compare(password, user.password));

    if (!user || !isMatch) {
      throw {
        status: HTTP_STATUS.UNAUTHORIZED,
        message: MESSAGES.INVALID_CREDENTIALS,
      };
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY.LOGIN } as SignOptions
    );

    return {
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    };
  }

  async verifyToken(token: string) {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    const user = await User.findById(decoded.id);

    if (!user) {
      throw {
        status: HTTP_STATUS.UNAUTHORIZED,
        message: MESSAGES.USER_NOT_FOUND,
      };
    }

    return { valid: true };
  }
}

export default new AuthService();
