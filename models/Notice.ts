import mongoose from "mongoose";

const NoticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      maxlength: [500, "Content cannot be more than 500 characters"],
    },
    image: {
      type: String,
      default: null,
    },
    imageLayout: {
      type: String,
      enum: ["vertical", "horizontal"],
      default: "vertical", // پیش‌فرض پوستر عمودی
    },
    type: {
      type: String,
      enum: {
        values: ["news", "schedule", "cancel", "correction"],
        message: "{VALUE} is not a valid notice type",
      },
      default: "news",
      required: true,
    },
    eventDate: {
      type: String,
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Notice = mongoose.models.Notice || mongoose.model("Notice", NoticeSchema);

export default Notice;