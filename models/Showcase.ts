import mongoose, { Schema, model, models } from "mongoose";

export interface IShowcase {
  _id?: string;
  title: string;
  slug: string;
  folder: string;
  coverImage: string;
  description?: string;
  date?: string;
  published: boolean;
  createdAt?: Date;
}

const ShowcaseSchema = new Schema<IShowcase>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    folder: { type: String, required: true },
    coverImage: { type: String, required: true },
    description: { type: String, default: "" },
    date: { type: String, default: "" },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Showcase || model<IShowcase>("Showcase", ShowcaseSchema);