// src/types/user.d.ts
import { Document } from "mongoose";

export interface IUser extends Document {
  // Define the fields in your User schema
  _id: string;
  name: string;
  email: string;
  phone: string;
  // Add other fields as necessary
}
