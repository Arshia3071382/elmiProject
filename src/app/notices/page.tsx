"use client";

import { useEffect, useState } from "react";
import {
  Newspaper,
  CircleCheck,
  CircleX,
  Pencil,
  Bell,
  Clock,
  Search,
  X,
  Filter,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Container from "@/component/Container";

interface Notice {
  _id: string;
  title: string;
  content: string;
  image: string | null;
  type: "news" | "schedule" | "cancel" | "correction";
  isRead: boolean;
  createdAt: string;
}

const typeConfig = {
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

// Helper
const formatPersianDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [filteredNotices, setFilteredNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch notices
  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await fetch("/api/notices");
      if (response.ok) {
        const data = await response.json();
        setNotices(data.notices);
        setFilteredNotices(data.notices);
      }
    } catch (error) {
      console.error("Error fetching notices:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mark as read
  const markAsRead = async (noticeId: string) => {
    try {
      const response = await fetch(`/api/notices?id=${noticeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });
      if (response.ok) {
        setNotices((prev) =>
          prev.map((n) => (n._id === noticeId ? { ...n, isRead: true } : n)),
        );
        setFilteredNotices((prev) =>
          prev.map((n) => (n._id === noticeId ? { ...n, isRead: true } : n)),
        );
      }
    } catch (error) {
      console.error("Error marking notice as read:", error);
    }
  };

  // Filter notices
  useEffect(() => {
    let filtered = [...notices];

    if (selectedType !== "all") {
      filtered = filtered.filter((n) => n.type === selectedType);
    }

    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (dateFilter === "today") {
        filtered = filtered.filter((n) => new Date(n.createdAt) >= today);
      } else if (dateFilter === "week") {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter((n) => new Date(n.createdAt) >= weekAgo);
      } else if (dateFilter === "month") {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        filtered = filtered.filter((n) => new Date(n.createdAt) >= monthAgo);
      }
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          n.content.toLowerCase().includes(query),
      );
    }

    setFilteredNotices(filtered);
  }, [searchQuery, selectedType, dateFilter, notices]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setDateFilter("all");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[var(--color-secondary)] border-r-transparent"></div>
          <p
            className="mt-4 text-[var(--color-text-secondary)]"
            style={{ fontFamily: "iranSans-r" }}
          >
            ...در حال بارگذاری اطلاعات
          </p>
        </div>
      </div>
    );
  }

  const unreadCount = notices.filter((n) => !n.isRead).length;

  return (
    <div
      dir="rtl"
      className="min-h-screen mt-10 sm:mt-24 bg-[var(--color-bg)] py-6 md:py-12"
    >
      <Container>
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-surface)] via-[var(--color-bg)] to-blue-50 p-6 md:p-10 shadow-sm mb-6 md:mb-8">
          <div className="absolute -top-16 -left-16 h-48 w-48 rounded-full bg-[var(--color-accent)]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 right-0 h-56 w-56 rounded-full bg-[var(--color-secondary)]/10 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4 md:gap-5">
              <div className="relative flex h-14 w-14 md:h-16 md:w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] shadow-lg shadow-[var(--color-secondary)]/25">
                <Bell
                  className={`h-7 w-7 md:h-8 md:w-8 text-[var(--color-text-invert)] ${unreadCount > 0 ? "animate-bounce" : ""}`}
                />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-md animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </div>

              <div>
                <h1
                  className="text-2xl md:text-4xl font-black text-[var(--color-text-primary)] tracking-tight"
                  style={{ fontFamily: "iranBold" }}
                >
                  مرکز اعلانات و اخبار
                </h1>
                <p
                  className="mt-1.5 md:mt-2 max-w-xl text-xs md:text-sm leading-relaxed text-[var(--color-text-secondary)]"
                  style={{ fontFamily: "iranSans-r" }}
                >
                  آخرین اخبار، تغییرات کلاس‌ها، اطلاعیه‌های آموزشی و اصلاحیه‌های
                  مجموعه علمی منتظران
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/90 px-4 py-3 shadow-sm backdrop-blur text-center md:text-right">
                <p
                  className="text-[11px] text-[var(--color-text-secondary)]"
                  style={{ fontFamily: "iranSans-r" }}
                >
                  کل اعلان‌ها
                </p>
                <p
                  className="mt-1 text-xl md:text-2xl font-black text-[var(--color-text-primary)]"
                  style={{ fontFamily: "iranBold" }}
                >
                  {notices.length}
                </p>
              </div>
              <div className="rounded-2xl border border-red-200 bg-red-50/80 px-4 py-3 shadow-sm text-center md:text-right">
                <p
                  className="text-[11px] text-red-500 font-medium"
                  style={{ fontFamily: "iranSans-r" }}
                >
                  خوانده نشده
                </p>
                <p
                  className="mt-1 text-xl md:text-2xl font-black text-red-600"
                  style={{ fontFamily: "iranBold" }}
                >
                  {unreadCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-border)] p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-secondary)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در عنوان و متن اعلان‌ها..."
                className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl py-3 pr-11 pl-4 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/20 transition-all"
                style={{ fontFamily: "iranSans-r" }}
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]/40 transition-colors ${showFilters ? "border-[var(--color-secondary)] text-[var(--color-secondary)]" : ""}`}
                style={{ fontFamily: "iranSans-r" }}
              >
                <Filter className="h-4 w-4" />
                فیلترها
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${showFilters ? "rotate-180" : ""}`}
                />
              </button>

              {(searchQuery ||
                selectedType !== "all" ||
                dateFilter !== "all") && (
                <button
                  onClick={clearFilters}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 hover:bg-red-100 transition-colors whitespace-nowrap"
                  style={{ fontFamily: "iranSans-r" }}
                >
                  <X className="h-4 w-4" />
                  پاک‌سازی
                </button>
              )}
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[var(--color-border)]">
                  <div>
                    <label
                      className="block text-xs font-bold text-[var(--color-text-primary)] mb-2"
                      style={{ fontFamily: "iranBold" }}
                    >
                      نوع اعلان
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {["all", "news", "schedule", "cancel", "correction"].map(
                        (type) => {
                          const config =
                            type !== "all"
                              ? typeConfig[type as keyof typeof typeConfig]
                              : null;
                          const isSelected = selectedType === type;
                          return (
                            <button
                              key={type}
                              onClick={() => setSelectedType(type)}
                              className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                                isSelected
                                  ? "bg-[var(--color-primary)] text-white shadow-sm font-bold"
                                  : "bg-[var(--color-bg)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]/50"
                              }`}
                              style={{ fontFamily: "iranSans-r" }}
                            >
                              {type === "all" ? "همه موارد" : config?.label}
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-xs font-bold text-[var(--color-text-primary)] mb-2"
                      style={{ fontFamily: "iranBold" }}
                    >
                      بازه زمانی
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { value: "all", label: "همه زمان‌ها" },
                        { value: "today", label: "امروز" },
                        { value: "week", label: "هفته اخیر" },
                        { value: "month", label: "ماه اخیر" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setDateFilter(option.value)}
                          className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                            dateFilter === option.value
                              ? "bg-[var(--color-primary)] text-white shadow-sm font-bold"
                              : "bg-[var(--color-bg)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]/50"
                          }`}
                          style={{ fontFamily: "iranSans-r" }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notice count */}
        <div className="flex items-center justify-between mb-4 px-1">
          <p
            className="text-xs text-[var(--color-text-secondary)]"
            style={{ fontFamily: "iranSans-r" }}
          >
            نمایش {filteredNotices.length} اطلاعیه
          </p>
        </div>

        {/* Notice list */}
        <div className="space-y-3 md:space-y-4">
          {filteredNotices.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-10 md:p-14 text-center shadow-sm"
            >
              <Bell className="mx-auto h-12 w-12 md:h-16 md:w-16 text-[var(--color-text-secondary)]/30" />
              <p
                className="mt-3 text-base md:text-lg font-bold text-[var(--color-text-primary)]"
                style={{ fontFamily: "iranBold" }}
              >
                هیچ اعلانی یافت نشد
              </p>
              <p
                className="mt-1 text-xs md:text-sm text-[var(--color-text-secondary)]"
                style={{ fontFamily: "iranSans-r" }}
              >
                {searchQuery || selectedType !== "all" || dateFilter !== "all"
                  ? "لطفاً فیلترهای جستجو را تغییر دهید"
                  : "در حال حاضر اطلاعیه‌ای ثبت نشده است"}
              </p>
            </motion.div>
          ) : (
            filteredNotices.map((notice, index) => {
              const config = typeConfig[notice.type] || typeConfig.news;
              const IconComponent = config.icon;

              return (
                <motion.div
                  key={notice._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className={`group relative overflow-hidden rounded-2xl border-r-4 ${config.borderColor} bg-[var(--color-surface)] shadow-sm transition-all duration-300 hover:shadow-md ${
                    !notice.isRead
                      ? "border-l-4 border-l-[var(--color-secondary)] bg-gradient-to-l from-blue-50/20 to-transparent"
                      : ""
                  }`}
                >
                  <div className={`p-4 md:p-6 ${config.bgColor}`}>
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-right">
                      {/* Icon or Image */}
                      <div className="flex-shrink-0 flex justify-center w-full md:w-auto">
                        {notice.image ? (
                          <div className="relative h-16 w-16 md:h-16 md:w-16 overflow-hidden rounded-xl shadow-sm border border-[var(--color-border)]">
                            <Image
                              src={notice.image}
                              alt={notice.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ) : (
                          <div
                            className={`flex h-16 w-16 md:h-16 md:w-16 items-center justify-center rounded-xl ${config.lightBg} ${config.iconColor} shadow-sm transition-transform group-hover:scale-105`}
                          >
                            <IconComponent className="h-8 w-8" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 w-full flex flex-col items-center md:items-start">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2 w-full">
                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${config.lightBg} ${config.iconColor}`}
                              style={{ fontFamily: "iranBold" }}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`}
                              />
                              {config.label}
                            </span>
                            {!notice.isRead && (
                              <span
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-100/90 px-2.5 py-1 rounded-full shadow-xs"
                                style={{ fontFamily: "iranBold" }}
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                                جدید
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-center md:justify-end gap-1.5 text-xs text-[var(--color-text-secondary)]">
                            <Clock className="h-3.5 w-3.5" />
                            <span style={{ fontFamily: "iranSans-r" }}>
                              {formatPersianDate(notice.createdAt)}
                            </span>
                          </div>
                        </div>

                        <h3
                          className="text-lg md:text-xl font-black text-[var(--color-text-primary)] group-hover:text-[var(--color-secondary)] transition-colors leading-snug mb-2"
                          style={{ fontFamily: "iranBold" }}
                        >
                          {notice.title}
                        </h3>

                        <p
                          className="text-xs md:text-sm text-[var(--color-text-secondary)] leading-relaxed text-center md:text-right"
                          style={{ fontFamily: "iranSans-r" }}
                        >
                          {notice.content}
                        </p>

                        {/* Mark as read button */}
                        {!notice.isRead && (
                          <div className="mt-4 flex justify-center md:justify-start w-full">
                            <button
                              onClick={() => markAsRead(notice._id)}
                              className="group/btn relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden"
                              style={{ fontFamily: "iranBold" }}
                            >
                              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></span>
                              <CheckCircle2 className="h-4 w-4 relative z-10 text-white" />
                              <span className="relative z-10">
                                متوجه شدم / خواندم
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </Container>
    </div>
  );
}
