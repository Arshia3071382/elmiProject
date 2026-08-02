"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, PanInfo } from "framer-motion";

interface ClassItem {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  gradient: string;
  borderColor: string;
  textColor: string;
  sessionsText: string;
  description?: string;
  teacher?: string;
  schedule?: string;
  topics?: string[];
}

const CART_ITEMS: ClassItem[] = [
  {
    id: 1,
    title: "کلاس ریاضی هشتم",
    subtitle: "تسلط بر مفاهیم پایه و پیشرفته",
    image: "/image/r7.jpg",
    gradient: "from-blue-500 to-cyan-400",
    borderColor: "border-blue-200 group-hover:border-blue-400",
    textColor: "text-blue-600",
    sessionsText: "سال 1403",
    description: "این دوره به منظور مرور کامل ریاضی پایه هشتم و آماده‌سازی برای امتحانات نهایی طراحی شده است.",
    teacher: "آقای داوودآبادی",
    topics: ["عددهای صحیح و گنگ", "هندسه و استدلال", "جبر و معادله", "توان و جذر"]
  },
  {
    id: 2,
    title: "کلاس عربی نهم",
    subtitle: "یادگیری اصولی مفاهیم",
    image: "/image/2.jpg",
    gradient: "from-emerald-500 to-teal-400",
    borderColor: "border-emerald-200 group-hover:border-emerald-400",
    textColor: "text-emerald-600",
    sessionsText: "برنامه ویژه امتحانات 1404",
    description: "یادگیری کامل قواعد عربی نهم، فن ترجمه و حل نمونه سوالات امتحانات نهایی.",
    teacher: "آقای لعل آبدار",
    schedule: "برنامه ویژه امتحانات",
    topics: ["ترجمه و قواعد", "فن ترجمه", "بررسی سوالات نهایی"]
  },
  {
    id: 3,
    title: "کارگاه انتخاب رشته پایه نهم",
    subtitle: "برنامه‌ریزی دقیق",
    image: "/image/m2.jpg",
    gradient: "from-emerald-500 to-teal-400",
    borderColor: "border-emerald-200 group-hover:border-emerald-400",
    textColor: "text-emerald-600",
    sessionsText: "سال 1402",
    description: "جمع‌بندی و تست‌زنی ریاضی نهم برای موفقیت در امتحانات و آزمون‌های تیزهوشان.",
    teacher: "آقای مختاری",
    topics: ["مجموعه‌ها", "عبارت‌های جبری", "خط و معادلات خطی"]
  },
  {
    id: 4,
    title: "آزمون جامع پایه هفتم",
    subtitle: "سنجش سطح و آمادگی کامل",
    image: "/image/az.jpg",
    gradient: "from-indigo-500 to-sky-400",
    borderColor: "border-indigo-200 group-hover:border-indigo-400",
    textColor: "text-indigo-600",
    sessionsText: "سال 1404",
    description: "مجموعه آزمون‌های شبیه‌سازی‌شده به همراه کارنامه تحلیلی.",
    teacher: "کادر علمی مجموعه",
    schedule: "آخرین جمعه هر ماه",
    topics: ["آزمون جامع", "پاسخنامه ویدئویی", "ارائه کارنامه"]
  },
  {
    id: 5,
    title: "کلاس علوم پایه نهم",
    subtitle: "آمادگی آزمون پایان ترم مدارس",
    image: "/image/olom.jpeg",
    gradient: "from-indigo-500 to-sky-400",
    borderColor: "border-indigo-200 group-hover:border-indigo-400",
    textColor: "text-indigo-600",
    sessionsText: "سال 1404",
    description: "آمادگی کامل آزمون پایان ترم علوم.",
    teacher: "کادر علمی",
    topics: ["فیزیک", "شیمی", "زیست"]
  },
  {
    id: 6,
    title: "آموزش پایتون",
    subtitle: "برنامه نویسی",
    image: "/image/py.jpg",
    gradient: "from-indigo-500 to-sky-400",
    borderColor: "border-indigo-200 group-hover:border-indigo-400",
    textColor: "text-indigo-600",
    sessionsText: "سال 1400 - 1404",
    description: "آموزش مقدماتی تا پیشرفته پایتون.",
    teacher: "کادر علمی",
    topics: ["مبانی پایتون", "الگوریتم", "پروژه‌محور"]
  }
];

