import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user"; // Import the User model
import { IUser } from "../types/user"; // Import the IUser type

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // Use the IUser type here
    }
  }
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: "Authorization token is missing or improperly formatted.",
    });
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;

    // Optionally, check if the user exists
    const user = (await User.findById(payload.userId)) as IUser; // Type assertion here
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "User associated with this token no longer exists.",
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (err) {
    console.error("Token verification error:", err);

    // Distinguish between different JWT errors
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        status: "error",
        message: "Invalid or malformed token.",
      });
    } else if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        status: "error",
        message: "Token has expired. Please authenticate again.",
      });
    } else {
      return res.status(401).json({
        status: "error",
        message: "Authentication error. Please try again.",
      });
    }
  }
};

export default authMiddleware;
