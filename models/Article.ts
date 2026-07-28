// مسیر فایل: models/Article.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IBlock {
  type: "text" | "image";
  content: string;
  caption?: string;
}

export interface IArticle extends Document {
  title: string;
  slug: string;
  summary?: string;
  likes: number;
  blocks: IBlock[];
  createdAt: Date;
  updatedAt: Date;
}

const BlockSchema = new Schema<IBlock>({
  type: { type: String, enum: ["text", "image"], required: true, default: "text" },
  content: { type: String, required: true },
  caption: { type: String },
});

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    summary: { type: String },
    likes: { type: Number, default: 0 },
    blocks: [BlockSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Article ||
  mongoose.model<IArticle>("Article", ArticleSchema);