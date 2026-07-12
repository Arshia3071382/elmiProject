// models/EliteStudent.ts
import mongoose, { Schema, model, models } from "mongoose";

const EliteStudentSchema = new Schema({
  name: { type: String, required: true },
  grade: { type: String, required: true }, // مثلاً "پنجم" یا "هشتم"
  score: { type: Number, required: true, default: 0 },
  category: { type: String, required: true, enum: ["elementary", "highschool"] }, // ابتدایی یا راهنمایی
}, { timestamps: true });

export const EliteStudent = models.EliteStudent || model("EliteStudent", EliteStudentSchema);