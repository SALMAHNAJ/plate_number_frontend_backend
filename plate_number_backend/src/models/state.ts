// src/models/state.ts
import mongoose, { Schema, Document, Model } from "mongoose";

// Define an interface for Nigerian State
interface INigerianState extends Document {
  name: string;
  code: string;
}

// Define the Nigerian State Schema
const NigerianStateSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
});

// Create the Nigerian State Model
const State: Model<INigerianState> = mongoose.model<INigerianState>(
  "State",
  NigerianStateSchema
);

export { State, INigerianState };
