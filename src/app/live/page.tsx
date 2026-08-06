// src/app/live/page.tsx
"use client";

import React, { useState } from "react";
import Container from "@/component/Container";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Clock,
  Calendar,
  Users,
  Eye,
  ThumbsUp,
  MessageCircle,
  Share2,
  Link2,
  Tv,
  Signal,
  Mic,
  Camera,
  MonitorPlay,
  Radio,
  Info,
  User,
  Tag,
  FileText,
} from "lucide-react";

export default function LivePage() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(80);

  return (
    <Container>
      <div className="min-h-screen mt-10 sm:mt-30 py-8 md:py-12 bg-gradient-to-b from-slate-50 via-white to-slate-50/80 font-[iranSans-r] dir-rtl">
        {/* هدر صفحه */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
               
            <h1 className="font-[iranBold] text-2xl md:text-3xl lg:text-4xl text-primary">
                پخش زنده
            </h1>
          </div>
          <p className="text-text-secondary text-sm md:text-base max-w-2xl mx-auto">
            لحظات ناب علمی را به صورت زنده با ما تجربه کنید
          </p>
        </motion.div>

        {/* قاب تلویزیون */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative mx-auto max-w-5xl"
        >
          {/* بدنه تلویزیون */}
          <div
            className={`
              relative bg-gradient-to-b from-zinc-900 to-zinc-800 
              rounded-3xl p-3 md:p-5 shadow-2xl shadow-zinc-900/30
              border-4 border-zinc-700
              ${isFullscreen ? "fixed inset-0 z-50 rounded-none p-0 border-0" : ""}
            `}
          >
            {/* صفحه نمایش */}
            <div className="relative bg-black rounded-2xl overflow-hidden aspect-video">
              <div className="relative w-full h-full bg-gradient-to-br from-blue-950 via-indigo-950 to-purple-950">
                {/* افکت‌های پس‌زمینه */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
                  <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-cyan-500/5 to-transparent blur-2xl" />
                </div>

                {/* افکت اسکن لاین */}
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.03)_2px,rgba(0,0,0,0.03)_4px)] pointer-events-none" />

                {/* وضعیت پخش */}
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                  <Signal className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span className="text-white/80 text-xs">آنلاین</span>
                </div>

                {/* اطلاعات مرکزی */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-3 bg-black/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Tv className="w-6 h-6 md:w-8 md:h-8 text-white" />
                      </div>
                      <div className="text-right">
                        <h2 className="text-white font-[iranBold] text-sm md:text-lg">
                          در انتظار پخش
                        </h2>
                        <p className="text-white/70 text-xs md:text-sm">
                        ...به زودی
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* کنترل‌های پایین صفحه */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-white/60 text-xs min-w-[40px]">
                      0:00
                    </span>
                    <div className="flex-1 h-1 bg-white/20 rounded-full cursor-pointer relative group">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-100"
                        style={{ width: "0%" }}
                      />
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{
                          left: "0%",
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                    </div>
                    <span className="text-white/60 text-xs min-w-[40px]">
                      --:--
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 md:gap-2">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-1.5 md:p-2 rounded-full hover:bg-white/10 transition-colors text-white"
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4 md:w-5 md:h-5" />
                        ) : (
                          <Play className="w-4 h-4 md:w-5 md:h-5" />
                        )}
                      </button>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setIsMuted(!isMuted)}
                          className="p-1.5 md:p-2 rounded-full hover:bg-white/10 transition-colors text-white"
                        >
                          {isMuted ? (
                            <VolumeX className="w-4 h-4 md:w-5 md:h-5" />
                          ) : (
                            <Volume2 className="w-4 h-4 md:w-5 md:h-5" />
                          )}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={isMuted ? 0 : volume}
                          onChange={(e) => setVolume(parseInt(e.target.value))}
                          className="w-12 md:w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer accent-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1 md:gap-2">
                      <button className="p-1.5 md:p-2 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white">
                        <Mic className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </button>
                      <button className="p-1.5 md:p-2 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white">
                        <Camera className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </button>
                      <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-1.5 md:p-2 rounded-full hover:bg-white/10 transition-colors text-white"
                      >
                        {isFullscreen ? (
                          <Minimize2 className="w-4 h-4 md:w-5 md:h-5" />
                        ) : (
                          <Maximize2 className="w-4 h-4 md:w-5 md:h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* نشان کیفیت */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                  <span className="text-white/80 text-xs">HD</span>
                </div>
              </div>
            </div>

            {/* پایه تلویزیون */}
            {!isFullscreen && (
              <div className="flex justify-center mt-2">
                <div className="w-16 h-1.5 bg-zinc-600 rounded-full" />
              </div>
            )}
          </div>

          {/* دکمه اشتراک‌گذاری */}
          {!isFullscreen && (
            <div className="absolute -top-3 -left-3 flex gap-1">
              <button className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-zinc-100">
                <Share2 className="w-4 h-4 text-text-secondary" />
              </button>
              <button className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-zinc-100">
                <Link2 className="w-4 h-4 text-text-secondary" />
              </button>
            </div>
          )}
        </motion.div>

        {/* جدول جزئیات */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-zinc-100 overflow-hidden">
            <div className="p-6 border-b border-zinc-100 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
              <div className="flex items-center justify-between">
                <h3 className="font-[iranBold] text-primary text-lg flex items-center gap-2">
                  <Info className="w-5 h-5 text-secondary" />
                  جزئیات پخش
                </h3>
                <div className="flex items-center gap-2 text-xs text-text-secondary bg-white/80 px-3 py-1.5 rounded-full border border-zinc-200">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>آماده پخش</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ستون اول */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-zinc-100">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Tv className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-text-secondary">
                        عنوان برنامه
                      </p>
                      <div className="h-6 bg-zinc-200/60 rounded w-full animate-pulse mt-1" />
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-zinc-100">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <User className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-text-secondary">مجری</p>
                      <div className="h-6 bg-zinc-200/60 rounded w-3/4 animate-pulse mt-1" />
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-zinc-100">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-text-secondary">تاریخ پخش</p>
                      <div className="h-6 bg-zinc-200/60 rounded w-2/3 animate-pulse mt-1" />
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-zinc-100">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Clock className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-text-secondary">زمان پخش</p>
                      <div className="h-6 bg-zinc-200/60 rounded w-1/2 animate-pulse mt-1" />
                    </div>
                  </div>
                </div>

                {/* ستون دوم */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-zinc-100">
                    <div className="p-2 bg-cyan-100 rounded-lg">
                      <Tag className="w-4 h-4 text-cyan-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-text-secondary">دسته‌بندی</p>
                      <div className="h-6 bg-zinc-200/60 rounded w-2/3 animate-pulse mt-1" />
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-zinc-100">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <MonitorPlay className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-text-secondary">کیفیت</p>
                      <div className="h-6 bg-zinc-200/60 rounded w-1/3 animate-pulse mt-1" />
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-zinc-100">
                    <div className="p-2 bg-rose-100 rounded-lg">
                      <Radio className="w-4 h-4 text-rose-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-text-secondary">وضعیت</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 rounded-full bg-zinc-300 animate-pulse" />
                        <span className="text-sm text-text-secondary">
                          در انتظار
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-zinc-100">
                    <div className="p-2 bg-teal-100 rounded-lg">
                      <FileText className="w-4 h-4 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-text-secondary">توضیحات</p>
                      <div className="space-y-1.5 mt-1">
                        <div className="h-2 bg-zinc-200/60 rounded w-full animate-pulse" />
                        <div className="h-2 bg-zinc-200/60 rounded w-5/6 animate-pulse" />
                        <div className="h-2 bg-zinc-200/60 rounded w-4/6 animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* مهمانان */}
              <div className="mt-6 pt-6 border-t border-zinc-100">
                <div className="flex items-center gap-2 text-text-secondary text-sm mb-3">
                  <Users className="w-4 h-4" />
                  <span>مهمانان</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3].map((_, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 bg-zinc-100 rounded-full border border-zinc-200 min-w-[80px] animate-pulse"
                    >
                      <div className="h-4 bg-zinc-200 rounded w-16" />
                    </div>
                  ))}
                </div>
              </div>

              {/* آمار */}
              <div className="mt-6 pt-6 border-t border-zinc-100">
                <div className="grid grid-cols-3 gap-4">
                  {["بینندگان", "پسندیده‌ها", "نظرات"].map((label, index) => (
                    <div
                      key={index}
                      className="p-4 bg-slate-50 rounded-xl border border-zinc-100 text-center"
                    >
                      <div className="text-2xl font-[iranBold] text-primary mb-1">
                        <span className="inline-block w-12 h-6 bg-zinc-200/60 rounded animate-pulse" />
                      </div>
                      <p className="text-xs text-text-secondary">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* برنامه‌های بعدی */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-zinc-100 p-6">
            <h4 className="font-[iranBold] text-primary text-sm mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-secondary" />
              برنامه‌های بعدی
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[1, 2, 3].map((_, index) => (
                <div
                  key={index}
                  className="p-4 bg-slate-50 rounded-xl border border-zinc-100"
                >
                  <div className="h-5 bg-zinc-200/60 rounded w-3/4 animate-pulse mb-2" />
                  <div className="flex items-center gap-3">
                    <div className="h-4 bg-zinc-200/60 rounded w-16 animate-pulse" />
                    <div className="h-4 bg-zinc-200/60 rounded w-20 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </Container>
  );
}
