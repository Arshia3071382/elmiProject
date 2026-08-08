import mongoose, { Schema, model, models } from "mongoose";

const CourseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const TeacherSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    avatar: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
      default: "",
      trim: true,
    },

    // مدرک تحصیلی
    education: {
      type: String,
      default: "",
      trim: true,
    },

    // تعداد مقالات
    articlesCount: {
      type: Number,
      default: 0,
    },

    // سابقه تدریس
    experienceYears: {
      type: Number,
      default: 0,
    },

    // افتخارات
    achievements: {
      type: [String],
      default: [],
    },

    // حوزه‌های تخصصی و پژوهشی
    recentTopics: {
      type: [String],
      default: [],
    },

    // ایمیل
    email: {
      type: String,
      default: "",
      trim: true,
      required: true,
    },

    // لینک نمونه تدریس
    teachingSampleUrl: {
      type: String,
      default: "",
      trim: true,
    },

    // دوره‌های ارائه‌شده
    courses: {
      type: [CourseSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Teacher = models.Teacher || model("Teacher", TeacherSchema);

export default Teacher;
