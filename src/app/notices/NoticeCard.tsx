// Notice card component
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, CheckCircle2 } from "lucide-react";
import { Notice, typeConfig, formatPersianDate } from "./constants";

interface NoticeCardProps {
  notice: Notice;
  index: number;
  onMarkAsRead: (id: string) => void;
}

export default function NoticeCard({ notice, index, onMarkAsRead }: NoticeCardProps) {
  const config = typeConfig[notice.type] || typeConfig.news;
  const IconComponent = config.icon;

  return (
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
  );
}