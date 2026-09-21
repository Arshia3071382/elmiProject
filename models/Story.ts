import mongoose, { Schema, Document } from 'mongoose';

export interface IStory extends Document {
  title?: string;
  image: string;       
  link?: string;       
  expiresAt?: Date;    
  createdAt: Date;
}

const StorySchema = new Schema<IStory>({
  title: { type: String, trim: true },
  image: { type: String, required: true },
  link: { type: String, trim: true },
  expiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Story || mongoose.model<IStory>('Story', StorySchema);