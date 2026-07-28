// components/CalendarSection.tsx
"use client";
import React, { useState, useEffect } from "react";
import Container from "./Container";

interface IEvent {
  day: number;
  title: string;
  type: "exam" | "class" | "workshop" | "other";
}

interface IMonthData {
  _id: string;
  year: number;
  monthNumber: number;
  monthName: string;
  events: IEvent[];
}

export default function CalendarSection() {
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
          // پیش‌فرض ماه میانی (ماه جاری) انتخاب شود
          setSelectedMonthId(data.months[Math.floor(data.months.length / 2)]._id);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="py-20 text-center text-gray-500 font-[iranSans-r]">در حال بارگذاری تقویم علمی...</div>;
  if (months.length === 0) return <div className="py-20 text-center text-gray-500 font-[iranSans-r]">هیچ رویدادی در تقویم ثبت نشده است.</div>;

  const currentMonth = months.find((m) => m._id === selectedMonthId) || months[0];

  // تشخیص تعداد روزهای ماه (برای تقویم شمسی فرض استاندارد ۳۱ روزه یا بر اساس داده‌ها)
  // فرض می‌کنیم هر ماه ۳۰ روز دارد یا بر اساس بیشترین روز ثبت شده
  const totalDays = 30; 

  // تابع تعیین رنگ هاله کارت بر اساس نوع رویداد
  const getEventColorStyle = (type?: string) => {
    switch (type) {
      case "exam":
        return "bg-emerald-50/80 border-emerald-200 text-emerald-900"; // سبز کم‌رنگ آزمون
      case "class":
        return "bg-blue-50/80 border-blue-200 text-blue-900"; // آبی کم‌رنگ کلاس
      case "workshop":
        return "bg-amber-50/80 border-amber-200 text-amber-900"; // زرد/نارنجی کم‌رنگ کارگاه
      default:
        return "bg-white border-slate-100 text-slate-700"; // روزهای بدون رویداد خاص
    }
  };

  return (
    <Container>
      <section className="py-20 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/60 relative overflow-hidden dir-rtl font-[iranSans-r]">
        
        {/* هدر بخش و فیلترهای جذاب بالا */}
        <div className="w-full max-w-4xl mx-auto mb-12 text-center relative z-10">
          <h2 className="font-[iranBold] text-primary text-3xl sm:text-4xl tracking-tight mb-6">
            تقویم رویدادهای علمی منتظران
          </h2>

          {/* فیلتر جذاب انتخاب ماه (ماه قبل، ماه فعلی، ماه بعد) */}
          <div className="flex flex-wrap justify-center items-center gap-3 mb-6">
            {months.map((m) => {
              const isSelected = m._id === selectedMonthId;
              return (
                <button
                  key={m._id}
                  onClick={() => setSelectedMonthId(m._id)}
                  className={`px-6 py-2.5 rounded-2xl font-[iranBold] text-sm transition-all duration-300 shadow-sm border ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 shadow-md scale-105"
                      : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                  }`}
                >
                  {m.monthName} {m.year}
                </button>
              );
            })}
          </div>

          {/* فیلتر نوع رویداد */}
          <div className="flex justify-center gap-2 text-xs">
            <button onClick={() => setFilterType("all")} className={`px-3 py-1 rounded-full border ${filterType === 'all' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600'}`}>همه رویدادها</button>
            <button onClick={() => setFilterType("class")} className={`px-3 py-1 rounded-full border ${filterType === 'class' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-blue-200'}`}>کلاس‌ها</button>
            <button onClick={() => setFilterType("exam")} className={`px-3 py-1 rounded-full border ${filterType === 'exam' ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600 border-emerald-200'}`}>آزمون‌های جامع</button>
            <button onClick={() => setFilterType("workshop")} className={`px-3 py-1 rounded-full border ${filterType === 'workshop' ? 'bg-amber-600 text-white' : 'bg-white text-amber-600 border-amber-200'}`}>کارگاه‌ها</button>
          </div>
        </div>

        {/* کارت‌های عرضی به تعداد روزهای ماه (عمودی و راست به چپ) */}
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-3 relative z-10">
          {[...Array(totalDays)].map((_, index) => {
            const dayNum = index + 1;
            const eventData = currentMonth.events.find((e) => e.day === dayNum);

            // اعمال فیلتر نوع رویداد
            if (filterType !== "all" && eventData && eventData.type !== filterType) {
              return null;
            }

            return (
              <div
                key={dayNum}
                className={`flex flex-row-reverse items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 shadow-sm ${getEventColorStyle(eventData?.type)}`}
              >
                {/* سمت راست: عدد تاریخ روز */}
                <div className="w-12 text-center font-[iranBold] text-lg border-l border-slate-200/60 pl-3">
                  {dayNum}
                </div>

                {/* وسط کارت: نام رویداد یا عبارت روز عادی */}
                <div className="flex-1 px-4 text-right">
                  {eventData ? (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                      <span className="font-[iranBold] text-sm sm:text-base">{eventData.title}</span>
                      <span className="text-xs opacity-75 bg-white/60 px-2 py-0.5 rounded-md mr-auto">
                        {eventData.type === 'exam' ? 'آزمون جامع' : eventData.type === 'workshop' ? 'کارگاه' : 'کلاس آموزشی'}
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-400 text-sm font-[iranSans-r]">بدون رویداد مصوب</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </section>
    </Container>
  );
}