import mongoose, { Schema, Document } from "mongoose";

export interface IGradeStudent extends Document {
  firstName: string;
  lastName: string;
  nationalId: string;
  grade: number;
  selectedActivities: string[];
  totalScore: number;
  previousRank?: number; // اضافه شده برای ذخیره رتبه قبلی
  published: boolean;
  studentId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const GradeStudentSchema = new Schema<IGradeStudent>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    nationalId: { type: String, required: true, trim: true, unique: true },
    grade: { type: Number, required: true },
    selectedActivities: { type: [String], default: [] },
    totalScore: { type: Number, default: 0 },
    previousRank: { type: Number, default: 0 }, // مقدار پیش‌فرض
    published: { type: Boolean, default: true },
    studentId: { type: Schema.Types.ObjectId, ref: "Student" },
  },
  { timestamps: true }
);

const GradeStudent =
  mongoose.models.GradeStudent ||
  mongoose.model<IGradeStudent>("GradeStudent", GradeStudentSchema);

export default GradeStudent;