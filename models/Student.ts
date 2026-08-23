import mongoose, { Schema, model, models } from "mongoose";

export interface IStudent {
  _id?: string;
  username: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  phone?: string;
  passwordHash: string;
  grade: number;
  avatar?: string; // ✅ اضافه شدن فیلد آواتار به اینترفیس
  isActive: boolean;
  isVerified: boolean;
  leagueProfile?: mongoose.Types.ObjectId;
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
      minlength: 3,
      maxlength: 30,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    nationalId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    grade: {
      type: Number,
      required: true,
      min: 2,
      max: 9,
    },
    avatar: {
      type: String,
      default: "/image/profile/p1.png", // ✅ اضافه شدن فیلد آواتار به اسکیما
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    leagueProfile: {
      type: Schema.Types.ObjectId,
      ref: "GradeStudent",
      default: null,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

StudentSchema.index({ firstName: 1, lastName: 1 });

export default models.Student || model<IStudent>("Student", StudentSchema);