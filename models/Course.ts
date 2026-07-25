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
  teacher: {
    type: String,
    default: "", 
    trim: true,
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
    default: "", 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

CourseSchema.index({ category: 1, createdAt: -1 });

const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);

export default Course;