"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, FileText } from "lucide-react";

interface NoticeCardProps {
  item: {
    type: "schedule" | "cancel" | "news";
    title: string;
    location?: string;
    instructor?: string;
    startTime?: string;
    content?: string;
    createdAt: string;
  };
}

const toPersianNum = (num: number | string) => 
  num.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);

export default function NoticeCard({ item }: NoticeCardProps) {
  const [statusText, setStatusText] = useState("");

  useEffect(() => {
    if (item.type !== "schedule" || !item.startTime) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const target = new Date(item.startTime!).getTime();
      const diff = target - now;
      const oneHour = 60 * 60 * 1000;

      if (diff > 0) {
        // Calculate remaining countdown safely
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setStatusText(`شروع در: ${days > 0 ? toPersianNum(days) + " روز و " : ""}${toPersianNum(hours)} ساعت`);
      } else if (diff <= 0 && diff >= -oneHour) {
        setStatusText("کلاس در حال برگزاری است");
      } else {
        setStatusText("کلاس پایان یافت");
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [item]);

  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 transition hover:shadow-md" dir="rtl">
      
      {/* Right Content Block */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        {item.type === "schedule" && <CheckCircle className="w-12 h-12 text-green-500 shrink-0" />}
        {item.type === "cancel" && <XCircle className="w-12 h-12 text-red-500 shrink-0" />}
        {item.type === "news" && <FileText className="w-12 h-12 text-blue-500 shrink-0" />}

        <div className="font-[iranSans-r] text-gray-700 space-y-1">
          <h3 className="font-bold text-lg text-slate-800">{item.title}</h3>
          {item.type !== "news" ? (
            <p className="text-sm text-gray-500">
              مکان: {item.location} | استاد: {item.instructor}
            </p>
          ) : (
            <p className="text-sm text-gray-600 leading-relaxed max-w-xl">{item.content}</p>
          )}
        </div>
      </div>

      {/* Left Action/Badge Status Block */}
      <div className="w-full md:w-auto flex justify-end shrink-0">
        {item.type === "schedule" && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-amber-600">{statusText}</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </div>
        )}
        {item.type === "cancel" && (
          <div className="bg-white border border-red-500 text-red-600 px-4 py-2 rounded-lg font-bold text-sm">
            کنسل شد
          </div>
        )}
        {item.type === "news" && (
          <span className="text-xs text-gray-400">
            انتشار: {toPersianNum(new Date(item.createdAt).toLocaleDateString("fa-IR"))}
          </span>
        )}
      </div>
    </div>
  );
}