import mongoose, { Schema, Document, Model } from "mongoose";

// Define an interface for Local Government Area
interface ILocalGovernmentArea extends Document {
  stateName: string;
  name: string;
  abbreviation: string;
}

// Define the Local Government Area Schema
const LocalGovernmentAreaSchema: Schema = new Schema({
  stateName: { type: String, required: true },
  name: { type: String, required: true },
  abbreviation: { type: String, required: true },
});

// Create the Local Government Area Model
const LocalGovernmentArea: Model<ILocalGovernmentArea> =
  mongoose.model<ILocalGovernmentArea>(
    "LocalGovernmentArea",
    LocalGovernmentAreaSchema
  );

export { LocalGovernmentArea, ILocalGovernmentArea };
