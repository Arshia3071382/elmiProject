import mongoose, { Schema } from "mongoose";

// اسکیمای هر گزینه (Option/Edge)
const OptionSchema = new Schema(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
    next: { type: String, required: true }, // اشاره به slug/id نود بعدی
  },
  { _id: false }
);

// اسکیمای هر نود سناریو
const NodeSchema = new Schema(
  {
    id: { type: String, required: true },
    advisorMessage: { type: String, required: true },
    options: { type: [OptionSchema], default: [] },
  },
  { _id: false }
);

const TopicSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    startNodeId: { type: String, default: "start" },
    // ذخیره نودها به صورت Map/Object که key آن slug نود است
    nodes: {
      type: Map,
      of: NodeSchema,
      default: {},
    },
  },
  { timestamps: true, strict: false }
);

export const Topic =
  mongoose.models.Topic || mongoose.model("Topic", TopicSchema);