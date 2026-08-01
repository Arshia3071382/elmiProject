import mongoose, { Schema, model, models } from "mongoose";

export interface IGradeStudent {
  _id?: string;
  name: string;
  grade: number; // پایه 2 تا 9
  selectedActivities: string[]; // شناسه فعالیت‌های تیک‌خورده
  totalScore: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const GradeStudentSchema = new Schema<IGradeStudent>(
  {
    name: { type: String, required: true, trim: true },
    grade: { type: Number, required: true, min: 2, max: 9 },
    selectedActivities: { type: [String], default: [] },
    totalScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.GradeStudent || model<IGradeStudent>("GradeStudent", GradeStudentSchema);