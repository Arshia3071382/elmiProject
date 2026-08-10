// src/app/league-guide/page.tsx
"use client";

import React, { useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  CheckCircle2,
  ChevronLeft,
  GraduationCap,
  Trophy,
  Users,
  Rocket,
  Target,
  FlaskConical,
  Video,
  Library,
  Zap,
  Heart,
  Award,
  Medal,
  Gift,
  AlertTriangle,
  Sparkles,
  School,
  BookOpen,
} from "lucide-react";

// Import data
import { steps } from "./../../../data/leagueData";

// Import Step Components
import { StepIntro } from "@/component/league/steps/StepIntro";
import { StepLeagues } from "@/component/league/steps/StepLeagues";
import { StepClass } from "@/component/league/steps/StepClass";
import { StepExam } from "@/component/league/steps/StepExam";
import { StepProgress } from "@/component/league/steps/StepProgress";
import { StepScience } from "@/component/league/steps/StepScience";
import { StepOnline } from "@/component/league/steps/StepOnline";
import { StepLibrary } from "@/component/league/steps/StepLibrary";
import { StepChallenges } from "@/component/league/steps/StepChallenges";
import { StepPowerCards } from "@/component/league/steps/StepPowerCards";
import { StepImpact } from "@/component/league/steps/StepImpact";
import { StepBadges } from "@/component/league/steps/StepBadges";
import { StepLevels } from "@/component/league/steps/StepLevels";
import { StepRewards } from "@/component/league/steps/StepRewards";
import { StepPenalties } from "@/component/league/steps/StepPenalties";

