"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = exports.validateLogin = exports.validateRegister = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = __importDefault(require("../models/user"));
const jwt_1 = __importDefault(require("../config/jwt"));
const express_validator_1 = require("express-validator");
// Middleware for validation
exports.validateRegister = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid email address"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    (0, express_validator_1.body)("name").notEmpty().withMessage("Name is required"),
    (0, express_validator_1.body)("phone")
        .isLength({ min: 10 })
        .withMessage("Phone number must be at least 10 characters long")
        .optional(), // Make phone optional if not always provided
];
// Middleware for login validation
exports.validateLogin = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid email address"),
    (0, express_validator_1.body)("password").exists().withMessage("Password is required"),
];
// Helper function to handle validation errors
const handleValidationErrors = (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    return null;
};
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validationError = handleValidationErrors(req, res);
    if (validationError)
        return validationError;
    const { email, password, name, phone } = req.body;
    try {
        // Check if user already exists
        const existingUser = yield user_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Hash password and create user
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = new user_1.default({ email, password: hashedPassword, name, phone });
        yield user.save();
        // Generate token
        const token = (0, jwt_1.default)(user._id);
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
    }
    catch (error) {
        console.error("Registration error:", error.message);
        res
            .status(500)
            .json({ message: "Server error", error: error.message });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validationError = handleValidationErrors(req, res);
    if (validationError)
        return validationError;
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = yield user_1.default.findOne({ email }).select("+password"); // Include password in the query
        if (!user || !(yield bcryptjs_1.default.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // Generate token and respond
        const token = (0, jwt_1.default)(user._id);
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
    }
    catch (error) {
        console.error("Login error:", error.message);
        res
            .status(500)
            .json({ message: "Server error", error: error.message });
    }
});
exports.login = login;
