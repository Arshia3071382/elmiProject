import mongoose, { Schema, Document } from "mongoose"; // or 'mongoose'

export interface IPodcast extends Document {
  title: string;
  description: string;
  audioUrl: string;
  duration?: string;
  createdAt: Date;
}

const PodcastSchema = new Schema<IPodcast>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  audioUrl: { type: String, required: true },
  duration: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Podcast ||
  mongoose.model<IPodcast>("Podcast", PodcastSchema);
