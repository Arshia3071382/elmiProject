// models/Conversation.ts
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    enum: ["student", "advisor"],
    required: true,
  },
  type: {
    type: String,
    enum: ["text", "image", "audio", "video", "file"],
    default: "text",
  },
  text: {
    type: String,
  },
  delay: {
    type: Number,
    default: 0,
  },
  typing: {
    type: Number,
    default: 0,
  },
  avatar: {
    type: String,
  },
  showTicks: {
    type: Boolean,
    default: true,
  },
  animation: {
    type: String,
  },
});

const ChoiceSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  next: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
});

const ConversationSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  topicSlug: {
    type: String,
    required: true,
    index: true,
  },
  messages: [MessageSchema],
  choices: [ChoiceSchema],
  isStart: {
    type: Boolean,
    default: false,
  },
  isEnd: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ایندکس‌ها برای بهبود عملکرد
ConversationSchema.index({ topicSlug: 1, isStart: 1 });

export default mongoose.models.Conversation || mongoose.model("Conversation", ConversationSchema);