import mongoose, { Schema, Document, Model } from "mongoose";
import { Permission } from "@/config/permissions";

export interface ISeniorAdmin extends Document {
  username: string;

  passwordHash: string | null;

  name: string;

  role: "senior_admin" | "super_admin";

  permissions: Permission[];

  isFirstLogin: boolean;

  isActive: boolean;

  lastLoginAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

const SeniorAdminSchema = new Schema<ISeniorAdmin>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    passwordHash: {
      type: String,
      default: null,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["senior_admin", "super_admin"],
      default: "senior_admin",
    },

    permissions: {
      type: [String],
      default: ["calendar"],
    },

    isFirstLogin: {
      type: Boolean,
      default: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "senior_admins",
  },
);

const SeniorAdmin: Model<ISeniorAdmin> =
  mongoose.models.SeniorAdmin ||
  mongoose.model<ISeniorAdmin>("SeniorAdmin", SeniorAdminSchema);

export default SeniorAdmin;
