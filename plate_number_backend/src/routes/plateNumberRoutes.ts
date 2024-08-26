// plateNumberRoutes.ts

import { Router } from "express";
import {
  generatePlateNumber,
  getPlateNumber,
  getPlateNumbers,
  getAllStates,
  getAllLGAs,
} from "../controllers/plateNumberController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.post("/generate", authMiddleware, generatePlateNumber);
router.get("/all", authMiddleware, getPlateNumbers);
router.get("/states", authMiddleware, getAllStates); // Fetch all states
router.get("/lgas", authMiddleware, getAllLGAs); // Fetch all LGAs
router.get("/:vehicleId", authMiddleware, getPlateNumber);

export default router;
