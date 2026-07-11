import mongoose, { Schema, model, models } from "mongoose";

const NoticeSchema = new Schema(
  {
    type: { type: String, enum: ["schedule", "cancel", "news"], required: true },
    title: { type: String, required: true }, // Class name or News title
    location: { type: String }, // Used for classes
    instructor: { type: String }, // Used for classes
    startTime: { type: Date }, // Target date/time for counter
    content: { type: String }, // Short description for news
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default models.Notice || model("Notice", NoticeSchema);