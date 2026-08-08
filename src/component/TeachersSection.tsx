"use client";

import React, { useState } from "react";
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
  PlayCircle,
  Library,
} from "lucide-react";
import Container from "@/component/Container";

export interface TeacherCourse {
  title: string;
  url: string;
}

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

  achievements?: string[];
  recentTopics?: string[];

  email?: string;

  teachingSampleUrl?: string;

  courses?: TeacherCourse[];
}

interface TeachersSectionProps {
  teachers?: Teacher[];
}

export default function TeachersSection({
  teachers = [],
}: TeachersSectionProps) {
  const [selectedTeacher, setSelectedTeacher] =
    useState<Teacher | null>(null);

  if (!teachers || teachers.length === 0) {
    return (
      <section dir="rtl" className="py-16">
        <Container>
          <div className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-3xl bg-[var(--color-bg)] border border-[var(--color-border)]">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
              <GraduationCap className="w-8 h-8 text-[var(--color-secondary)]" />
            </div>

            <h3 className="text-lg font-['iranBold'] text-[var(--color-primary)] mb-2">
              هنوز استادی برای نمایش ثبت نشده است
            </h3>

            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
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
            <span>کادر علمی و استادان</span>
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
            بهره‌گیری از دانش و تجربه اساتید و متخصصین علمی
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

                  <div className="relative w-[150px] h-[150px] rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-inner">
                    <img
                      src={teacher.avatar || "/default-avatar.png"}
                      alt={teacher.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/default-avatar.png";
                      }}
                    />
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-lg font-['iranBold'] text-[var(--color-text-primary)] mb-1">
                  {teacher.name}
                </h3>

                {/* Subject */}
                {teacher.subject && (
                  <p className="text-xs text-[var(--color-text-secondary)] mb-5">
                    {teacher.subject}
                  </p>
                )}

                {/* Button */}
                <button
                  onClick={() => setSelectedTeacher(teacher)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[var(--color-bg)] hover:bg-blue-50 text-[var(--color-primary)] hover:text-[var(--color-secondary)] border border-[var(--color-border)] font-['iranBold'] text-xs transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                >
                  <span>مشاهده اطلاعات استاد</span>

                  <ChevronLeft className="w-4 h-4 transition-transform duration-300 group-hover/btn:-translate-x-1" />
                </button>
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
                  <X className="w-5 h-5" />
                </button>

                {/* Modal Header */}
                <div className="p-6 pt-12 bg-[var(--color-bg)] border-b border-[var(--color-border)] flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md shrink-0">
                    <img
                      src={
                        selectedTeacher.avatar ||
                        "/default-avatar.png"
                      }
                      alt={selectedTeacher.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/default-avatar.png";
                      }}
                    />
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

                    {selectedTeacher.role && (
                      <p className="text-xs text-[var(--color-text-secondary)] truncate">
                        {selectedTeacher.role}
                      </p>
                    )}
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-5 overflow-y-auto flex-1">
                  {/* Bio */}
                  {selectedTeacher.bio?.trim() && (
                    <div>
                      <h4 className="text-xs font-['iranBold'] text-[var(--color-primary)] mb-1.5">
                        توضیحات و بیوگرافی
                      </h4>

                      <div className="p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl leading-relaxed text-xs sm:text-sm text-[var(--color-text-secondary)]">
                        {selectedTeacher.bio}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {selectedTeacher.education?.trim() && (
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                      <GraduationCap className="w-5 h-5 text-indigo-500 shrink-0" />

                      <div>
                        <div className="text-[10px] text-[var(--color-text-secondary)] mb-0.5">
                          مدرک تحصیلی
                        </div>

                        <div className="text-sm font-['iranBold'] text-[var(--color-primary)]">
                          {selectedTeacher.education}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  {(typeof selectedTeacher.articlesCount === "number" ||
                    typeof selectedTeacher.experienceYears === "number") && (
                    <div className="grid grid-cols-2 gap-3">
                      {typeof selectedTeacher.articlesCount ===
                        "number" && (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/60 border border-blue-100">
                          <BookOpen className="w-5 h-5 text-[var(--color-secondary)] flex-shrink-0" />

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

                      {typeof selectedTeacher.experienceYears ===
                        "number" && (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                          <GraduationCap className="w-5 h-5 text-[var(--color-success)] flex-shrink-0" />

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
                  {selectedTeacher.teachingSampleUrl?.trim() && (
                    <div>
                      <h4 className="flex items-center gap-1.5 text-xs font-['iranBold'] text-[var(--color-primary)] mb-2">
                        <PlayCircle className="w-4 h-4 text-[var(--color-secondary)]" />

                        <span>نمونه تدریس</span>
                      </h4>

                      <a
                        href={selectedTeacher.teachingSampleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-blue-50/60 border border-blue-100 hover:bg-blue-100 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                            <PlayCircle className="w-5 h-5 text-[var(--color-secondary)]" />
                          </div>

                          <div>
                            <div className="text-sm font-['iranBold'] text-[var(--color-primary)]">
                              مشاهده نمونه تدریس
                            </div>

                            <div className="text-[10px] text-[var(--color-text-secondary)]">
                              مشاهده ویدئوی تدریس استاد
                            </div>
                          </div>
                        </div>

                        <ExternalLink className="w-4 h-4 text-[var(--color-secondary)] group-hover:-translate-x-1 transition-transform" />
                      </a>
                    </div>
                  )}

                  {/* Courses */}
                  {selectedTeacher.courses &&
                    selectedTeacher.courses.length > 0 && (
                      <div>
                        <h4 className="flex items-center gap-1.5 text-xs font-['iranBold'] text-[var(--color-primary)] mb-2">
                          <Library className="w-4 h-4 text-[var(--color-secondary)]" />

                          <span>دوره‌های ارائه‌شده</span>
                        </h4>

                        <div className="space-y-2">
                          {selectedTeacher.courses.map(
                            (course, index) =>
                              course.title?.trim() &&
                              course.url?.trim() && (
                                <a
                                  key={index}
                                  href={course.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="w-7 h-7 rounded-lg bg-blue-100 text-[var(--color-secondary)] flex items-center justify-center text-[10px] font-['iranBold'] shrink-0">
                                      {index + 1}
                                    </span>

                                    <span className="text-xs font-['iranBold'] text-[var(--color-text-primary)] truncate">
                                      {course.title}
                                    </span>
                                  </div>

                                  <span className="flex items-center gap-1 text-[10px] text-[var(--color-secondary)] font-['iranBold'] shrink-0">
                                    مشاهده دوره
                                    <ExternalLink className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                                  </span>
                                </a>
                              )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Recent Topics */}
                  {selectedTeacher.recentTopics &&
                    selectedTeacher.recentTopics.length > 0 && (
                      <div>
                        <h4 className="flex items-center gap-1.5 text-xs font-['iranBold'] text-[var(--color-primary)] mb-2">
                          <Tag className="w-4 h-4 text-[var(--color-secondary)]" />

                          <span>حوزه‌های تخصصی و پژوهشی</span>
                        </h4>

                        <div className="flex flex-wrap gap-1.5">
                          {selectedTeacher.recentTopics.map(
                            (topic, i) => (
                              <span
                                key={i}
                                className="px-3 py-1.5 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] font-['iranBold']"
                              >
                                {topic}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Achievements */}
                  {selectedTeacher.achievements &&
                    selectedTeacher.achievements.length > 0 && (
                      <div>
                        <h4 className="flex items-center gap-1.5 text-xs font-['iranBold'] text-[var(--color-primary)] mb-2">
                          <Award className="w-4 h-4 text-amber-500" />

                          <span>افتخارات و سوابق</span>
                        </h4>

                        <div className="space-y-1.5">
                          {selectedTeacher.achievements.map(
                            (item, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-2 text-xs text-[var(--color-text-primary)] bg-[var(--color-bg)] p-2.5 rounded-xl border border-[var(--color-border)]"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)] shrink-0 mt-1.5" />

                                <span>{item}</span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>

                {/* Footer */}
                {selectedTeacher.email?.trim() && (
                  <div className="p-4 bg-[var(--color-bg)] border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] min-w-0">
                      <Mail className="w-3.5 h-3.5 text-[var(--color-secondary)] flex-shrink-0" />

                      <span className="truncate max-w-[180px] sm:max-w-[200px]">
                        {selectedTeacher.email}
                      </span>
                    </div>

                    <a
                      href={`mailto:${selectedTeacher.email}`}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] text-white font-['iranBold'] text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>ارتباط با دبیر</span>

                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </Container>
    </section>
  );
}