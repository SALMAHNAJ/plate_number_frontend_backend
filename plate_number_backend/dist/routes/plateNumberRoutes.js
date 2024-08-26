"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const plateNumberController_1 = require("../controllers/plateNumberController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = (0, express_1.Router)();
router.post("/generate", authMiddleware_1.default, plateNumberController_1.generatePlateNumber);
router.get("/all", authMiddleware_1.default, plateNumberController_1.getPlateNumbers);
exports.default = router;
