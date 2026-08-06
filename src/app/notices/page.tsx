"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Newspaper,
  CircleCheck,
  CircleX,
  Pencil,
  Bell,
  Clock,
  Search,
  Calendar,
  X,
  Filter,
  ChevronDown,
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
    borderColor: "border-blue-400",
    bgColor: "bg-blue-50/80",
    hoverBg: "hover:bg-blue-100/50",
    icon: Newspaper,
    iconColor: "text-blue-600",
    label: "خبر",
    dotColor: "bg-blue-500",
    lightBg: "bg-blue-100",
    bgHover: "hover:bg-blue-50",
  },
  schedule: {
    borderColor: "border-green-500",
    bgColor: "bg-green-50/80",
    hoverBg: "hover:bg-green-100/50",
    icon: CircleCheck,
    iconColor: "text-green-600",
    label: "برگزاری کلاس",
    dotColor: "bg-green-500",
    lightBg: "bg-green-100",
    bgHover: "hover:bg-green-50",
  },
  cancel: {
    borderColor: "border-red-500",
    bgColor: "bg-red-50/80",
    hoverBg: "hover:bg-red-100/50",
    icon: CircleX,
    iconColor: "text-red-600",
    label: "کنسلی کلاس",
    dotColor: "bg-red-500",
    lightBg: "bg-red-100",
    bgHover: "hover:bg-red-50",
  },
  correction: {
    borderColor: "border-yellow-500",
    bgColor: "bg-yellow-50/80",
    hoverBg: "hover:bg-yellow-100/50",
    icon: Pencil,
    iconColor: "text-yellow-600",
    label: "اصلاحیه",
    dotColor: "bg-yellow-500",
    lightBg: "bg-yellow-100",
    bgHover: "hover:bg-yellow-50",
  },
};

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

  const markAsRead = async (noticeId: string) => {
    try {
      const response = await fetch(`/api/notices?id=${noticeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isRead: true }),
      });
      if (response.ok) {
        setNotices((prev) =>
          prev.map((notice) =>
            notice._id === noticeId ? { ...notice, isRead: true } : notice,
          ),
        );
        setFilteredNotices((prev) =>
          prev.map((notice) =>
            notice._id === noticeId ? { ...notice, isRead: true } : notice,
          ),
        );
      }
    } catch (error) {
      console.error("Error marking notice as read:", error);
    }
  };

  // فیلتر کردن اعلان‌ها
  useEffect(() => {
    let filtered = [...notices];

    // فیلتر بر اساس نوع
    if (selectedType !== "all") {
      filtered = filtered.filter((notice) => notice.type === selectedType);
    }

    // فیلتر بر اساس تاریخ
    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (dateFilter === "today") {
        filtered = filtered.filter((notice) => {
          const noticeDate = new Date(notice.createdAt);
          return noticeDate >= today;
        });
      } else if (dateFilter === "week") {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter((notice) => {
          const noticeDate = new Date(notice.createdAt);
          return noticeDate >= weekAgo;
        });
      } else if (dateFilter === "month") {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        filtered = filtered.filter((notice) => {
          const noticeDate = new Date(notice.createdAt);
          return noticeDate >= monthAgo;
        });
      }
    }

    // جستجو در عنوان و متن
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(
        (notice) =>
          notice.title.toLowerCase().includes(query) ||
          notice.content.toLowerCase().includes(query),
      );
    }

    setFilteredNotices(filtered);
  }, [searchQuery, selectedType, dateFilter, notices]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setDateFilter("all");
  };

  const getTypeBadgeClass = (type: string) => {
    const config = typeConfig[type as keyof typeof typeConfig];
    return `${config.lightBg} ${config.iconColor}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-text-secondary font-iranSans">
            ...درحال بارگذاری
          </p>
        </div>
      </div>
    );
  }

  const unreadCount = notices.filter((n) => !n.isRead).length;

  return (
    <div dir="rtl" className="min-h-screen mt-10 sm:mt-30 bg-bg py-8 md:py-12">
      <Container>
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-slate-50 to-blue-50 p-6 md:p-8 shadow-sm mb-8">
          {/* Background Glow */}
          <div className="absolute -top-16 -left-16 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-20 right-0 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* Left */}
            <div className="flex items-start gap-5">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/25">
                <Bell
                  className={`h-8 w-8 text-white ${
                    unreadCount > 0
                      ? "animate-[ring_2s_ease-in-out_infinite]"
                      : ""
                  }`}
                />

                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-lg animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-iranBold tracking-tight text-slate-900">
                  مرکز اعلانات
                </h1>

                <p className="mt-2 max-w-xl text-sm md:text-base leading-7 text-slate-500 font-iranSans">
                  آخرین اخبار، تغییرات کلاس‌ها، اطلاعیه‌های آموزشی و اصلاحیه‌های
                  مجموعه علمی منتظران
                </p>
              </div>
            </div>

            {/* Right Stats */}

            <div className="flex flex-wrap gap-3">
              <div className="rounded-2xl border border-slate-200 bg-white/80 px-5 py-3 shadow-sm backdrop-blur">
                <p className="text-xs text-slate-500 font-iranSans">
                  کل اعلان‌ها
                </p>
                <p className="mt-1 text-2xl font-iranBold text-slate-900">
                  {notices.length}
                </p>
              </div>

              <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 shadow-sm">
                <p className="text-xs text-red-500 font-iranSans">
                  خوانده نشده
                </p>
                <p className="mt-1 text-2xl font-iranBold text-red-600">
                  {unreadCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-surface rounded-2xl shadow-sm border border-border p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در عنوان و متن اعلان‌ها..."
                className="w-full bg-bg border border-border rounded-xl py-2.5 pr-10 pl-4 text-text-primary font-iranSans placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-bg border border-border rounded-xl text-text-secondary font-iranSans hover:bg-border/50 transition-colors whitespace-nowrap"
            >
              <Filter className="h-5 w-5" />
              فیلترها
              <ChevronDown
                className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </button>

            {/* Clear Filters */}
            {(searchQuery ||
              selectedType !== "all" ||
              dateFilter !== "all") && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 font-iranSans hover:bg-red-100 transition-colors whitespace-nowrap"
              >
                <X className="h-4 w-4" />
                پاک کردن فیلترها
              </button>
            )}
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
                  {/* Type Filter */}
                  <div>
                    <label className="block text-sm font-iranBold text-text-primary mb-2">
                      نوع اعلان
                    </label>
                    <div className="flex flex-wrap gap-2">
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
                              className={`px-3 py-1.5 rounded-lg text-sm font-iranSans transition-all ${
                                isSelected
                                  ? config
                                    ? `${config.lightBg} ${config.iconColor} border-2 ${config.borderColor}`
                                    : "bg-primary text-text-invert border-2 border-primary"
                                  : "bg-bg text-text-secondary border-2 border-transparent hover:bg-border/50"
                              }`}
                            >
                              {type === "all" ? "همه" : config?.label}
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>

                  {/* Date Filter */}
                  <div>
                    <label className="block text-sm font-iranBold text-text-primary mb-2">
                      بازه زمانی
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: "all", label: "همه" },
                        { value: "today", label: "امروز" },
                        { value: "week", label: "هفته اخیر" },
                        { value: "month", label: "ماه اخیر" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setDateFilter(option.value)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-iranSans transition-all ${
                            dateFilter === option.value
                              ? "bg-primary text-text-invert border-2 border-primary"
                              : "bg-bg text-text-secondary border-2 border-transparent hover:bg-border/50"
                          }`}
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

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-iranSans text-text-secondary">
            {filteredNotices.length} اعلان یافت شد
          </p>
        </div>

        {/* Notices List */}
        <div className="space-y-4">
          {filteredNotices.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface rounded-2xl border border-border p-12 text-center shadow-sm"
            >
              <Bell className="mx-auto h-16 w-16 text-text-secondary/30" />
              <p className="mt-4 text-lg font-iranBold text-text-primary">
                هیچ اعلانی یافت نشد
              </p>
              <p className="mt-2 text-text-secondary font-iranSans">
                {searchQuery || selectedType !== "all" || dateFilter !== "all"
                  ? "با فیلترهای دیگری جستجو کنید"
                  : "هنوز اعلانی ثبت نشده است"}
              </p>
            </motion.div>
          ) : (
            filteredNotices.map((notice, index) => {
              const config = typeConfig[notice.type] || typeConfig.news;
              const IconComponent = config.icon;

              return (
                <motion.div
                  key={notice._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`group relative overflow-hidden rounded-2xl border-r-4 ${config.borderColor} bg-surface shadow-sm transition-all hover:shadow-md ${config.bgHover} ${
                    !notice.isRead ? "border-l-4 border-l-blue-400" : ""
                  }`}
                >
                  <div className={`p-5 md:p-6 ${config.bgColor}`}>
                    <div className="flex items-start gap-4">
                      {/* Icon Section */}
                      <div className="flex-shrink-0">
                        {notice.image ? (
                          <div className="relative h-16 w-16 overflow-hidden rounded-xl">
                            <Image
                              src={notice.image}
                              alt={notice.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div
                            className={`flex h-16 w-16 items-center justify-center rounded-xl ${config.lightBg} ${config.iconColor} transition-transform group-hover:scale-105`}
                          >
                            <IconComponent className="h-8 w-8" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            {/* عنوان درشت با فونت توپر */}
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-iranBold text-text-primary group-hover:text-primary transition-colors leading-tight">
                              {notice.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-iranBold ${getTypeBadgeClass(notice.type)}`}
                              >
                                <span
                                  className={`w-2 h-2 rounded-full ${config.dotColor}`}
                                />
                                {config.label}
                              </span>
                              {!notice.isRead && (
                                <span className="inline-flex items-center gap-1.5 text-xs font-iranBold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                  جدید
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-text-secondary whitespace-nowrap mt-1">
                            <Clock className="h-4 w-4" />
                            <span className="font-iranSans">
                              {formatPersianDate(notice.createdAt)}
                            </span>
                          </div>
                        </div>
                        <p className="mt-3 text-text-secondary font-iranSans leading-relaxed text-base md:text-lg">
                          {notice.content}
                        </p>

                        {!notice.isRead && (
                          <button
                            onClick={() => markAsRead(notice._id)}
                            className="mt-3 inline-flex items-center gap-1.5 text-sm font-iranBold text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <span>علامت‌گذاری به عنوان خوانده شده</span>
                            <span className="text-xs">←</span>
                          </button>
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
