"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Container from "@/component/Container";
import { motion } from "framer-motion";
import { CalendarDays, ArrowRight, Filter, Clock } from "lucide-react";

interface IEvent {
  day: number;
  title: string;
  type: "exam" | "class" | "workshop" | "other";
  hour?: string;
  minute?: string;
}

interface IMonthData {
  _id: string;
  year: number;
  monthNumber: number;
  monthName: string;
  startDayOfWeek?: number;
  events: IEvent[];
}

const WEEK_DAYS = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنج‌شنبه",
  "جمعه",
];

export default function CalendarPage() {
  const [months, setMonths] = useState<IMonthData[]>([]);
  const [selectedMonthId, setSelectedMonthId] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/calendar")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.months.length > 0) {
          setMonths(data.months);
          setSelectedMonthId(data.months[Math.floor(data.months.length / 2)]._id);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const currentMonth = months.find((m) => m._id === selectedMonthId) || months[0];
  const totalDays = 30;

  const getDayName = (dayNum: number, startDay: number = 0) => {
    const calculatedIndex = (startDay + (dayNum - 1)) % 7;
    return WEEK_DAYS[calculatedIndex];
  };

  const getEventCardStyle = (type?: string) => {
    switch (type) {
      case "exam":
        return "bg-emerald-50/90 border-emerald-200 text-emerald-900";
      case "class":
        return "bg-blue-50/90 border-blue-200 text-blue-900";
      case "workshop":
        return "bg-amber-50/90 border-amber-200 text-amber-900";
      default:
        return "bg-white border-slate-100 text-slate-700";
    }
  };

  return (
    <Container>
      <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/60 relative overflow-hidden dir-rtl font-[iranSans-r] min-h-screen">
        
        {/* دکمه بازگشت */}
        <div className="w-full max-w-6xl mx-auto mb-8 px-4 relative z-10">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-[iranBold] text-teal-700 bg-teal-50 border border-teal-200 px-4 py-2 rounded-xl hover:bg-teal-100 transition shadow-sm"
          >
            <ArrowRight className="w-4 h-4" />
            <span>بازگشت به قطب‌نمای علم</span>
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-6xl mx-auto mb-10 text-center px-4 relative z-10"
        >
          <div className="inline-flex p-3 bg-teal-100 rounded-2xl border border-teal-200 text-teal-700 mb-4 shadow-sm">
            <CalendarDays className="w-8 h-8" />
          </div>
          <h1 className="font-[iranBold] text-primary text-3xl sm:text-4xl tracking-tight mb-2">
            تقویم رویدادهای علمی منتظران
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm">برنامه‌ریزی دقیق کلاس‌ها و آزمون‌های ماهانه</p>
        </motion.div>

        {/* انتخاب ماه */}
        {!loading && months.length > 0 && (
          <div className="w-full max-w-6xl mx-auto mb-6 px-4 flex flex-wrap justify-center items-center gap-3 relative z-10">
            {months.map((m) => (
              <button
                key={m._id}
                onClick={() => setSelectedMonthId(m._id)}
                className={`px-6 py-2.5 rounded-2xl font-[iranBold] text-xs sm:text-sm transition-all duration-300 shadow-sm border ${
                  m._id === selectedMonthId
                    ? "bg-teal-600 text-white border-teal-600 shadow-md scale-105"
                    : "bg-white text-slate-600 border-slate-200 hover:border-teal-300"
                }`}
              >
                {m.monthName} {m.year}
              </button>
            ))}
          </div>
        )}

        {/* فیلترهای بالا */}
        <div className="w-full max-w-6xl mx-auto mb-10 px-4 flex flex-wrap justify-center items-center gap-2 relative z-10 text-xs">
          <span className="flex items-center gap-1 text-slate-500 ml-2 font-[iranBold]">
            <Filter className="w-3.5 h-3.5" /> فیلتر:
          </span>
          <button onClick={() => setFilterType("all")} className={`px-3.5 py-1.5 rounded-xl border transition ${filterType === 'all' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200'}`}>همه رویدادها</button>
          <button onClick={() => setFilterType("class")} className={`px-3.5 py-1.5 rounded-xl border transition ${filterType === 'class' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-200'}`}>فقط کلاس‌ها</button>
          <button onClick={() => setFilterType("exam")} className={`px-3.5 py-1.5 rounded-xl border transition ${filterType === 'exam' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-600 border-emerald-200'}`}>آزمون‌های جامع</button>
          <button onClick={() => setFilterType("workshop")} className={`px-3.5 py-1.5 rounded-xl border transition ${filterType === 'workshop' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-amber-600 border-amber-200'}`}>کارگاه‌ها</button>
        </div>

        {/* لیست کارت‌های تقویم: موبایل تکی (grid-cols-1) و دسکتاپ سه تایی (lg:grid-cols-3) */}
        {loading ? (
          <div className="py-20 text-center text-slate-500 font-[iranSans-r]">در حال دریافت اطلاعات...</div>
        ) : (
          <div className="w-full max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
            {[...Array(totalDays)].map((_, index) => {
              const dayNum = index + 1;
              const eventData = currentMonth?.events?.find((e) => e.day === dayNum);

              if (filterType !== "all" && (!eventData || eventData.type !== filterType)) {
                return null;
              }

              const weekDayName = getDayName(dayNum, currentMonth?.startDayOfWeek ?? 0);

              return (
                <motion.div
                  key={dayNum}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.01 }}
                  className={`flex flex-col justify-between p-4 sm:p-5 rounded-2xl border-2 shadow-sm ${getEventCardStyle(eventData?.type)}`}
                >
                  {/* هدر کارت: تاریخ در چپ و نوع رویداد در راست */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 mb-3">
                    {/* تاریخ با فرمت درخواستی: دوشنبه | مهر 6 */}
                    <div className="text-left font-[iranBold] text-xs sm:text-sm text-slate-700 flex  items-center gap-1.5">
                      <span className="text-teal-700">{weekDayName}</span>
                      <span className="text-slate-400">|</span>
                      <div className="flex flex-row-reverse gap-0.5">
                        <span>{dayNum}</span>
                        <span>{currentMonth?.monthName}</span>
                      </div>
                    </div>

                    {/* تگ نوع رویداد */}
                    <div>
                      {eventData && (
                        <span className={`text-[11px] px-2.5 py-1 rounded-lg font-medium inline-block ${
                          eventData.type === 'exam' ? 'bg-emerald-100 text-emerald-800' :
                          eventData.type === 'workshop' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {eventData.type === 'exam' ? 'آزمون' : eventData.type === 'workshop' ? 'کارگاه' : 'کلاس'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* بدنه کارت: نام رویداد و ساعت برگزاری */}
                  <div className="text-center py-2">
                    {eventData ? (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <span className="font-[iranBold] text-sm sm:text-base text-slate-900">{eventData.title}</span>
                        {eventData.hour && (
                          <span className="text-xs bg-white/90 px-3 py-1 rounded-lg border border-slate-200 flex items-center gap-1.5 text-slate-600 font-medium shadow-2xs">
                            <Clock className="w-3.5 h-3.5 text-teal-600" />
                            ساعت برگزاری: {eventData.hour}:{eventData.minute || "00"}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="text-slate-400 text-xs sm:text-sm flex items-center justify-center gap-1.5 font-[iranSans-r] py-2">
                        <span>بدون رویداد</span>
                        <span>😔</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </section>
    </Container>
  );
}