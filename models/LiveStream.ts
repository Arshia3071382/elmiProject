// models/LiveStream.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ILiveStream extends Document {
  title: string;
  host: string;
  date: string;
  time: string;
  category: string;
  quality: string;
  status: "waiting" | "live" | "ended";
  description: string;
  aparatEmbedUrl: string; // لینک آی‌فریم یا شناسه ویدیو/لایو آپارات
  guests: string[];
  viewersCount: number;
  likesCount: number;
  commentsCount: number;
  isCurrentLive: boolean; // آیا این مورد پخش زنده فعال فعلی است؟
}

const LiveStreamSchema = new Schema<ILiveStream>(
  {
    title: { type: String, required: true },
    host: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    category: { type: String, required: true },
    quality: { type: String, default: "HD" },
    status: { type: String, enum: ["waiting", "live", "ended"], default: "waiting" },
    description: { type: String },
    aparatEmbedUrl: { type: String, required: true },
    guests: [{ type: String }],
    viewersCount: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    isCurrentLive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.LiveStream || mongoose.model<ILiveStream>("LiveStream", LiveStreamSchema);