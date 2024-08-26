import { Request, Response } from "express";
import PlateNumber from "../models/plateNumber";
import { State } from "../models/state";
import { LocalGovernmentArea } from "../models/lga";

const generateRandomNumbers = (length: number): string => {
  const numbers = "0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  return result;
};

const generateRandomCode = (length: number): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const generatePlateNumber = async (req: Request, res: Response) => {
  try {
    const {
      vehicleId,
      customerId,
      customerName,
      vehicleType,
      vehicleModel,
      vehicleYear,
      address,
      plateType,
      color,
      paymentMethod,
      amountPaid,
      requestDate,
      lga,
      state,
    } = req.body;

    // Validate state
    const stateData = await State.findOne({ code: state }).exec();
    if (!stateData) {
      return res.status(400).json({
        status: "error",
        message: "Invalid state",
      });
    }

    // Validate LGA
    const lgaData = await LocalGovernmentArea.findOne({
      stateName: state,
      name: { $regex: new RegExp(`^${lga}$`, "i") }, // Case-insensitive search
    }).exec();

    if (!lgaData) {
      console.log(`LGA Search - State: ${state}, LGA: ${lga}`);
      return res.status(400).json({
        status: "error",
        message: "Invalid LGA for the given state",
      });
    }

    // Generate a random 2-letter code for state abbreviation
    const randomAbbreviation = generateRandomCode(2);

    let plateNumber;
    let isUnique = false;
    let maxAttempts = 100;

    while (!isUnique && maxAttempts > 0) {
      plateNumber = `${lgaData.abbreviation}-${generateRandomNumbers(
        3
      )}-${randomAbbreviation}`;
      // Check uniqueness of plate number
      const existingPlate = await PlateNumber.findOne({
        number: plateNumber,
      }).exec();
      if (!existingPlate) {
        isUnique = true;
      }
      maxAttempts--;
    }

    if (!isUnique) {
      return res.status(500).json({
        status: "error",
        message: "Unable to generate a unique plate number",
      });
    }

    // Check if vehicleId is already registered
    const existingVehicle = await PlateNumber.findOne({ vehicleId }).exec();
    if (existingVehicle) {
      return res.status(400).json({
        status: "error",
        message: "Vehicle ID is already registered",
      });
    }

    // Create and save the new PlateNumber document
    const newPlateNumber = new PlateNumber({
      number: plateNumber,
      issuedDate: new Date(),
      vehicleId,
      customerId,
      customerName,
      vehicleType,
      vehicleModel,
      vehicleYear,
      address,
      plateType,
      color,
      paymentMethod,
      amountPaid,
      requestDate,
      state,
    });

    await newPlateNumber.save();

    // Respond with the generated plate number and request details
    res.status(201).json({
      status: "success",
      message: "Plate number generated and saved successfully.",
      data: {
        plateNumber: newPlateNumber.number,
        issuedDate: newPlateNumber.issuedDate,
        vehicleId: newPlateNumber.vehicleId,
        customerId: newPlateNumber.customerId,
        customerName: newPlateNumber.customerName,
        vehicleType: newPlateNumber.vehicleType,
        vehicleModel: newPlateNumber.vehicleModel,
        vehicleYear: newPlateNumber.vehicleYear,
        address: newPlateNumber.address,
        plateType: newPlateNumber.plateType,
        color: newPlateNumber.color,
        paymentMethod: newPlateNumber.paymentMethod,
        amountPaid: newPlateNumber.amountPaid,
        requestDate: newPlateNumber.requestDate,
        state: newPlateNumber.state,
      },
    });
  } catch (error) {
    console.error("Error generating plate number:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

// Function to get all plate numbers
export const getPlateNumbers = async (req: Request, res: Response) => {
  try {
    const plateNumbers = await PlateNumber.find();
    res.json(plateNumbers);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

// Function to single plate number using vehicleId
export const getPlateNumber = async (req: Request, res: Response) => {
  // check the vehicleId
  if (!req.params.vehicleId) {
    return res.status(400).json({
      status: "error",
      message: "Vehicle ID is required",
    });
  }

  // find the plate number using vehicleId and return it or return 404 if not found
  try {
    const plateNumber = await PlateNumber.findOne({
      vehicleId: req.params.vehicleId,
    });
    if (!plateNumber) {
      return res.status(404).json({
        status: "error",
        message: "Plate number not found",
      });
    }
    res.json(plateNumber);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

// Fetch all states
export const getAllStates = async (req: Request, res: Response) => {
  try {
    const states = await State.find().exec();
    res.status(200).json({
      status: "success",
      data: states,
    });
  } catch (error) {
    console.error("Error fetching states:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

// Fetch all LGAs
export const getAllLGAs = async (req: Request, res: Response) => {
  try {
    const lgas = await LocalGovernmentArea.find().exec();
    res.status(200).json({
      status: "success",
      data: lgas,
    });
  } catch (error) {
    console.error("Error fetching LGAs:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};
