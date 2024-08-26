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
exports.getPlateNumbers = exports.generatePlateNumber = void 0;
const plateNumber_1 = __importDefault(require("../models/plateNumber"));
const generatePlateNumber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Implement your plate number generation logic here
});
exports.generatePlateNumber = generatePlateNumber;
const getPlateNumbers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const plateNumbers = yield plateNumber_1.default.find();
        res.json(plateNumbers);
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.getPlateNumbers = getPlateNumbers;
