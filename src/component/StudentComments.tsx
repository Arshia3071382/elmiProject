"use client";

import React, { useState, useEffect } from "react";
import Container from "@/component/Container";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Calendar,
  User as UserIcon,
} from "lucide-react";

interface CommentItem {
  _id: string;
  name: string;
  comment: string;
  coursesCount: string;
  rating: number;
  date?: string;
  avatar?: string;
}

export default function StudentComments() {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const pinColors = [
    'bg-blue-400',
    'bg-emerald-400', 
    'bg-cyan-400',
    'bg-teal-400',
    'bg-indigo-400'
  ];

  useEffect(() => {
    fetch("/api/comments")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setComments(data);
        }
      })
      .catch((err) => console.error("Error fetching comments:", err));
  }, []);

  if (comments.length === 0) return null;

  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % comments.length);
  const handlePrev = () =>
    setCurrentIndex((prev) => (prev - 1 + comments.length) % comments.length);

  const currentComment = comments[currentIndex];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/60 relative overflow-hidden dir-rtl font-[iranSans-r]">
      <Container>
        {/* افکت‌های پس‌زمینه */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* تایتل و هدر بخش نظرات */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-3xl mx-auto mb-16 text-center relative z-10"
        >
          <div className="flex justify-end gap-1 mb-6 pl-0">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`top-${i}`}
                initial={{ width: 0 }}
                whileInView={{ width: 8 + (4 - i) * 12 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                className={`h-1 rounded-full ${pinColors[i]}`}
              />
            ))}
          </div>

          <h2 className="font-[iranBold] text-primary text-3xl sm:text-4xl lg:text-5xl tracking-tight">
            نظرات دانشجویان
          </h2>
          
          <div className="flex justify-start gap-2 mt-4 pr-0">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`bottom-${i}`}
                initial={{ width: 0 }}
                whileInView={{ width: 8 + i * 12 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                className={`h-1 rounded-full ${pinColors[i]}`}
              />
            ))}
          </div>
        </motion.div>

        <div className="w-full max-w-2xl mx-auto relative z-10 px-4">
          <div className="relative min-h-[220px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentComment._id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="w-full bg-white border-2 border-slate-100 rounded-3xl shadow-lg p-6 sm:p-8 flex flex-col justify-between text-right"
              >
                {/* متن نظر (با رفع مشکل چیدمان و برعکس شدن ایموجی‌ها) */}
                <p 
                  dir="auto" 
                  className="font-[iranSans-r] text-slate-700 text-right leading-8 text-sm sm:text-base mb-6 whitespace-pre-line [unicode-bidi:plaintext]"
                >
                  {currentComment.comment}
                </p>

                {/* بخش پایینی با فلکس و ریسپانسیو کامل */}
                <div className="flex flex-row-reverse flex-wrap sm:flex-nowrap items-center justify-between pt-4 border-t border-slate-100 gap-y-3">
                  
                  {/* راست: پروفایل کاربر و ستاره‌ها زیر نام */}
                  <div className="flex flex-row-reverse items-center gap-2 text-right justify-start">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-[iranBold] text-slate-900 text-xs truncate">
                        {currentComment.name}
                      </span>
                      <div className="flex gap-0.5 text-amber-400 mt-0.5">
                        {[...Array(currentComment.rating || 5)].map(
                          (_, idx) => (
                            <Star
                              key={idx}
                              className="w-3 h-3 fill-amber-400"
                            />
                          ),
                        )}
                      </div>
                    </div>
                  </div>

                  {/* بخش چپ و وسط (در موبایل رپ شده و به خط بعد می‌رود) */}
                  <div className="flex flex-row-reverse w-full sm:w-auto items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    {/* وسط: نام دوره آموزشی */}
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-medium text-[10px] sm:text-xs truncate max-w-[160px]">
                      {currentComment.coursesCount}
                    </span>

                    {/* چپ: تاریخ ثبت */}
                    <div className="flex items-center gap-1 text-slate-400 font-medium text-[10px] sm:text-xs">
                      <span className="font-mono">
                        {currentComment.date || ""}
                      </span>
                      <Calendar className="w-3 h-3 shrink-0" />
                    </div>
                  </div>

                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* دکمه‌های ناوبری */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 hover:bg-blue-600 hover:text-white flex items-center justify-center shadow-sm cursor-pointer transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold text-slate-500">
              {currentIndex + 1} از {comments.length}
            </span>

            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 hover:bg-blue-600 hover:text-white flex items-center justify-center shadow-sm cursor-pointer transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}