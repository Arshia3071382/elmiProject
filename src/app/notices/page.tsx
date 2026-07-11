"use client";

import { useEffect, useState } from "react";
import Container from "@/component/Container";
import NoticeCard from "./../../component/navbarDet/NoticeCard";

export default function NoticesPage() {
  const [dbNotices, setDbNotices] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Generate date for "the day after tomorrow" dynamically
  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  dayAfterTomorrow.setHours(14, 0, 0, 0);

  // Static items configuration array
  const staticNotices = [
    {
      type: "schedule" as const,
      title: "کلاس آموزش پیشرفته فیزیک کنکور",
      location: "سالن همایش واحد ۱",
      instructor: "آقای مختاری",
      startTime: dayAfterTomorrow.toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      type: "cancel" as const,
      title: "کلاس جبرانی ریاضیات گسسته",
      location: "کلاس ۱۰۴ واحد مرکزی",
      instructor: "آقای داوودآبادی",
      createdAt: new Date().toISOString(),
    },
    {
      type: "news" as const,
      title: "برگزاری آزمون نهایی پایانی پایه دوازدهم",
      content: "دانش‌آموزان پایه دوازدهم موظفند جهت دریافت کارت ورود به جلسه آزمون نهایی هماهنگ کشوری، حداکثر تا پایان هفته به پرتال آموزشی مراجعه فرمایند.",
      createdAt: new Date().toISOString(),
    },
    {
      type: "schedule" as const,
      title: "کارگاه عملی مهندسی نرم‌افزار",
      location: "لابراتوار شماره ۳ واحد فنی",
      instructor: "آقای فرهادی",
      startTime: dayAfterTomorrow.toISOString(),
      createdAt: new Date().toISOString(),
    },
  ];

  // Fetch from Mongo DB API point
  useEffect(() => {
    fetch(`/api/notices?page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDbNotices(data.notices);
          setTotalPages(data.pages);
        }
      });
  }, [page]);

  const allVisibleNotices = page === 1 ? [...staticNotices, ...dbNotices] : dbNotices;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <Container>
        <h1 className="text-2xl font-bold text-slate-800 mb-8 text-right font-[iranBold]">اخبار و اطلاعیه‌ها</h1>
        
        {/* Notices container layout stack */}
        <div className="flex flex-col gap-4">
          {allVisibleNotices.map((notice, idx) => (
            <NoticeCard key={idx} item={notice} />
          ))}
        </div>

        {/* Dynamic Pagination Footer Navigation */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-10" dir="rtl">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white border rounded shadow-sm disabled:opacity-50 text-sm font-[iranSans-r]"
            >
              صفحه قبلی
            </button>
            <span className="text-sm font-[iranSans-r]">صفحه {page} از {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-white border rounded shadow-sm disabled:opacity-50 text-sm font-[iranSans-r]"
            >
              صفحه بعدی
            </button>
          </div>
        )}
      </Container>
    </div>
  );
}