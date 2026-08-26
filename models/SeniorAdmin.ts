
import mongoose, { Schema, Document } from "mongoose";

export interface ISeniorAdmin extends Document {
  username: string;
  name: string;
  password: string;
  role: string;
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SeniorAdminSchema = new Schema<ISeniorAdmin>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, default: "senior_admin" },
    permissions: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.SeniorAdmin ||
  mongoose.model<ISeniorAdmin>("SeniorAdmin", SeniorAdminSchema);