export default function LeagueGuidePage() {
  const [education, setEducation] = useState<"primary" | "middle" | null>(null);
  const [step, setStep] = useState(0);
  
  // ref برای اسکرول به ابتدای محتوا
  const contentRef = useRef<HTMLDivElement>(null);

  const currentStep = steps[step];

  const progress = useMemo(() => {
    return ((step + 1) / steps.length) * 100;
  }, [step]);

  const scrollToContent = () => {
    setTimeout(() => {
      if (contentRef.current) {
        const yOffset = -20; // فاصله از بالای صفحه
        const y = contentRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 100);
  };

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep((prev) => prev + 1);
      scrollToContent();
    }
  };

  const previousStep = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
      scrollToContent();
    }
  };

  const selectEducation = (type: "primary" | "middle") => {
    setEducation(type);
    setStep(0);

    setTimeout(() => {
      document
        .getElementById("league-journey")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const goToStep = (index: number) => {
    setStep(index);
    scrollToContent();
  };

  const getStepIcon = (iconName: string) => {
    const iconMap: Record<string, React.ElementType> = {
      Trophy: Trophy,
      Users: Users,
      GraduationCap: GraduationCap,
      Brain: Brain,
      Rocket: Rocket,
      FlaskConical: FlaskConical,
      Video: Video,
      Library: Library,
      Target: Target,
      Zap: Zap,
      Heart: Heart,
      Award: Award,
      Medal: Medal,
      Gift: Gift,
      AlertTriangle: AlertTriangle,
    };
    return iconMap[iconName] || Trophy;
  };

  return (
    <main dir="rtl" className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#1F3A5F]">
        <div className="absolute inset-0">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-sky-400/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
           
            <h1 className="font-[iranBold] text-4xl leading-[1.5] text-white md:text-6xl">
              راهنمای لیگ نخبگان  
            </h1>

            <p className="mt-6 text-base leading-9 text-blue-100 md:text-lg">
              اینجا فقط بحث نمره و امتحان نیست!
              <br />
              هر تلاش، هر پیشرفت و هر فعالیت علمی می‌تونه تو رو یک قدم به
              قهرمانی نزدیک‌تر کنه. 🏆
            </p>

            <div className="mt-10 grid grid-cols-3 gap-3 md:gap-5">
              {[
                ["🏆", "رقابت"],
                ["🚀", "پیشرفت"],
                ["⭐", "امتیاز"],
              ].map(([icon, text]) => (
                <div
                  key={text}
                  className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur"
                >
                  <div className="text-2xl">{icon}</div>
                  <div className="mt-2 text-xs font-bold text-white md:text-sm">
                    {text}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* EDUCATION SELECTOR */}
      <section className="mx-auto max-w-5xl px-5 py-14 md:px-8">
        <div className="mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-green-50 px-4 py-2 text-sm font-bold text-blue-600 shadow-sm"
          >
            <Sparkles size={16} />
            اول یه انتخاب کوچیک
          </motion.div>

          <h2 className="font-[iranBold] text-2xl text-slate-900 md:text-4xl">
            تو کدوم مقطعی؟ 👀
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-slate-500 md:text-base">
            مسیر راهنما رو بر اساس مقطع خودت ادامه بده.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* کارت ابتدایی - سبز کم رنگ */}
          <motion.button
            initial={{ opacity: 0, x: -30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{
              scale: 1.03,
              y: -8,
              boxShadow: "0 20px 40px -12px rgba(34, 197, 94, 0.3)",
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => selectEducation("primary")}
            className={`group relative overflow-hidden rounded-[2rem] p-6 md:p-8 text-right transition-all duration-300 ${
              education === "primary"
                ? "border-2 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl shadow-green-500/20"
                : "border-2 border-green-200 bg-gradient-to-br from-green-50/70 to-emerald-50/70 hover:border-green-400 hover:shadow-lg hover:shadow-green-500/10"
            }`}
          >
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-green-400/10 blur-3xl transition-all duration-700 group-hover:scale-150" />
            <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl transition-all duration-700 group-hover:scale-150" />

            <div className="relative flex flex-col items-center md:flex-row md:items-start gap-4 md:gap-5">
              <div
                className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${
                  education === "primary"
                    ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                    : "bg-green-100 text-green-600 group-hover:bg-green-200 group-hover:scale-110"
                }`}
              >
                <School size={34} className="transition-transform duration-300 group-hover:rotate-[-8deg]" />
              </div>

              <div className="flex-1 text-center md:text-right">
                <h3
                  className={`font-[iranBold] text-2xl transition-colors duration-300 ${
                    education === "primary" ? "text-green-700" : "text-slate-800 group-hover:text-green-700"
                  }`}
                >
                  ابتدایی
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-500">
                  پایه دوم تا ششم
                </p>

                <div
                  className={`mt-4 flex items-center justify-center md:justify-start gap-2 text-sm font-bold transition-all duration-300 ${
                    education === "primary"
                      ? "text-green-600"
                      : "text-green-500 group-hover:text-green-600 group-hover:gap-3"
                  }`}
                >
                  انتخاب این مسیر
                  <motion.span
                    animate={education === "primary" ? { x: [0, 5, 0] } : {}}
                    transition={{ repeat: education === "primary" ? Infinity : 0, duration: 1 }}
                  >
                    <ChevronLeft size={18} />
                  </motion.span>
                </div>

                {education === "primary" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute left-4 top-4"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30">
                      <CheckCircle2 size={18} />
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            <div
              className={`absolute bottom-0 left-0 h-1 w-full transform transition-all duration-500 ${
                education === "primary"
                  ? "scale-x-100 bg-gradient-to-r from-green-400 to-emerald-500"
                  : "scale-x-0 bg-gradient-to-r from-green-400 to-emerald-500 group-hover:scale-x-100"
              }`}
            />
          </motion.button>

          {/* کارت راهنمایی - آبی کم رنگ */}
          <motion.button
            initial={{ opacity: 0, x: 30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{
              scale: 1.03,
              y: -8,
              boxShadow: "0 20px 40px -12px rgba(59, 130, 246, 0.3)",
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => selectEducation("middle")}
            className={`group relative overflow-hidden rounded-[2rem] p-6 md:p-8 text-right transition-all duration-300 ${
              education === "middle"
                ? "border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-sky-50 shadow-xl shadow-blue-500/20"
                : "border-2 border-blue-200 bg-gradient-to-br from-blue-50/70 to-sky-50/70 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10"
            }`}
          >
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl transition-all duration-700 group-hover:scale-150" />
            <div className="absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-sky-400/10 blur-3xl transition-all duration-700 group-hover:scale-150" />

            <div className="relative flex flex-col items-center md:flex-row md:items-start gap-4 md:gap-5">
              <div
                className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${
                  education === "middle"
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                    : "bg-blue-100 text-blue-600 group-hover:bg-blue-200 group-hover:scale-110"
                }`}
              >
                <BookOpen size={34} className="transition-transform duration-300 group-hover:rotate-[-5deg]" />
              </div>

              <div className="flex-1 text-center md:text-right">
                <h3
                  className={`font-[iranBold] text-2xl transition-colors duration-300 ${
                    education === "middle" ? "text-blue-700" : "text-slate-800 group-hover:text-blue-700"
                  }`}
                >
                  راهنمایی
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-500">
                  پایه هفتم تا نهم
                </p>

                <div
                  className={`mt-4 flex items-center justify-center md:justify-start gap-2 text-sm font-bold transition-all duration-300 ${
                    education === "middle"
                      ? "text-blue-600"
                      : "text-blue-500 group-hover:text-blue-600 group-hover:gap-3"
                  }`}
                >
                  انتخاب این مسیر
                  <motion.span
                    animate={education === "middle" ? { x: [0, 5, 0] } : {}}
                    transition={{ repeat: education === "middle" ? Infinity : 0, duration: 1 }}
                  >
                    <ChevronLeft size={18} />
                  </motion.span>
                </div>

                {education === "middle" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute left-4 top-4"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg shadow-blue-500/30">
                      <CheckCircle2 size={18} />
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            <div
              className={`absolute bottom-0 left-0 h-1 w-full transform transition-all duration-500 ${
                education === "middle"
                  ? "scale-x-100 bg-gradient-to-r from-blue-400 to-sky-500"
                  : "scale-x-0 bg-gradient-to-r from-blue-400 to-sky-500 group-hover:scale-x-100"
              }`}
            />
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-slate-400">
            💡 با انتخاب مقطع خود، مسیر اختصاصی لیگ نخبگان را شروع کن
          </p>
        </motion.div>
      </section>

      {/* JOURNEY */}
      <AnimatePresence>
        {education && (
          <motion.section
            id="league-journey"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto max-w-5xl px-5 pb-20 md:px-8"
          >
            {/* این div به عنوان ref برای اسکرول استفاده می‌شود */}
            <div ref={contentRef} className="scroll-mt-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.35 }}
                >
                  {step === 0 && (
                    <StepIntro education={education} onNext={nextStep} />
                  )}

                  {step === 1 && <StepLeagues onNext={nextStep} />}

                  {step === 2 && <StepClass onNext={nextStep} />}

                  {step === 3 && <StepExam onNext={nextStep} />}

                  {step === 4 && <StepProgress onNext={nextStep} />}

                  {step === 5 && <StepScience onNext={nextStep} />}

                  {step === 6 && <StepOnline onNext={nextStep} />}

                  {step === 7 && <StepLibrary onNext={nextStep} />}

                  {step === 8 && <StepChallenges onNext={nextStep} />}

                  {step === 9 && <StepPowerCards onNext={nextStep} />}

                  {step === 10 && <StepImpact onNext={nextStep} />}

                  {step === 11 && <StepBadges onNext={nextStep} />}

                  {step === 12 && <StepLevels onNext={nextStep} />}

                  {step === 13 && <StepRewards onNext={nextStep} />}

                  {step === 14 && <StepPenalties onNext={nextStep} />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="mt-8">
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={previousStep}
                  disabled={step === 0}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 disabled:cursor-not-allowed disabled:opacity-30 hover:bg-slate-50 transition-colors"
                >
                  <ArrowRight size={18} />
                  قبلی
                </button>

                <div className="flex max-w-[60%] items-center justify-center gap-2 overflow-hidden">
                  {steps.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => goToStep(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === step
                          ? "w-8 bg-blue-600"
                          : index < step
                            ? "w-2 bg-blue-300"
                            : "w-2 bg-slate-200"
                      }`}
                      aria-label={`مرحله ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextStep}
                  disabled={step === steps.length - 1}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 disabled:cursor-not-allowed disabled:opacity-30 hover:bg-blue-700 transition-colors"
                >
                  بعدی
                  <ArrowLeft size={18} />
                </button>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-lg backdrop-blur">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-400">مسیر آشنایی با لیگ</p>
                    <p className="mt-1 font-[iranBold] text-sm text-slate-900">
                      مرحله {step + 1} از {steps.length}
                    </p>
                  </div>
                  <div className="text-left text-xs font-bold text-blue-600">
                    {Math.round(progress)}٪
                  </div>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full rounded-full bg-[#2563EB]"
                  />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2 md:grid-cols-5 lg:grid-cols-7">
                {steps.map((item, index) => {
                  const Icon = getStepIcon(item.icon);
                  const isActive = index === step;
                  const isCompleted = index < step;

                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => goToStep(index)}
                      className={`relative flex flex-col items-center gap-1 rounded-xl p-2 text-center transition-all ${
                        isActive
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                          : isCompleted
                            ? "bg-blue-50 text-blue-600"
                            : "bg-white text-slate-400 hover:bg-slate-50"
                      }`}
                    >
                      <Icon
                        size={18}
                        className={
                          isActive
                            ? "text-white"
                            : isCompleted
                              ? "text-blue-600"
                              : "text-slate-400"
                        }
                      />
                      <span className="text-[10px] font-bold leading-tight">
                        {item.title}
                      </span>
                      {isCompleted && (
                        <CheckCircle2
                          size={12}
                          className="absolute -right-1 -top-1 text-green-500"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="bg-[#1F3A5F] px-5 py-10 text-center">
        <p className="font-[iranBold] text-white">مجموعه علمی منتظران</p>
        <p className="mt-2 text-sm text-blue-200">
          رقابت برای رشد، تلاش برای آینده 🚀
        </p>
      </footer>
    </main>
  );
}