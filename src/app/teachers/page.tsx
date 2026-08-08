"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  BookOpen,
  Award,
  Mail,
  ExternalLink,
  ChevronLeft,
  GraduationCap,
  Tag,
} from "lucide-react";
import Container from "@/component/Container";

export interface Teacher {
  id: string;
  name: string;
  role: string;
  subject: string;
  avatar: string;
  bio: string;
  articlesCount: number;
  experienceYears: number;
  achievements: string[];
  recentTopics: string[];
  email: string;
}

interface ApiTeacher {
  _id: string;
  name: string;
  role: string;
  subject: string;
  avatar: string;
  bio?: string;
  articlesCount?: number;
  experienceYears?: number;
  achievements?: string[];
  recentTopics?: string[];
  email?: string;
}

export default function TeachersSection() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/teachers", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`خطا در دریافت اطلاعات اساتید: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error("ساختار اطلاعات دریافتی از سرور صحیح نیست");
        }

        const formattedTeachers: Teacher[] = result.data.map(
          (teacher: ApiTeacher) => ({
            id: teacher._id,
            name: teacher.name || "",
            role: teacher.role || "",
            subject: teacher.subject || "",
            avatar: teacher.avatar || "/default-avatar.png",
            bio: teacher.bio || "",
            articlesCount: teacher.articlesCount ?? 0,
            experienceYears: teacher.experienceYears ?? 0,
            achievements: Array.isArray(teacher.achievements)
              ? teacher.achievements
              : [],
            recentTopics: Array.isArray(teacher.recentTopics)
              ? teacher.recentTopics
              : [],
            email: teacher.email || "",
          }),
        );

        setTeachers(formattedTeachers);
      } catch (err) {
        console.error("Error fetching teachers:", err);

        setError(
          err instanceof Error ? err.message : "خطا در دریافت اطلاعات اساتید",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  return (
    <section dir="rtl" className="py-16">
      <Container>
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[var(--color-secondary)] text-xs font-['iranBold'] mb-3"
          >
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

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin mb-4" />

            <p className="text-sm text-[var(--color-text-secondary)] font-['iranSans-r']">
              در حال دریافت اطلاعات اساتید...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-4">
              <X className="w-6 h-6 text-red-500" />
            </div>

            <h3 className="text-base font-['iranBold'] text-red-600 mb-2">
              دریافت اطلاعات با خطا مواجه شد
            </h3>

            <p className="text-xs text-[var(--color-text-secondary)] max-w-md">
              {error}
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && teachers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-5">
              <GraduationCap className="w-7 h-7 text-blue-500" />
            </div>

            <h3 className="text-lg font-['iranBold'] text-[var(--color-primary)] mb-2">
              هنوز استادی برای نمایش ثبت نشده است
            </h3>

            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
              به زودی اساتید گرانقدر به این بخش اضافه خواهند شد.
            </p>
          </div>
        )}

        {/* Teachers Grid */}
        {!loading && !error && teachers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
            {teachers.map((teacher, index) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center text-center p-6 rounded-3xl bg-white border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Avatar */}
                <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
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

                  <div className="relative w-[150px] h-[150px] rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-inner">
                    <img
                      src={teacher.avatar}
                      alt={teacher.name}
                      className="w-full h-full object-cover"
                      onError={(event) => {
                        const image = event.currentTarget;

                        if (image.src.endsWith("/default-avatar.png")) {
                          return;
                        }

                        image.src = "/default-avatar.png";
                      }}
                    />
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-lg font-['iranBold'] text-[var(--color-text-primary)] mb-2">
                  {teacher.name}
                </h3>

                {/* Subject */}
                <p className="text-xs text-[var(--color-text-secondary)] mb-5">
                  {teacher.subject}
                </p>

                {/* Details Button */}
                <button
                  onClick={() => setSelectedTeacher(teacher)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[var(--color-bg)] hover:bg-blue-50 text-[var(--color-primary)] hover:text-[var(--color-secondary)] border border-[var(--color-border)] font-['iranBold'] text-xs transition-all flex items-center justify-center gap-2 group"
                >
                  <span>اطلاعات تکمیلی</span>

                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {selectedTeacher && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedTeacher(null)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />

              {/* Modal */}
              <motion.div
                dir="rtl"
                initial={{
                  opacity: 0,
                  scale: 0.95,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  y: 15,
                }}
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 30,
                }}
                className="relative w-full max-w-xl bg-white border border-[var(--color-border)] rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col font-['iranSans-r']"
              >
                {/* Close */}
                <button
                  onClick={() => setSelectedTeacher(null)}
                  className="absolute top-4 left-4 z-20 p-2 rounded-xl bg-[var(--color-bg)] hover:bg-slate-200 text-[var(--color-text-secondary)] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Modal Header */}
                <div className="p-6 bg-[var(--color-bg)] border-b border-[var(--color-border)] flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow shrink-0">
                    <img
                      src={selectedTeacher.avatar}
                      alt={selectedTeacher.name}
                      className="w-full h-full object-cover"
                      onError={(event) => {
                        const image = event.currentTarget;

                        if (image.src.endsWith("/default-avatar.png")) {
                          return;
                        }

                        image.src = "/default-avatar.png";
                      }}
                    />
                  </div>

                  <div className="min-w-0">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-blue-100 text-[var(--color-secondary)] text-[10px] font-['iranBold'] mb-1">
                      {selectedTeacher.subject}
                    </span>

                    <h3 className="text-xl font-['iranBold'] text-[var(--color-primary)] truncate">
                      {selectedTeacher.name}
                    </h3>

                    <p className="text-xs text-[var(--color-text-secondary)]">
                      {selectedTeacher.role}
                    </p>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-5 overflow-y-auto">
                  {/* Bio */}
                  <div>
                    <h4 className="text-xs font-['iranBold'] text-[var(--color-primary)] mb-1.5">
                      توضیحات و بیوگرافی
                    </h4>

                    <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed bg-[var(--color-bg)] p-3.5 rounded-2xl border border-[var(--color-border)]">
                      {selectedTeacher.bio ||
                        "توضیحاتی برای این استاد ثبت نشده است."}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-[var(--color-primary)]">
                      <BookOpen className="w-4 h-4 text-[var(--color-secondary)]" />

                      <span>
                        {selectedTeacher.articlesCount} مقاله منتشر شده
                      </span>
                    </div>

                    <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-[var(--color-primary)]">
                      <GraduationCap className="w-4 h-4 text-[var(--color-success)]" />

                      <span>
                        {selectedTeacher.experienceYears} سال سابقه تدریس
                      </span>
                    </div>
                  </div>

                  {/* Topics */}
                  {selectedTeacher.recentTopics.length > 0 && (
                    <div>
                      <h4 className="text-xs font-['iranBold'] text-[var(--color-primary)] mb-2 flex items-center gap-1.5">
                        <Tag className="w-4 h-4 text-[var(--color-secondary)]" />

                        <span>حوزه‌های تخصصی و پژوهشی</span>
                      </h4>

                      <div className="flex flex-wrap gap-1.5">
                        {selectedTeacher.recentTopics.map((topic, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] font-['iranBold']"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Achievements */}
                  {selectedTeacher.achievements.length > 0 && (
                    <div>
                      <h4 className="text-xs font-['iranBold'] text-[var(--color-primary)] mb-2 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-amber-500" />

                        <span>افتخارات و سوابق</span>
                      </h4>

                      <div className="space-y-1.5">
                        {selectedTeacher.achievements.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-xs text-[var(--color-text-primary)] bg-[var(--color-bg)] p-2.5 rounded-xl border border-[var(--color-border)]"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)] shrink-0" />

                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-[var(--color-bg)] border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] min-w-0">
                    <Mail className="w-3.5 h-3.5 text-[var(--color-secondary)] shrink-0" />

                    <span className="truncate">
                      {selectedTeacher.email || "ایمیل ثبت نشده است"}
                    </span>
                  </div>

                  {selectedTeacher.email && (
                    <a
                      href={`mailto:${selectedTeacher.email}`}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] text-white font-['iranBold'] text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>ارتباط با دبیر</span>

                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
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
