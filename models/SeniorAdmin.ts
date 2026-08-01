import mongoose, { Schema, Document, Model } from "mongoose";

export type SeniorPermission = "calendar" | "notices" | "elites" | "counseling";

export interface ISeniorAdmin extends Document {
  username: string;
  passwordHash?: string; // در اولین ورود می‌تواند خالی باشد
  name: string;
  role: "senior_admin" | "super_admin";
  permissions: SeniorPermission[];
  isFirstLogin: boolean; // 👈 تشخیص اولین ورود
  createdAt: Date;
}

const SeniorAdminSchema = new Schema<ISeniorAdmin>(
  {
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, default: null },
    name: { type: String, required: true },
    role: { type: String, default: "senior_admin" },
    permissions: {
      type: [String],
      default: ["calendar"],
    },
    isFirstLogin: { type: Boolean, default: true }, // 👈 پیش‌فرض true است
  },
  { timestamps: true, collection: "senior_admins" }
);

const SeniorAdmin: Model<ISeniorAdmin> =
  mongoose.models.SeniorAdmin || mongoose.model<ISeniorAdmin>("SeniorAdmin", SeniorAdminSchema);

export default SeniorAdmin;