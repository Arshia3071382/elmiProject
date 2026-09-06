import mongoose, { Schema, Document } from "mongoose";

interface IShowcase extends Document {
  title: string;
  slug: string;
  description?: string;
  date?: string;
  coverImage: string;
  images: string[];
  createdAt: Date;
}

const ShowcaseSchema: Schema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: "" }, // اضافه شدن توضیحات
  date: { type: String, default: "" }, // اضافه شدن تاریخ فارسی
  coverImage: { type: String, required: true },
  images: [{ type: String, required: true }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Showcase ||
  mongoose.model<IShowcase>("Showcase", ShowcaseSchema);