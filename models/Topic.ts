import mongoose, { Schema, Document } from "mongoose";

// ۱. تعریف و اکسپورت تایپ هر گزینه (Option)
export interface IOption {
  id: string;
  text: string;
  next: string;
}

// ۲. تعریف و اکسپورت تایپ هر نود (INode) که validator به آن نیاز دارد
export interface INode {
  id: string;
  advisorMessage: string;
  options: IOption[];
}

// ۳. تایپ اسکیما اصلی Topic
export interface ITopic extends Document {
  title: string;
  slug: string;
  description?: string;
  startNodeId: string;
  nodes: Record<string, INode> | Map<string, INode>;
  createdAt?: Date;
  updatedAt?: Date;
}

const OptionSchema = new Schema<IOption>(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
    next: { type: String, required: true },
  },
  { _id: false }
);

const NodeSchema = new Schema<INode>(
  {
    id: { type: String, required: true },
    advisorMessage: { type: String, required: true },
    options: { type: [OptionSchema], default: [] },
  },
  { _id: false }
);

const TopicSchema = new Schema<ITopic>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    startNodeId: { type: String, default: "start" },
    nodes: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true, strict: false }
);

export const Topic =
  mongoose.models.Topic || mongoose.model<ITopic>("Topic", TopicSchema);