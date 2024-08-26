import mongoose, { Document, Schema } from "mongoose";

interface IPlateNumber extends Document {
  number: string;
  issuedDate: Date;
  vehicleId: string;
  customerId: string;
  customerName: string;
  vehicleType: string;
  vehicleModel: string;
  vehicleYear: string;
  address: string;
  plateType: string;
  color: string;
  paymentMethod: string;
  amountPaid: number;
  requestDate: Date;
  state: string;
}

const PlateNumberSchema: Schema = new Schema({
  number: { type: String, required: true, unique: true },
  issuedDate: { type: Date, default: Date.now },
  vehicleId: { type: String, required: true, unique: true },
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  vehicleType: { type: String, required: true },
  vehicleModel: { type: String, required: true },
  vehicleYear: { type: String, required: true },
  address: { type: String, required: true },
  plateType: { type: String, required: true },
  color: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  amountPaid: { type: Number, required: true },
  requestDate: { type: Date, required: true },
  state: { type: String, required: true },
});

export default mongoose.model<IPlateNumber>("PlateNumber", PlateNumberSchema);
