import mongoose, { Schema, Document, Model } from "mongoose";

export type NoticeType =
  | "schedule"
  | "cancel"
  | "news"
  | "correction"
  | "competition"
  | "reminder"
  | "event"
  | "success";

export type NoticePriority = "normal" | "important" | "critical";

export type NoticeStatus = "draft" | "published" | "archived";

export interface INoticeImage {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export interface INoticeAttachment {
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface INotice extends Document {
  title: string;

  slug: string;

  description?: string;

  content: string;

  type: NoticeType;

  priority: NoticePriority;

  status: NoticeStatus;

  image?: INoticeImage;

  attachment?: INoticeAttachment;

  tags: string[];

  targetGrades: string[];

  targetClasses: string[];

  isPinned: boolean;

  publishAt: Date;

  expireAt?: Date;

  createdBy?: string;

  isReadRequired: boolean;

  createdAt: Date;

  updatedAt: Date;
}

const NoticeSchema = new Schema<INotice>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      maxlength: 300,
      default: "",
    },

    content: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [
        "schedule",
        "cancel",
        "news",
        "correction",
        "competition",
        "reminder",
        "event",
        "success",
      ],
      default: "news",
      index: true,
    },

    priority: {
      type: String,
      enum: ["normal", "important", "critical"],
      default: "normal",
      index: true,
    },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
      index: true,
    },

    image: {
      publicId: String,
      secureUrl: String,
      width: Number,
      height: Number,
      format: String,
      bytes: Number,
    },

    attachment: {
      name: String,
      url: String,
      type: String,
      size: Number,
    },

    tags: {
      type: [String],
      default: [],
      index: true,
    },

    targetGrades: {
      type: [String],
      default: ["all"],
      index: true,
    },

    targetClasses: {
      type: [String],
      default: [],
    },

    isPinned: {
      type: Boolean,
      default: false,
      index: true,
    },

    publishAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    expireAt: {
      type: Date,
    },

    createdBy: {
      type: String,
      default: "",
    },

    isReadRequired: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/

NoticeSchema.index({
  status: 1,
  publishAt: -1,
});

NoticeSchema.index({
  type: 1,
  priority: 1,
});

NoticeSchema.index({
  isPinned: -1,
  publishAt: -1,
});

NoticeSchema.index({
  expireAt: 1,
});

const Notice: Model<INotice> =
  mongoose.models.Notice || mongoose.model<INotice>("Notice", NoticeSchema);

export default Notice;
