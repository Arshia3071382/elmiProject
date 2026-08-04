import mongoose, { Schema, model, models } from "mongoose";

export interface IGradeStudent {
  _id?: string;
  firstName: string;
  lastName: string;
  grade: number;
  selectedActivities: string[];
  totalScore: number;
  published: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const GradeStudentSchema = new Schema<IGradeStudent>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    grade: { type: Number, required: true, min: 2, max: 9 },
    selectedActivities: [{ type: String }],
    totalScore: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// ایندکس برای جستجوی بهتر
GradeStudentSchema.index({ firstName: 1, lastName: 1 });
GradeStudentSchema.index({ grade: 1, published: 1 });

export default models.GradeStudent ||
  model<IGradeStudent>("GradeStudent", GradeStudentSchema);
