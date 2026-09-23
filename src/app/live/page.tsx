// src/app/live/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Container from "@/component/Container";
import { motion } from "framer-motion";
import {
  Clock,
  Calendar,
  Users,
  Tv,
  Signal,
  Radio,
  Info,
  User,
  Tag,
  FileText,
  Share2,
  Link2,
} from "lucide-react";

export default function LivePage() {
  const [liveData, setLiveData] = useState<any>(null);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    fetch("/api/live")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLiveData(data.currentLive);
          setUpcoming(data.upcomingStreams);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
          <h1 className="font-[iranBold] text-2xl md:text-3xl lg:text-4xl text-primary mb-3">
            پخش زنده
          </h1>
          <p className="text-text-secondary text-sm md:text-base max-w-2xl mx-auto">
            لحظات ناب علمی را به صورت زنده با ما تجربه کنید
          </p>
        </motion.div>

        {/* قاب تلویزیون / آی فریم آپارات */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative mx-auto max-w-5xl"
        >
          <div
            className={`
              relative bg-gradient-to-b from-zinc-900 to-zinc-800 
              rounded-3xl p-3 md:p-5 shadow-2xl shadow-zinc-900/30
              border-4 border-zinc-700
              ${isFullscreen ? "fixed inset-0 z-50 rounded-none p-0 border-0" : ""}
            `}
          >
            <div className="relative bg-black rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
              {liveData?.aparatEmbedUrl ? (
                // نمایش آی‌فریم آپارات در صورت وجود لینک
                <div
                  className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full"
                  dangerouslySetInnerHTML={{ __html: liveData.aparatEmbedUrl }}
                />
              ) : (
                // حالت انتظار اگر پخشی فعال نباشد
                <div className="relative w-full h-full bg-gradient-to-br from-blue-950 via-indigo-950 to-purple-950 flex items-center justify-center">
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                    <Signal className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span className="text-white/80 text-xs">
                      آفلاین / آماده
                    </span>
                  </div>
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
                          به زودی برنامه‌ها آغاز خواهد شد...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
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
                  <span>
                    {liveData?.status === "live" ? "در حال پخش" : "آماده پخش"}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <DetailItem
                    icon={<Tv className="text-blue-600" />}
                    label="عنوان برنامه"
                    value={liveData?.title}
                    loading={loading}
                  />
                  <DetailItem
                    icon={<User className="text-purple-600" />}
                    label="مجری"
                    value={liveData?.host}
                    loading={loading}
                  />
                  <DetailItem
                    icon={<Calendar className="text-emerald-600" />}
                    label="تاریخ پخش"
                    value={liveData?.date}
                    loading={loading}
                  />
                  <DetailItem
                    icon={<Clock className="text-amber-600" />}
                    label="زمان پخش"
                    value={liveData?.time}
                    loading={loading}
                  />
                </div>
                <div className="space-y-4">
                  <DetailItem
                    icon={<Tag className="text-cyan-600" />}
                    label="دسته‌بندی"
                    value={liveData?.category}
                    loading={loading}
                  />
                  <DetailItem
                    icon={<Radio className="text-rose-600" />}
                    label="وضعیت"
                    value={liveData?.status === "live" ? "زنده" : "در انتظار"}
                    loading={loading}
                  />
                  <DetailItem
                    icon={<FileText className="text-teal-600" />}
                    label="توضیحات"
                    value={liveData?.description}
                    loading={loading}
                  />
                </div>
              </div>

              {/* مهمانان */}
              {liveData?.guests?.length > 0 && (
                <div className="mt-6 pt-6 border-t border-zinc-100">
                  <div className="flex items-center gap-2 text-text-secondary text-sm mb-3">
                    <Users className="w-4 h-4" />
                    <span>مهمانان</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {liveData.guests.map((guest: string, index: number) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-zinc-100 rounded-full text-xs text-text-secondary border border-zinc-200"
                      >
                        {guest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* آمار */}
              <div className="mt-6 pt-6 border-t border-zinc-100">
                <div className="grid grid-cols-3 gap-4">
                  <StatBox
                    label="بینندگان"
                    value={liveData?.viewersCount || 0}
                    loading={loading}
                  />
                  <StatBox
                    label="پسندیده‌ها"
                    value={liveData?.likesCount || 0}
                    loading={loading}
                  />
                  <StatBox
                    label="نظرات"
                    value={liveData?.commentsCount || 0}
                    loading={loading}
                  />
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
              {upcoming.length > 0 ? (
                upcoming.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-slate-50 rounded-xl border border-zinc-100"
                  >
                    <h5 className="font-[iranBold] text-xs text-primary mb-2">
                      {item.title}
                    </h5>
                    <div className="flex items-center gap-3 text-xs text-text-secondary">
                      <span>{item.date}</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-text-secondary col-span-3 text-center py-2">
                  {" "}
                  برنامه‌ای ثبت نشده است.
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </Container>
  );
}

function DetailItem({ icon, label, value, loading }: any) {
  return (
    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-zinc-100">
      <div className="p-2 bg-blue-50 rounded-lg">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-text-secondary">{label}</p>
        {loading ? (
          <div className="h-5 bg-zinc-200/60 rounded w-3/4 animate-pulse mt-1" />
        ) : (
          <p className="text-sm font-[iranBold] text-primary mt-1">
            {value || "---"}
          </p>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value, loading }: any) {
  return (
    <div className="p-4 bg-slate-50 rounded-xl border border-zinc-100 text-center">
      {loading ? (
        <div className="h-6 bg-zinc-200/60 rounded w-12 mx-auto animate-pulse mb-1" />
      ) : (
        <div className="text-xl font-[iranBold] text-primary mb-1">{value}</div>
      )}
      <p className="text-xs text-text-secondary">{label}</p>
    </div>
  );
}
