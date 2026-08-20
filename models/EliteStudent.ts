import mongoose, { Schema, model, models } from "mongoose";

const EliteStudentSchema = new Schema({
  name: { type: String, required: true },
  grade: { type: String, required: true }, 
  score: { type: Number, required: true, default: 0 },
  category: { type: String, required: true, enum: ["elementary", "highschool"] }, 
  isPublished: { type: Boolean, default: false }, // اضافه شده برای مدیریت انتشار نهایی
}, { timestamps: true });

export const EliteStudent = models.EliteStudent || model("EliteStudent", EliteStudentSchema);