import mongoose, { Schema, model, models } from "mongoose";

const GradeStudentSchema = new Schema(
  {
    name: { type: String, required: true },
    grade: { type: Number, required: true, min: 2, max: 9 }, // پایه‌های ۲ تا ۹
    selectedActivities: [{ type: String }], // شناسه یا عنوان فعالیت‌های تیک خورده
    totalScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.GradeStudent || model("GradeStudent", GradeStudentSchema);