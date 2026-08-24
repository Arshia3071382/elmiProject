// Types and constants
import { Newspaper, CircleCheck, CircleX, Pencil } from "lucide-react";

export interface Notice {
  _id: string;
  title: string;
  content: string;
  image: string | null;
  type: "news" | "schedule" | "cancel" | "correction";
  isRead: boolean;
  createdAt: string;
}

export const typeConfig = {
  news: {
    borderColor: "border-secondary",
    bgColor: "bg-blue-50/60",
    icon: Newspaper,
    iconColor: "text-secondary",
    label: "خبر",
    dotColor: "bg-secondary",
    lightBg: "bg-blue-100/70",
  },
  schedule: {
    borderColor: "border-success",
    bgColor: "bg-green-50/60",
    icon: CircleCheck,
    iconColor: "text-success",
    label: "برگزاری کلاس",
    dotColor: "bg-success",
    lightBg: "bg-green-100/70",
  },
  cancel: {
    borderColor: "border-red-500",
    bgColor: "bg-red-50/60",
    icon: CircleX,
    iconColor: "text-red-500",
    label: "کنسلی کلاس",
    dotColor: "bg-red-500",
    lightBg: "bg-red-100/70",
  },
  correction: {
    borderColor: "border-amber-500",
    bgColor: "bg-amber-50/60",
    icon: Pencil,
    iconColor: "text-amber-500",
    label: "اصلاحیه",
    dotColor: "bg-amber-500",
    lightBg: "bg-amber-100/70",
  },
};

export const dateOptions = [
  { value: "all", label: "همه زمان‌ها" },
  { value: "today", label: "امروز" },
  { value: "week", label: "هفته اخیر" },
  { value: "month", label: "ماه اخیر" },
];

export const typeOptions = ["all", "news", "schedule", "cancel", "correction"];

// Format Persian date
export const formatPersianDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};