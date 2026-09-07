// Notice card component
"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Calendar, CheckCircle2, Eye, X } from "lucide-react";
import { Notice, typeConfig, formatPersianDate, formatPersianShortDate } from "./constants";

interface NoticeCardProps {
  notice: Notice;
  index: number;
  onMarkAsRead: (id: string) => void;
}

export default function NoticeCard({ notice, index, onMarkAsRead }: NoticeCardProps) {
  const [showImageModal, setShowImageModal] = useState(false);
  const config = typeConfig[notice.type] || typeConfig.news;
  const IconComponent = config.icon;

  // بررسی حالت نمایش تصویر (پیش‌فرض عمودی)
  const isHorizontal = notice.imageLayout === "horizontal";

  return (
    <>
      <motion.div
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
          <div className="flex flex-col md:flex-row items-center md:items-start gap-5 text-center md:text-right">

            {/* Poster / Image (Dynamic Layout Support) or Icon */}
            <div className="flex-shrink-0 flex justify-center w-full md:w-auto">
              {notice.image ? (
                <div 
                  onClick={() => setShowImageModal(true)}
                  className={`relative overflow-hidden rounded-xl shadow-md border border-[var(--color-border)] cursor-pointer group/img bg-black/5 ${
                    isHorizontal 
                      ? "w-full md:w-80 h-44 object-cover" // حالت افقی (بنر عریض)
                      : "h-44 w-32 md:h-36 md:w-28"       // حالت عمودی (کارت‌مانند)
                  }`}
                >
                  <Image
                    src={notice.image}
                    alt={notice.title}
                    fill
                    className="object-cover group-hover/img:scale-105 transition-transform duration-300"
                  />
                  {/* Overlay on hover for poster */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs gap-1">
                    <Eye className="w-4 h-4" />
                    <span style={{ fontFamily: "iranSans-r" }}>بزرگنمایی</span>
                  </div>
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
                    <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
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

                {/* Dates Section (Created At & Event Date) */}
                <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 text-xs text-[var(--color-text-secondary)]">
                  {/* تاریخ رویداد (در صورت وجود) */}
                  {notice.eventDate && (
                    <div 
                      className="flex items-center gap-1 text-amber-700 bg-amber-100/70 px-2.5 py-1 rounded-lg font-medium"
                      title="تاریخ برگزاری رویداد"
                    >
                      <Calendar className="h-3.5 w-3.5 text-amber-600" />
                      <span style={{ fontFamily: "iranSans-r" }}>
                        رویداد: {notice.eventDate}
                      </span>
                    </div>
                  )}

                  {/* تاریخ ثبت */}
                  <div className="flex items-center gap-1.5" title="تاریخ ثبت اعلان">
                    <Clock className="h-3.5 w-3.5" />
                    <span style={{ fontFamily: "iranSans-r" }}>
                      ثبت: {formatPersianDate(notice.createdAt)}
                    </span>
                  </div>
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
                    onClick={() => onMarkAsRead(notice._id)}
                    className="group/btn relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden"
                    style={{ fontFamily: "iranBold" }}
                  >
                    <span className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></span>
                    <CheckCircle2 className="h-4 w-4 relative z-10 text-white" />
                    <span className="relative z-10">متوجه شدم / خواندم</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Lightbox / Modal for Poster Preview */}
      <AnimatePresence>
        {showImageModal && notice.image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowImageModal(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-2xl w-full max-h-[90vh] overflow-hidden rounded-2xl bg-white p-3 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`relative w-full overflow-hidden rounded-xl bg-gray-100 ${
                isHorizontal ? "h-[50vh]" : "h-[75vh]"
              }`}>
                <Image
                  src={notice.image}
                  alt={notice.title}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="mt-3 flex items-center justify-between px-2">
                <h4 className="text-sm font-bold text-slate-800 truncate" style={{ fontFamily: "iranBold" }}>
                  {notice.title}
                </h4>
                <button
                  onClick={() => setShowImageModal(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-slate-700 p-2 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}