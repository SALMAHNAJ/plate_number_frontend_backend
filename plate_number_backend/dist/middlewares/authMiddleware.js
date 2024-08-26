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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).json({
            status: "error",
            message: "Authorization token is missing or improperly formatted.",
        });
    }
    const token = authorization.replace("Bearer ", "");
    console.log("Token received:", token);
    console.log("Secret received:", process.env.JWT_SECRET);
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log("Token payload:", payload);
        // Optionally, check if the user exists
        const user = yield user_1.default.findById(payload.userId);
        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "User associated with this token no longer exists.",
            });
        }
        // Attach user to request object
        req.user = user;
        console.log(req.user);
        next();
    }
    catch (err) {
        console.error("Token verification error:", err);
        // Distinguish between different JWT errors
        if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json({
                status: "error",
                message: "Invalid or malformed token.",
            });
        }
        else if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(401).json({
                status: "error",
                message: "Token has expired. Please authenticate again.",
            });
        }
        else {
            return res.status(401).json({
                status: "error",
                message: "Authentication error. Please try again.",
            });
        }
    }
});
exports.default = authMiddleware;
