"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  BookOpen,
  Mail,
  ExternalLink,
  ChevronLeft,
  GraduationCap,
  Tag,
  PlayCircle,
  Image as ImageIcon, // آیکون عکس برای حالت عدم وجود تصویر یا لودینگ
} from "lucide-react";
import Container from "@/component/Container";

export interface Teacher {
  _id?: string | number;
  id?: string | number;

  name: string;
  role: string;
  subject: string;
  avatar: string;

  bio?: string;
  education?: string;

  articlesCount?: number;
  experienceYears?: number;

  recentTopics?: string[];

  email?: string;

  teachingSampleUrl?: string;

  courses?: {
    title: string;
    url: string;
  }[];
}

interface TeachersSectionProps {
  teachers?: Teacher[];
  isLoading?: boolean;
}

export default function TeachersSection({
  teachers = [],
  isLoading = false,
}: TeachersSectionProps) {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  // حالت Skeleton با استفاده از آیکون عکس خاکستری برای زمان بارگذاری
  if (isLoading) {
    return (
      <section dir="rtl" className="py-16">
        <Container>
          <div className="text-center mb-10">
            <div className="w-32 h-6 bg-slate-100 rounded-full mx-auto mb-4 animate-pulse"></div>
            <div className="w-64 h-8 bg-slate-100 rounded-lg mx-auto mb-2 animate-pulse"></div>
            <div className="w-48 h-4 bg-slate-50 rounded-lg mx-auto animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex flex-col items-center text-center p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm"
              >
                {/* جایگاه عکس با آیکون عکس خاکستری و انیمیشن پالس */}
                <div className="relative w-40 h-40 mb-5 flex items-center justify-center">
                  <div className="w-[150px] h-[150px] rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-inner flex items-center justify-center animate-pulse">
                    <ImageIcon className="w-10 h-10 text-slate-400 opacity-60" />
                  </div>
                </div>

                <div className="w-32 h-5 bg-slate-200 rounded-md mb-2 animate-pulse"></div>
                <div className="w-20 h-4 bg-slate-100 rounded-md mb-5 animate-pulse"></div>

                <div className="w-full space-y-2">
                  <div className="w-full h-10 bg-slate-200 rounded-xl animate-pulse"></div>
                  <div className="w-full h-10 bg-slate-100 rounded-xl animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  if (!teachers || teachers.length === 0) {
    return (
      <section dir="rtl" className="py-16">
        <Container>
          <div className="flex flex-col items-center justify-center text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-[var(--color-secondary)]" />
            </div>

            <h3 className="text-base font-['iranBold'] text-[var(--color-primary)] mb-2">
              هنوز استادی برای نمایش ثبت نشده است
            </h3>

            <p className="text-xs text-[var(--color-text-secondary)]">
              به‌زودی اساتید گرانقدر به این بخش اضافه خواهند شد.
            </p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section dir="rtl" className="py-16">
      <Container>
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/70 text-[var(--color-secondary)] text-xs font-['iranBold'] mb-4"
          >
            <GraduationCap className="w-4 h-4" />
            کادر علمی و استادان
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-2xl sm:text-3xl font-['iranBold'] text-[var(--color-primary)] tracking-tight mb-2"
          >
            معرفی اساتید و دبیران
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xs sm:text-sm text-[var(--color-text-secondary)]"
          >
            بهره‌گیری از دانش برترین اساتید و متخصصین علمی
          </motion.p>
        </div>

        {/* Teachers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {teachers.map((teacher, index) => {
            const key =
              teacher._id?.toString() ||
              teacher.id?.toString() ||
              index.toString();

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="group flex flex-col items-center text-center p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Avatar */}
                <div className="relative w-40 h-40 mb-5 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 rounded-full p-1"
                    style={{
                      background:
                        "conic-gradient(from 0deg, var(--color-secondary) 0deg 90deg, transparent 90deg 180deg, var(--color-accent) 180deg 270deg, transparent 270deg 360deg)",
                    }}
                  />

                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 12,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute -inset-1.5 rounded-full p-0.5 opacity-60"
                    style={{
                      background:
                        "conic-gradient(from 90deg, var(--color-success) 0deg 60deg, transparent 60deg 180deg, var(--color-primary) 180deg 240deg, transparent 240deg 360deg)",
                    }}
                  />

                  <div className="relative w-[150px] h-[150px] rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-inner flex items-center justify-center">
                    {teacher.avatar ? (
                      <img
                        src={teacher.avatar}
                        alt={teacher.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // اگر عکس به هر دلیلی لود نشد، پنهان می‌شود و آیکون جایگزین نمایان می‌گردد
                          (e.target as HTMLElement).style.display = "none";
                          const fallback = (e.target as HTMLElement).nextElementSibling;
                          if (fallback) (fallback as HTMLElement).style.display = "flex";
                        }}
                      />
                    ) : null}
                    
                    {/* آیکون عکس جایگزین در صورت نبود آواتار یا خطای بارگذاری */}
                    <div 
                      className={`absolute inset-0 items-center justify-center bg-slate-100 text-slate-400 ${teacher.avatar ? 'hidden' : 'flex'}`}
                    >
                      <ImageIcon className="w-12 h-12 opacity-60" />
                    </div>
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-lg font-['iranBold'] text-[var(--color-text-primary)] mb-1">
                  {teacher.name}
                </h3>

                {/* Subject */}
                <p className="text-xs text-[var(--color-text-secondary)] mb-5">
                  {teacher.subject}
                </p>

                {/* Buttons */}
                <div className="w-full space-y-2">
                  {teacher.teachingSampleUrl && (
                    <a
                      href={teacher.teachingSampleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-['iranBold'] text-xs transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>مشاهده نمونه تدریس</span>
                    </a>
                  )}

                  <button
                    onClick={() => setSelectedTeacher(teacher)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[var(--color-bg)] hover:bg-blue-50 text-[var(--color-primary)] hover:text-[var(--color-secondary)] border border-[var(--color-border)] font-['iranBold'] text-xs transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                  >
                    <span>اطلاعات تکمیلی</span>
                    <ChevronLeft className="w-4 h-4 transition-transform duration-300 group-hover/btn:-translate-x-1" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedTeacher && (
            <div
              dir="rtl"
              className="fixed inset-0 z-[110] flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedTeacher(null)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 30,
                }}
                className="relative w-full max-w-xl bg-white border border-[var(--color-border)] rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col font-['iranSans-r']"
              >
                <button
                  onClick={() => setSelectedTeacher(null)}
                  className="absolute top-4 left-4 z-20 p-2 rounded-xl bg-[var(--color-bg)] hover:bg-slate-200 text-[var(--color-text-secondary)] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Modal Header */}
                <div className="p-6 pt-12 bg-[var(--color-bg)] border-b border-[var(--color-border)] flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md shrink-0 flex items-center justify-center bg-slate-100">
                    {selectedTeacher.avatar ? (
                      <img
                        src={selectedTeacher.avatar}
                        alt={selectedTeacher.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                          const fallback = (e.target as HTMLElement).nextElementSibling;
                          if (fallback) (fallback as HTMLElement).style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div 
                      className={`absolute inset-0 items-center justify-center bg-slate-100 text-slate-400 ${selectedTeacher.avatar ? 'hidden' : 'flex'}`}
                    >
                      <ImageIcon className="w-8 h-8 opacity-60" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {selectedTeacher.subject && (
                      <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-[var(--color-secondary)] text-[10px] font-['iranBold'] mb-1.5">
                        {selectedTeacher.subject}
                      </span>
                    )}
                    <h3 className="text-xl font-['iranBold'] text-[var(--color-primary)] truncate">
                      {selectedTeacher.name}
                    </h3>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-5 overflow-y-auto flex-1">
                  {selectedTeacher.bio && (
                    <div>
                      <h4 className="text-xs font-['iranBold'] text-[var(--color-primary)] mb-1.5">
                        توضیحات و بیوگرافی
                      </h4>
                      <div className="p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl leading-relaxed text-xs sm:text-sm text-[var(--color-text-secondary)]">
                        {selectedTeacher.bio}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </Container>
    </section>
  );
}