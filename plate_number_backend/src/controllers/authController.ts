import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user";
import generateToken from "../config/jwt";
import { body, validationResult } from "express-validator";

// Middleware for validation
export const validateRegister = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("name").notEmpty().withMessage("Name is required"),
  body("phone")
    .isLength({ min: 10 })
    .withMessage("Phone number must be at least 10 characters long")
    .optional(), // Make phone optional if not always provided
];

// Middleware for login validation
export const validateLogin = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").exists().withMessage("Password is required"),
];

// Helper function to handle validation errors
const handleValidationErrors = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return null;
};

export const register = async (req: Request, res: Response) => {
  const validationError = handleValidationErrors(req, res);
  if (validationError) return validationError;

  const { email, password, name, phone } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, name, phone });
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Respond with user details (excluding password) and success message
    res.status(201).json({
      message: "User registered successfully",
      user: {
        email: user.email,
        name: user.name,
        phone: user.phone,
        _id: user._id,
      },
      token,
    });
  } catch (error: any) {
    console.error("Registration error:", (error as Error).message);
    res
      .status(500)
      .json({ message: "Server error", error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  const validationError = handleValidationErrors(req, res);
  if (validationError) return validationError;

  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email }).select("+password"); // Include password in the query
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token and respond
    const token = generateToken(user._id);
    res.json({
      message: "Login successful",
      user: {
        email: user.email,
        name: user.name,
        phone: user.phone,
        _id: user._id,
      },
      token,
    });
  } catch (error: unknown) {
    console.error("Login error:", (error as Error).message);
    res
      .status(500)
      .json({ message: "Server error", error: (error as Error).message });
  }
};
