// models/Topic.ts
import mongoose from "mongoose";

const TopicSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "default-topic.png",
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// برای جلوگیری از Overwrite شدن مدل در دفعات اجرای Serverless Function
export const Topic = mongoose.models.Topic || mongoose.model("Topic", TopicSchema);
export default Topic;