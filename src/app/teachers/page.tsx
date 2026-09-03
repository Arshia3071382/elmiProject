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
  Smile,
} from "lucide-react";
import Container from "@/component/Container";
import Image from "next/image";
import aparat from "./../../../public/image/Aparat_Icon.png";

export interface TeacherCourse {
  title: string;
  url: string;
}

export interface Teacher {
  id: string;
  name: string;
  role: string;
  subject: string;
  avatar: string;
  bio: string;
  education: string;
  articlesCount: number;
  experienceYears: number;
  achievements: string[];
  recentTopics: string[];
  email: string;
  teachingSampleUrl: string;
  courses: TeacherCourse[];
}

interface ApiTeacher {
  _id: string;
  name: string;
  role: string;
  subject: string;
  avatar: string;
  bio?: string;
  education?: string;
  articlesCount?: number;
  experienceYears?: number;
  achievements?: string[];
  recentTopics?: string[];
  email?: string;
  teachingSampleUrl?: string;
  courses?: TeacherCourse[];
}

export default function TeachersSection() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch teachers
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
            education: teacher.education || "",
            articlesCount: teacher.articlesCount ?? 0,
            experienceYears: teacher.experienceYears ?? 0,
            achievements: Array.isArray(teacher.achievements)
              ? teacher.achievements
              : [],
            recentTopics: Array.isArray(teacher.recentTopics)
              ? teacher.recentTopics
              : [],
            email: teacher.email || "",
            teachingSampleUrl: teacher.teachingSampleUrl || "",
            courses: Array.isArray(teacher.courses)
              ? teacher.courses
                  .filter((course) => course && course.title && course.url)
                  .map((course) => ({
                    title: course.title,
                    url: course.url,
                  }))
              : [],
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
    <section dir="rtl">
      <Container>
        {/* Header */}
        <div className="text-center mt-10 sm:mt-30 mb-12">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {teachers.map((teacher, index) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group flex flex-col items-center text-center p-7 rounded-[2.2rem] bg-[#f8fafc]/90 backdrop-blur-2xl border-2 border-blue-200/80 shadow-2xl shadow-indigo-950/10 hover:border-blue-400 hover:shadow-blue-500/20 hover:-translate-y-3 transition-all duration-300 relative"
              >
                {/* Avatar */}
                <div className="relative w-36 h-36 mb-6 flex items-center justify-center">
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
                  <div className="relative w-[136px] h-[136px] rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-md">
                    <img
                      src={teacher.avatar || "/default-avatar.png"}
                      alt={teacher.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(event) => {
                        const image = event.currentTarget;
                        if (image.src.endsWith("/default-avatar.png")) return;
                        image.src = "/default-avatar.png";
                      }}
                    />
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-lg font-['iranBold'] text-[var(--color-text-primary)] mb-1.5">
                  {teacher.name}
                </h3>

                {/* Subject */}
                {teacher.subject && (
                  <p className="text-xs text-[var(--color-text-secondary)] mb-6 bg-white/90 backdrop-blur-md px-3.5 py-1 rounded-full border border-blue-100 shadow-sm">
                    {teacher.subject}
                  </p>
                )}

                {/* Details button */}
                <button
                  onClick={() => setSelectedTeacher(teacher)}
                  className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-[var(--color-secondary)] text-[var(--color-primary)] hover:text-white border border-blue-200 shadow-md hover:shadow-lg font-['iranBold'] text-xs transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                >
                  <span>اطلاعات تکمیلی</span>
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
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
              />

              {/* Modal content */}
              <motion.div
                dir="rtl"
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                className="relative w-full max-w-xl bg-[#f8fafc]/95 backdrop-blur-3xl border-2 border-blue-200 rounded-[2.55rem] shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col font-['iranSans-r']"
              >
                {/* Close button */}
                <button
                  onClick={() => setSelectedTeacher(null)}
                  className="absolute top-4 left-4 z-20 p-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-[var(--color-text-secondary)] transition-colors"
                  aria-label="بستن"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Modal Header */}
                <div className="p-6 bg-white/60 backdrop-blur-md border-b border-blue-100 flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow shrink-0">
                    <img
                      src={selectedTeacher.avatar || "/default-avatar.png"}
                      alt={selectedTeacher.name}
                      className="w-full h-full object-cover"
                      onError={(event) => {
                        const image = event.currentTarget;
                        if (image.src.endsWith("/default-avatar.png")) return;
                        image.src = "/default-avatar.png";
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    {selectedTeacher.subject && (
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-blue-100 text-[var(--color-secondary)] text-[10px] font-['iranBold'] mb-1">
                        {selectedTeacher.subject}
                      </span>
                    )}
                    <h3 className="text-xl font-['iranBold'] text-[var(--color-primary)] truncate">
                      {selectedTeacher.name}
                    </h3>
                    {selectedTeacher.role && (
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        {selectedTeacher.role}
                      </p>
                    )}
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-5 overflow-y-auto">
                  {/* Bio */}
                  {selectedTeacher.bio && (
                    <div>
                      <h4 className="text-xs font-['iranBold'] text-[var(--color-primary)] mb-1.5">
                        توضیحات و بیوگرافی
                      </h4>
                      <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed bg-white p-3.5 rounded-2xl border border-blue-100 shadow-sm">
                        {selectedTeacher.bio}
                      </p>
                    </div>
                  )}

                  {/* Education */}
                  {selectedTeacher.education && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-violet-50/80 border border-violet-100">
                      <GraduationCap className="w-5 h-5 text-violet-600 shrink-0" />
                      <div>
                        <div className="text-[10px] text-violet-600 font-['iranBold'] mb-0.5">
                          مدرک تحصیلی
                        </div>
                        <div className="text-xs font-['iranBold'] text-[var(--color-primary)]">
                          {selectedTeacher.education}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  {(selectedTeacher.articlesCount > 0 ||
                    selectedTeacher.experienceYears > 0) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedTeacher.articlesCount > 0 && (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/80 border border-blue-100">
                          <BookOpen className="w-5 h-5 text-[var(--color-secondary)] shrink-0" />
                          <div>
                            <div className="text-sm font-['iranBold'] text-[var(--color-primary)]">
                              {selectedTeacher.articlesCount}
                            </div>
                            <div className="text-[10px] text-[var(--color-text-secondary)]">
                              مقاله منتشر شده
                            </div>
                          </div>
                        </div>
                      )}
                      {selectedTeacher.experienceYears > 0 && (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/80 border border-emerald-100">
                          <GraduationCap className="w-5 h-5 text-[var(--color-success)] shrink-0" />
                          <div>
                            <div className="text-sm font-['iranBold'] text-[var(--color-primary)]">
                              {selectedTeacher.experienceYears}
                            </div>
                            <div className="text-[10px] text-[var(--color-text-secondary)]">
                              سال سابقه تدریس
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Teaching Sample */}
                  {selectedTeacher.teachingSampleUrl && (
                    <a
                      href={selectedTeacher.teachingSampleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-red-50/90 border border-red-100 hover:bg-red-100 hover:border-red-200 transition-all group"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-white text-white flex items-center justify-center shadow-sm">
                          <Image
                            src={aparat}
                            alt="aparatLogo"
                            className="w-8 h-8 object-contain"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-['iranBold'] text-red-700">
                            مشاهده نمونه تدریس
                          </div>
                          <div className="text-[10px] text-red-500 mt-0.5">
                            مشاهده ویدئوی تدریس استاد در آپارات
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-red-500 group-hover:-translate-x-1 transition-transform" />
                    </a>
                  )}

                  {/* Courses */}
                  {selectedTeacher.courses.length > 0 && (
                    <div>
                      <h4 className="flex items-center gap-1.5 text-xs font-['iranBold'] text-[var(--color-primary)] mb-3">
                        <BookOpen className="w-4 h-4 text-[var(--color-secondary)]" />
                        <span>دوره‌های آموزشی</span>
                      </h4>
                      <div className="space-y-2">
                        {selectedTeacher.courses.map((course, index) => (
                          <div
                            key={`${course.title}-${index}`}
                            className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white border border-blue-100 shadow-sm"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <BookOpen className="w-4 h-4 text-[var(--color-secondary)] shrink-0" />
                              <span className="text-xs font-['iranBold'] text-[var(--color-primary)] truncate">
                                {course.title}
                              </span>
                            </div>
                            <a
                              href={course.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 px-3 py-1.5 rounded-lg bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] text-white text-[10px] font-['iranBold'] transition-colors flex items-center gap-1"
                            >
                              <span>مشاهده دوره</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

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
                            className="px-3 py-1 rounded-lg bg-white border border-blue-100 text-xs text-[var(--color-text-secondary)] font-['iranBold'] shadow-sm"
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
                            className="flex items-center gap-2 text-xs text-[var(--color-text-primary)] bg-white p-2.5 rounded-xl border border-blue-100 shadow-sm"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)] shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Student Satisfaction */}
                  <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-emerald-50/90 border border-emerald-100">
                    <span className="text-sm font-['iranBold'] text-emerald-700">
                      میزان رضایت دانش‌آموزان:
                    </span>
                    <span
                      className="text-2xl leading-none"
                      role="img"
                      aria-label="رضایت بالا"
                    >
                      😊
                    </span>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 bg-white/60 backdrop-blur-md border-t border-blue-100">
                  <button
                    onClick={() => setSelectedTeacher(null)}
                    className="w-full py-2.5 rounded-xl bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] text-white font-['iranBold'] text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    <span>بستن جزئیات</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </Container>
    </section>
  );
}