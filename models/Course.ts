import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "نام دوره الزامی است"],
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "گروه دوره الزامی است"],
  },
  description: {
    type: String,
    default: "",
  },
  duration: {
    type: String,
    default: "",
  },
  videoUrl: {
    type: String,
    default: "", // ذخیره آدرس نسبی ویدیو آپلود شده (مثلا: /uploads/17181023-video.mp4)
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ایندکس‌گذاری برای بهینه‌سازی سرعت کوئری‌ها بر اساس دسته‌بندی و زمان خلق دوره
CourseSchema.index({ category: 1, createdAt: -1 });

const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);

export default Course;