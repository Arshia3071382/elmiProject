import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage {
  sender: "advisor" | "student";
  text: string;
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

const MessageSchema = new Schema<IMessage>({
  sender: { type: String, enum: ["advisor", "student"], required: true },
  text: { type: String, required: true },
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