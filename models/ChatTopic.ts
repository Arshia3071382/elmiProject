import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOption {
  id: string;
  label: string; // متنی که روی دکمه/گزینه قرار می‌گیرد
  nextResponseText: string; // پاسخی که مشاور بعد از انتخاب این گزینه می‌دهد
}

export interface IMessage {
  id?: string;
  sender: "advisor" | "student";
  text: string;
  options?: IOption[]; // گزینه‌های انتخابی کاربر
}

export interface IQuestion {
  id: string;
  title: string;
  messages: IMessage[];
}

export interface IChatTopic extends Document {
  title: string;
  slug: string;
  description?: string;
  questions: IQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const OptionSchema = new Schema<IOption>({
  id: { type: String, required: true },
  label: { type: String, required: true },
  nextResponseText: { type: String, required: true },
});

const MessageSchema = new Schema<IMessage>({
  id: { type: String },
  sender: { type: String, enum: ["advisor", "student"], required: true },
  text: { type: String, required: true },
  options: [OptionSchema], // اضافه شدن اسکیما گزینه‌ها
});

const QuestionSchema = new Schema<IQuestion>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  messages: [MessageSchema],
});

const ChatTopicSchema = new Schema<IChatTopic>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    questions: [QuestionSchema],
  },
  { timestamps: true }
);

const ChatTopic: Model<IChatTopic> =
  mongoose.models.ChatTopic ||
  mongoose.model<IChatTopic>("ChatTopic", ChatTopicSchema);

export default ChatTopic;