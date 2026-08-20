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
    // نام استاد
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // سمت / عنوان
    role: {
      type: String,
      required: true,
      trim: true,
    },

    // حوزه تدریس
    subject: {
      type: String,
      required: true,
      trim: true,
    },

    // تصویر استاد
    avatar: {
      type: String,
      required: true,
      trim: true,
    },

    // بیوگرافی
    bio: {
      type: String,
      default: "",
      trim: true,
    },

    // مدرک تحصیلی
    // مثال: کارشناسی مهندسی کامپیوتر
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

    // افتخارات و سوابق
    achievements: {
      type: [String],
      default: [],
    },

    // حوزه‌های تخصصی و پژوهشی
    recentTopics: {
      type: [String],
      default: [],
    },

    // ایمیل ارتباطی - اختیاری
    email: {
      type: String,
      default: "",
      trim: true,
      required:true,
    },

    // لینک نمونه تدریس
    // مثال: لینک ویدیوی آپارات
    teachingSampleUrl: {
      type: String,
      default: "",
      trim: true,
    },

    // دوره‌های ارائه‌شده توسط استاد
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
