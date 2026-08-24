// Types and constants
import {
  LayoutDashboard,
  BookOpen,
  Award,
  MessageSquare,
  FileText,
  Bell,
  Users,
  Calendar,
  Sparkles,
  ShieldCheck,
  Star,
  Headphones,
  FileCheck,
} from "lucide-react";

export type MainTab =
  | "dashboard"
  | "courses"
  | "elite-league"
  | "grade-league"
  | "topics"
  | "articles"
  | "notices"
  | "teachers"
  | "calendar"
  | "showcase"
  | "permissions"
  | "comments"
  | "podcasts"
  | "exams";

export type CourseTab = "courses" | "categories";

export const menuItems = [
  { id: "dashboard" as const, label: "داشبورد و آمار", icon: LayoutDashboard },
  { id: "courses" as const, label: "دوره‌ها و گروه‌ها", icon: BookOpen },
  { id: "elite-league" as const, label: "لیگ نخبگان", icon: Award },
  { id: "grade-league" as const, label: "لیگ مقاطع", icon: Award },
  { id: "topics" as const, label: "مباحث چت", icon: MessageSquare },
  { id: "articles" as const, label: "مقالات", icon: FileText },
  { id: "notices" as const, label: "اطلاعیه‌ها", icon: Bell },
  { id: "teachers" as const, label: "اساتید", icon: Users },
  { id: "calendar" as const, label: "تقویم", icon: Calendar },
  { id: "showcase" as const, label: "ویترین", icon: Sparkles },
  { id: "comments" as const, label: "نظرات دانشجویان", icon: Star },
  { id: "podcasts" as const, label: "پادکست‌های آموزشی", icon: Headphones },
  { id: "exams" as const, label: "مدیریت آزمون‌ها", icon: FileCheck },
  { id: "permissions" as const, label: "سطح دسترسی ارشد", icon: ShieldCheck },
];

export interface Message {
  type: "success" | "error";
  text: string;
}