export default function ClassCart() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);

  // رفتن به کارت بعدی
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % CART_ITEMS.length);
  }, []);

  // رفتن به کارت قبلی
  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + CART_ITEMS.length) % CART_ITEMS.length);
  }, []);

  // تایمر چرخش خودکار هر ۳ ثانیه
  useEffect(() => {
    // اگر موس روی کارت باشد یا مودال باز باشد، تایمر اجرا نشود
    if (isPaused || selectedClass !== null) {
      return;
    }

    const timer = setInterval(() => {
      goToNext();
    }, 3000);

    return () => clearInterval(timer);
  }, [isPaused, selectedClass, goToNext]);

  const getCardAt = (offset: number) => {
    const total = CART_ITEMS.length;
    return CART_ITEMS[(currentIndex + offset + total) % total];
  };

  const visibleCards = [
    { item: getCardAt(-1), role: "prev" },
    { item: getCardAt(0), role: "active" },
    { item: getCardAt(1), role: "next" },
  ];

  // سواپ لمسی در موبایل
  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold) {
      goToNext();
    } else if (info.offset.x < -threshold) {
      goToPrev();
    }
  };

  return (
    <div
      className="relative z-10 w-full py-10 overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      dir="rtl"
    >
      <div className="relative flex items-center justify-center min-h-[440px] max-w-5xl mx-auto px-4">
        {visibleCards.map(({ item, role }) => {
          const isActive = role === "active";

          return (
            <motion.div
              key={item.id}
              drag={isActive ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={isActive ? handleDragEnd : undefined}
              transition={{
                duration: 0.35,
                ease: "easeOut",
              }}
              onClick={() => {
                if (role === "prev") {
                  goToPrev();
                } else if (role === "next") {
                  goToNext();
                } else {
                  setSelectedClass(item);
                }
              }}
              style={{
                zIndex: isActive ? 20 : 10,
              }}
              className={`absolute w-[300px] sm:w-[340px] bg-white rounded-3xl border touch-pan-y ${
                isActive
                  ? "border-blue-400 shadow-[0_20px_50px_rgba(59,130,246,0.15)] cursor-grab active:cursor-grabbing"
                  : "border-gray-200/80 shadow-md cursor-pointer hover:border-gray-300"
              }`}
              animate={{
                x: role === "prev" ? "-105%" : role === "next" ? "105%" : "0%",
                scale: isActive ? 1.05 : 0.9,
                opacity: isActive ? 1 : 0.5,
                filter: isActive ? "blur(0px)" : "blur(1px)",
              }}
            >
              {/* تصویر کارت */}
              <div className="relative w-full aspect-[16/10] overflow-hidden rounded-t-3xl pointer-events-none">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-[11px] px-3 py-1 rounded-full font-[iranBold] text-slate-800 shadow-sm">
                  {item.sessionsText}
                </span>
              </div>

              {/* محتوای کارت */}
              <div className="p-5 text-center flex flex-col items-center">
                <h3 className="text-base font-[iranBold] text-slate-900 mb-1 line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                  {item.subtitle}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedClass(item);
                  }}
                  className={`w-full py-2.5 rounded-full text-xs font-[iranBold] text-white bg-gradient-to-r ${item.gradient} shadow-md active:scale-95 transition-transform`}
                >
                  مشاهده جزئیات
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* نقطه‌های پایین */}
      <div className="flex justify-center items-center gap-2 mt-8">
        {CART_ITEMS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "w-8 bg-blue-600 shadow-md shadow-blue-500/30"
                : "w-2 bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>

      {/* مودال جزئیات */}
      <AnimatePresence>
        {selectedClass && (
          <ClassDetailModal
            item={selectedClass}
            onClose={() => setSelectedClass(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ClassDetailModal({ item, onClose }: { item: ClassItem; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div dir="rtl" className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col"
      >
        <div className="relative h-48 w-full shrink-0">
          <Image src={item.image} alt={item.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md flex items-center justify-center transition-colors"
          >
            ✕
          </button>

          <div className="absolute bottom-4 right-6 left-6 text-white text-right">
            <h2 className="text-xl font-[iranBold]">{item.title}</h2>
            <p className="text-xs text-slate-200 mt-1">{item.subtitle}</p>
          </div>
        </div>

        <div className="p-6 space-y-4 text-right overflow-y-auto">
          {item.description && (
            <div>
              <h4 className="text-sm font-[iranBold] text-slate-800 mb-1">درباره این دوره:</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
            {item.teacher && (
              <div>
                <span className="text-slate-400 block mb-0.5">مدرس:</span>
                <span className="font-semibold text-slate-700">{item.teacher}</span>
              </div>
            )}
            {item.schedule && (
              <div>
                <span className="text-slate-400 block mb-0.5">زمان:</span>
                <span className="font-semibold text-slate-700">{item.schedule}</span>
              </div>
            )}
          </div>

          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 text-center">
            <p className="text-xs font-[iranBold] text-amber-800">
              📢 جهت اطلاع از زمان برگزاری به کانال روبیکا مراجعه بفرمایید.
            </p>
          </div>

          <button
            onClick={onClose}
            className={`w-full py-3 rounded-xl text-sm font-[iranBold] text-white bg-gradient-to-r ${item.gradient} shadow-lg active:scale-98 transition-transform`}
          >
            بستن
          </button>
        </div>
      </motion.div>
    </div>
  );
}