// components/AdminCalendarPanel.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Edit2, Trash2, Check, X } from "lucide-react";

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

export default function AdminCalendarPanel({ onShowMessage }: { onShowMessage: (type: "success" | "error", text: string) => void }) {
  const [year, setYear] = useState<number>(1405);
  const [monthNumber, setMonthNumber] = useState<number>(1);
  const [monthName, setMonthName] = useState<string>("مهر");
  const [startDayOfWeek, setStartDayOfWeek] = useState<number>(0);
  
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [eventTitle, setEventTitle] = useState<string>("");
  const [eventType, setEventType] = useState<"exam" | "class" | "workshop" | "other">("class");
  const [eventHour, setEventHour] = useState<string>("16");
  const [eventMinute, setEventMinute] = useState<string>("00");
  
  const [eventsList, setEventsList] = useState<IEvent[]>([]);
  const [existingMonths, setExistingMonths] = useState<IMonthData[]>([]);
  const [selectedExistingMonthId, setSelectedExistingMonthId] = useState<string>("");

  // دریافت لیست ماه‌های ثبت‌شده برای ویرایش یا حذف
  const fetchMonths = async () => {
    try {
      const res = await fetch("/api/calendar");
      const data = await res.json();
      if (data.success) {
        setExistingMonths(data.months);
      }
    } catch {}
  };

  useEffect(() => {
    fetchMonths();
  }, []);

  // بارگذاری اطلاعات ماه انتخابی برای ویرایش
  const handleSelectMonthToEdit = (monthId: string) => {
    setSelectedExistingMonthId(monthId);
    const found = existingMonths.find(m => m._id === monthId);
    if (found) {
      setYear(found.year);
      setMonthNumber(found.monthNumber);
      setMonthName(found.monthName);
      setStartDayOfWeek(found.startDayOfWeek || 0);
      setEventsList(found.events || []);
    }
  };

  const handleNextDay = () => {
    if (eventTitle.trim()) {
      const existingIndex = eventsList.findIndex(e => e.day === currentDay);
      const newEvent: IEvent = { 
        day: currentDay, 
        title: eventTitle, 
        type: eventType, 
        hour: eventHour, 
        minute: eventMinute 
      };

      if (existingIndex > -1) {
        const updated = [...eventsList];
        updated[existingIndex] = newEvent;
        setEventsList(updated);
      } else {
        setEventsList([...eventsList, newEvent]);
      }
    }

    if (currentDay < 30) {
      setCurrentDay(currentDay + 1);
      // بررسی اینکه آیا برای روز بعد از قبل رویدادی هست یا خیر
      const nextDayEvent = eventsList.find(e => e.day === currentDay + 1);
      if (nextDayEvent) {
        setEventTitle(nextDayEvent.title);
        setEventType(nextDayEvent.type);
        setEventHour(nextDayEvent.hour || "16");
        setEventMinute(nextDayEvent.minute || "00");
      } else {
        setEventTitle("");
        setEventHour("16");
        setEventMinute("00");
      }
    } else {
      onShowMessage("success", "به روز پایانی ماه رسیدید. دکمه ذخیره را بزنید.");
    }
  };

  // ثبت نهایی یا ویرایش ماه
  const handleSaveMonth = async () => {
    let finalEvents = [...eventsList];
    if (eventTitle.trim()) {
      const idx = finalEvents.findIndex(e => e.day === currentDay);
      const newEvent: IEvent = { day: currentDay, title: eventTitle, type: eventType, hour: eventHour, minute: eventMinute };
      if (idx > -1) finalEvents[idx] = newEvent;
      else finalEvents.push(newEvent);
    }

    const payload = { year, monthNumber, monthName, startDayOfWeek, events: finalEvents };

    try {
      const res = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        onShowMessage("success", `ماه ${monthName} با موفقیت ذخیره شد.`);
        fetchMonths();
      } else {
        onShowMessage("error", data.error || "خطا در ذخیره‌سازی");
      }
    } catch {
      onShowMessage("error", "خطا در ارتباط با سرور");
    }
  };

  // حذف کامل یک ماه (مثلاً حذف ماه مهر)
  const handleDeleteMonth = async (monthId: string, name: string) => {
    if (!confirm(`آیا از حذف کامل اطلاعات ماه ${name} اطمینان دارید؟`)) return;

    try {
      const res = await fetch(`/api/calendar?id=${monthId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        onShowMessage("success", `ماه ${name} با موفقیت حذف شد.`);
        fetchMonths();
        if (selectedExistingMonthId === monthId) {
          setSelectedExistingMonthId("");
          setEventsList([]);
        }
      } else {
        onShowMessage("error", data.error || "خطا در حذف ماه");
      }
    } catch {
      onShowMessage("error", "خطا در ارتباط با سرور");
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-right dir-rtl font-[iranSans-r]">
      <h2 className="text-xl font-bold mb-4 text-gray-800">مدیریت، ویرایش و حذف تقویم علمی</h2>
      
      {/* بخش انتخاب ماه برای ویرایش یا حذف سریع */}
      <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <label className="block text-xs font-bold text-gray-700 mb-2">مدیریت ماه‌های ثبت شده (انتخاب برای ویرایش یا حذف):</label>
        <div className="flex flex-wrap gap-2">
          {existingMonths.map((m) => (
            <div key={m._id} className="flex items-center gap-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 shadow-sm">
              <button 
                onClick={() => handleSelectMonthToEdit(m._id)} 
                className="text-xs font-bold text-blue-700 hover:underline"
              >
                {m.monthName} {m.year}
              </button>
              <button 
                onClick={() => handleDeleteMonth(m._id, m.monthName)} 
                className="text-rose-600 hover:text-rose-800 p-1 mr-1"
                title="حذف این ماه"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {existingMonths.length === 0 && <span className="text-xs text-gray-400">هیچ ماهی ثبت نشده است.</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-gray-600 mb-1 text-sm">سال:</label>
          <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-full border p-2 rounded-lg" />
        </div>
        <div>
          <label className="block text-gray-600 mb-1 text-sm">شماره ماه (۱ تا ۱۲):</label>
          <input type="number" value={monthNumber} onChange={(e) => setMonthNumber(Number(e.target.value))} className="w-full border p-2 rounded-lg" />
        </div>
        <div>
          <label className="block text-gray-600 mb-1 text-sm">نام ماه:</label>
          <input type="text" value={monthName} onChange={(e) => setMonthName(e.target.value)} className="w-full border p-2 rounded-lg" />
        </div>
        <div>
          <label className="block text-gray-600 mb-1 text-sm">روز اول ماه:</label>
          <select value={startDayOfWeek} onChange={(e) => setStartDayOfWeek(Number(e.target.value))} className="w-full border p-2 rounded-lg bg-white text-sm">
            <option value={0}>شنبه</option>
            <option value={1}>یکشنبه</option>
            <option value={2}>دوشنبه</option>
            <option value={3}>سه‌شنبه</option>
            <option value={4}>چهارشنبه</option>
            <option value={5}>پنج‌شنبه</option>
            <option value={6}>جمعه</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-blue-600 text-sm">تنظیم رویداد برای روز: {currentDay} {monthName} ماه</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">پرش به روز:</span>
            <select 
              value={currentDay} 
              onChange={(e) => {
                const day = Number(e.target.value);
                setCurrentDay(day);
                const found = eventsList.find(ev => ev.day === day);
                if (found) {
                  setEventTitle(found.title);
                  setEventType(found.type);
                  setEventHour(found.hour || "16");
                  setEventMinute(found.minute || "00");
                } else {
                  setEventTitle("");
                  setEventHour("16");
                  setEventMinute("00");
                }
              }}
              className="border p-1 rounded text-xs bg-white"
            >
              {[...Array(30)].map((_, i) => (
                <option key={i+1} value={i+1}>روز {i+1}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">نام رویداد (خالی = روز عادی):</label>
            <input 
              type="text" 
              value={eventTitle} 
              onChange={(e) => setEventTitle(e.target.value)} 
              placeholder="مثال: کلاس فیزیک پیشرفته" 
              className="w-full border p-2.5 rounded-lg bg-white text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">نوع رویداد:</label>
              <select value={eventType} onChange={(e) => setEventType(e.target.value as any)} className="w-full border p-2 rounded-lg bg-white text-sm">
                <option value="class">کلاس آموزشی</option>
                <option value="exam">آزمون جامع</option>
                <option value="workshop">کارگاه آموزشی</option>
                <option value="other">سایر</option>
              </select>
            </div>

            <div className="flex gap-2">
              <div className="w-1/2">
                <label className="block text-xs text-gray-600 mb-1">ساعت:</label>
                <input type="text" value={eventHour} onChange={(e) => setEventHour(e.target.value)} placeholder="16" className="w-full border p-2 rounded-lg bg-white text-sm text-center" />
              </div>
              <div className="w-1/2">
                <label className="block text-xs text-gray-600 mb-1">دقیقه:</label>
                <input type="text" value={eventMinute} onChange={(e) => setEventMinute(e.target.value)} placeholder="00" className="w-full border p-2 rounded-lg bg-white text-sm text-center" />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-gray-500">تعداد رویدادهای ثبت‌شده در این ماه: {eventsList.length}</span>
            <button type="button" onClick={handleNextDay} className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-bold transition">
              {currentDay < 30 ? "ثبت این روز و رفتن به روز بعد ⬅" : "تایید نهایی روزها"}
            </button>
          </div>
        </div>
      </div>

      <button type="button" onClick={handleSaveMonth} className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl font-bold transition shadow-md">
        ذخیره و اعمال تغییرات ماه در دیتابیس 🚀
      </button>
    </div>
  );
}