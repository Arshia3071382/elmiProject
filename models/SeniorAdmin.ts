import mongoose, { Schema, Document, Model } from "mongoose";

// 🟢 ۱. اضافه کردن دسترسی جدید به تایپ اتحادی (Union Type)
export type SeniorPermission = 
  | "calendar" 
  | "notices" 
  | "elites" 
  | "counseling" 
  | "grade_league"; // 👈 دسترسی لیگ علمی پایه اضافه شد

export interface ISeniorAdmin extends Document {
  username: string;
  passwordHash?: string; // در اولین ورود می‌تواند خالی باشد
  name: string;
  role: "senior_admin" | "super_admin";
  permissions: SeniorPermission[]; // حالا شامل grade_league هم می‌شود
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
      type: [String], // TypeScript اینجا رشته‌ها را می‌پذیرد
      default: ["calendar"],
    },
    isFirstLogin: { type: Boolean, default: true }, 
  },
  { timestamps: true, collection: "senior_admins" }
);

const SeniorAdmin: Model<ISeniorAdmin> =
  mongoose.models.SeniorAdmin || mongoose.model<ISeniorAdmin>("SeniorAdmin", SeniorAdminSchema);

export default SeniorAdmin;