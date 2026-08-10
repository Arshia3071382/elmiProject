import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  name: string;
  comment: string;
  coursesCount: string;
  rating: number;
  date: string;
  createdAt: Date;
}

const getPersianDate = () => {
  return new Date().toLocaleDateString('fa-IR-u-nu-latn', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '/'); 
};

const CommentSchema = new Schema<IComment>({
  name: { type: String, required: true },
  comment: { type: String, required: true },
  coursesCount: { type: String, default: "1 دوره" },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  date: { type: String, default: getPersianDate },
}, { timestamps: true });

export default mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);