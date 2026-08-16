"use client";

import React, { useState, useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import {
  FileText,
  CheckCircle2,
  LogOut,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Container from "./Container";

interface DashboardData {
  isComplete: boolean;
  profile: {
    name: string;
    grade: number;
    level: string;
    totalScore: number;
    scoreToNextLevel: number;
  };
  gradeLeague?: {
    score: number;
    rank: number;
    totalStudents: number;
    scientificLevelTitle: string;
  } | null;
  badges: Array<{ title: string; icon: string }>;
  lastLeagueUpdate: string;
}

// لیست سطوح علمی همراه با تصاویر و بازه امتیازات
const SCIENTIFIC_LEVELS = [
  {
    minScore: 0,
    maxScore: 500,
    title: "بیشتر تلاش کن",
    icon: "/image/hero11.png",
  },
  {
    minScore: 501,
    maxScore: 2500,
    title: "شهید رضایی نژاد",
    icon: "/image/levels/le1.png",
  },
  {
    minScore: 2501,
    maxScore: 5000,
    title: "شهید علیمحمدی",
    icon: "/image/levels/le2.png",
  },
  {
    minScore: 5001,
    maxScore: 7500,
    title: "شهید احمدی روشن",
    icon: "/image/levels/le3.png",
  },
  {
    minScore: 7501,
    maxScore: 10000,
    title: "شهید شهریاری",
    icon: "/image/levels/le4.png",
  },
  {
    minScore: 10001,
    maxScore: 12500,
    title: "شهید طهرانی مقدم",
    icon: "/image/levels/le5.png",
  },
  {
    minScore: 12501,
    maxScore: 999999,
    title: "شهید فخری زاده",
    icon: "/image/levels/le6.png",
  },
];

// کامپوننت کانتر اعداد با انیمیشن شمارش
function AnimatedCounter({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (current) =>
    Math.floor(current).toLocaleString("fa-IR"),
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

// تابع تعیین سطح علمی بر اساس امتیاز کل
const getScientificBadgeInfo = (score: number) => {
  if (score <= 500) {
    return {
      title: "باید بیشتر تلاش کنی",
      imageUrl: "/images/levels/start.png",
      levelIndex: 0,
    };
  } else if (score <= 2500) {
    return {
      title: "پژوهشگر برنز",
      imageUrl: "/image/levels/le1.png",
      levelIndex: 1,
    };
  } else if (score <= 5000) {
    return {
      title: "پژوهشگر نقره‌ای",
      imageUrl: "/image/levels/le2.png",
      levelIndex: 2,
    };
  } else if (score <= 7500) {
    return {
      title: "دانشمند طلایی",
      imageUrl: "/image/levels/le3.png",
      levelIndex: 3,
    };
  } else if (score <= 10000) {
    return {
      title: "نخبه علمی",
      imageUrl: "/image/levels/le4.png",
      levelIndex: 4,
    };
  } else if (score <= 12500) {
    return {
      title: "استاد برتر",
      imageUrl: "/image/levels/le5.png",
      levelIndex: 5,
    };
  } else {
    return {
      title: "اسطوره علمی و کهکشانی",
      imageUrl: "/image/levels/le6.png",
      levelIndex: 6,
    };
  }
};

export default function StudentDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const nationalId = localStorage.getItem("studentNationalId") || "";
      const res = await fetch(
        `/api/student/dashboard?nationalId=${nationalId}`,
      );

      if (res.status === 401) {
        window.location.replace("/");
        return;
      }
      const json = await res.json();

      if (json.success && json.data) {
        const student = json.data;
        setData({
          isComplete: true,
          profile: {
            name:
              `${student.firstName || ""} ${student.lastName || ""}`.trim() ||
              "دانش‌آموز",
            grade: student.grade || 7,
            level: "عضو فعال لیگ",
            totalScore: student.totalScore || 0,
            scoreToNextLevel: 1000,
          },
          gradeLeague: {
            score: student.totalScore || 0,
            rank: student.gradeRank || 1,
            totalStudents: student.totalGradeStudents || 10,
            scientificLevelTitle: `پایه ${student.grade || 7}`,
          },
          badges:
            student.selectedActivities?.map((act: string) => ({
              title: act,
              icon: "🎖️",
            })) || [],
          lastLeagueUpdate: "امروز",
        });
      } else {
        setFallbackData();
      }
    } catch (err) {
      setFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const setFallbackData = () => {
    setData({
      isComplete: false,
      profile: {
        name: "دانش‌آموز عزیز",
        grade: 7,
        level: "عضو جدید",
        totalScore: 750,
        scoreToNextLevel: 1000,
      },
      gradeLeague: {
        score: 750,
        rank: 1,
        totalStudents: 20,
        scientificLevelTitle: "پایه هفتم",
      },
      badges: [],
      lastLeagueUpdate: "امروز",
    });
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await fetch("/api/auth/student/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      localStorage.removeItem("studentNationalId");
      localStorage.removeItem("studentPhone");
      window.location.replace("/");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-slate-50 p-6 flex items-center justify-center"
      >
        <div className="w-full max-w-7xl space-y-6 animate-pulse">
          <div className="h-44 w-full bg-slate-200 rounded-3xl" />
          <div className="h-56 bg-slate-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  const dashboardData = data || {
    isComplete: false,
    profile: {
      name: "دانش‌آموز",
      grade: 7,
      level: "عضو جدید",
      totalScore: 0,
      scoreToNextLevel: 1000,
    },
    badges: [],
    lastLeagueUpdate: "امروز",
  };

  const currentScore = dashboardData.profile.totalScore;
  const scientificInfo = getScientificBadgeInfo(currentScore);

  const nextLevelObj = SCIENTIFIC_LEVELS[scientificInfo.levelIndex + 1];
  const currentLevelObj =
    SCIENTIFIC_LEVELS[scientificInfo.levelIndex] || SCIENTIFIC_LEVELS[0];
  const scoreNeeded = nextLevelObj ? nextLevelObj.minScore - currentScore : 0;

  const levelMin = currentLevelObj.minScore;
  const levelMax = nextLevelObj ? nextLevelObj.minScore : currentScore + 1000;
  const progressPercent = nextLevelObj
    ? Math.min(
        Math.max(((currentScore - levelMin) / (levelMax - levelMin)) * 100, 4),
        100,
      )
    : 100;

  return (
    <Container>
      <div
        dir="rtl"
        className="min-h-screen bg-gradient-to-br mt-10 sm:mt-30 from-slate-50 via-blue-50/20 to-slate-100 p-4 sm:p-6 lg:p-8 pb-20 font-[iranBold]"
      >
        <div className="max-w-7xl mx-auto space-y-6">
          {/* بخش خوش‌آمدگویی و دکمه خروج */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden bg-gradient-to-r from-[#1F3A5F] via-[#2563EB] to-[#38BDF8] rounded-3xl p-6 sm:p-8 text-white shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium font-[iranSans-r]">
                  پایه تحصیلی: {dashboardData.profile.grade}
                </span>
                <span className="px-3 py-1 bg-emerald-500/80 backdrop-blur-md rounded-full text-xs font-medium font-[iranSans-r]">
                  {dashboardData.profile.level}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                سلام {dashboardData.profile.name}! 👋
              </h1>
              <p className="text-blue-100 text-sm mt-1 font-[iranSans-r]">
                آماده‌ای رکورد جدیدی در مسیر علمی خودت ثبت کنی؟ 🚀
              </p>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-red-500/80 hover:bg-red-600 text-white px-5 py-3 rounded-2xl backdrop-blur-md transition-all flex items-center gap-2 shadow-lg font-[iranSans-r] text-sm shrink-0 border border-red-400/40 cursor-pointer"
            >
              {isLoggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              <span>خروج از حساب کاربری</span>
            </button>
          </motion.div>

          {/* رتبه در لیگ پایه (تم سبز) و کارت سطح علمی (رنگ اصلی) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ۱: رتبه در لیگ پایه (با تم سبز جذاب و رتبه ۱) */}
            {dashboardData.gradeLeague && (
              <motion.div
                whileHover={{ y: -4 }}
                className="relative overflow-hidden bg-white/90 backdrop-blur-xl border-2 border-emerald-500/30 rounded-3xl p-6 shadow-xl flex flex-col justify-between"
              >
                <div className="absolute right-0 top-0 w-40 h-40 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 text-xl shadow-inner">
                        🏆
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">
                          رتبه در لیگ پایه
                        </h3>
                        <p className="text-xs text-slate-400 font-[iranSans-r]">
                          آخرین بروزرسانی: {dashboardData.lastLeagueUpdate}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold font-[iranSans-r]">
                      {dashboardData.gradeLeague.scientificLevelTitle}
                    </span>
                  </div>
                </div>

                <div className="my-4 grid grid-cols-2 gap-4 items-center">
                  <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-5 rounded-2xl shadow-lg text-center relative overflow-hidden">
                    <span className="text-xs text-emerald-100 block mb-1 font-[iranSans-r]">
                      رتبه شما در پایه
                    </span>
                    <motion.span
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: "easeInOut",
                      }}
                      className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white drop-shadow-md block"
                    >
                      1
                    </motion.span>
                  </div>

                  <div className="bg-emerald-50/80 border border-emerald-100 p-5 rounded-2xl text-center">
                    <span className="text-xs text-slate-500 block mb-1 font-[iranSans-r]">
                      امتیاز کل لیگ
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono mt-1">
                      <AnimatedCounter
                        value={dashboardData.gradeLeague.score}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ۲: کارت سطح علمی با رنگ و استایل اصلی خودش */}
            <motion.div
              whileHover={{ y: -4 }}
              className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950 rounded-3xl p-6 text-white shadow-2xl border-[3px] border-amber-400/80 ring-4 ring-amber-500/20 flex flex-col items-center justify-center text-center"
            >
              <div className="absolute inset-2 rounded-2xl border border-amber-500/30 pointer-events-none" />
              <div className="absolute -left-10 -top-10 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute right-0 bottom-0 w-40 h-40 bg-yellow-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 mb-5">
                <span className="text-xs sm:text-sm text-amber-300 font-bold tracking-widest uppercase bg-amber-500/20 px-6 py-2 rounded-full border border-amber-400/50 shadow-md font-[iranSans-r]">
                  سطح علمی شما
                </span>
              </div>

              <div className="relative z-10 my-3">
                <div className="absolute inset-0 bg-amber-400 rounded-full blur-2xl opacity-40 animate-pulse" />
                <motion.img
                  src={scientificInfo.imageUrl}
                  alt="Medal"
                  animate={{ scale: [1, 1.07, 1] }}
                  transition={{
                    duration: 2.0,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative z-10 w-48 h-48 sm:w-60 sm:h-60 object-contain drop-shadow-[0_20px_35px_rgba(251,191,36,0.7)]"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
            </motion.div>
          </div>

          {/* ۳: نوار پیشرفت و مسیر مدال‌ها (تم زرد و طلایی - جهت LTR) */}
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white/90 backdrop-blur-xl border border-amber-100 rounded-3xl p-6 shadow-xl space-y-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    مسیر پیشرفت و صعود به سطح بعدی
                  </h3>
                  <p className="text-xs text-slate-400 font-[iranSans-r]">
                    {nextLevelObj
                      ? `فقط ${scoreNeeded.toLocaleString("fa-IR")} امتیاز تا رسیدن به مرحله بعدی مانده است!`
                      : "تبریک! به بالاترین سطح رسیده‌اید 🎉"}
                  </p>
                </div>
              </div>
              {nextLevelObj && (
                <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-xl text-xs font-bold font-[iranSans-r]">
                  سطح بعدی: {nextLevelObj.title}
                </span>
              )}
            </div>

            {/* نوار پیشرفت طلایی (جهت LTR) */}
            <div className="space-y-2">
              <div
                dir="ltr"
                className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-0.5 border border-slate-200"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full shadow-md origin-left"
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400 font-[iranSans-r]">
                <span>
                  امتیاز فعلی:{" "}
                  <strong className="text-amber-600">
                    {currentScore.toLocaleString("fa-IR")}
                  </strong>
                </span>
                {nextLevelObj && (
                  <span>
                    هدف سطح بعدی:{" "}
                    <strong className="text-slate-700">
                      {nextLevelObj.minScore.toLocaleString("fa-IR")}
                    </strong>
                  </span>
                )}
              </div>
            </div>

            {/* مسیر مدال‌ها به صورت چپ به راست (LTR) بر اساس امتیاز دانش‌آموز */}
            <div
              dir="ltr"
              className="grid grid-cols-4 lg:grid-cols-7 gap-3 pt-4 border-t border-slate-100 text-right"
            >
              {SCIENTIFIC_LEVELS.map((lvl, index) => {
                const isUnlocked = currentScore >= lvl.minScore;
                const isCurrent = scientificInfo.levelIndex === index;

                return (
                  <div
                    key={index}
                    className={`flex flex-col items-center text-center p-3 rounded-2xl border transition-all ${
                      isCurrent
                        ? "bg-amber-50 border-amber-500 shadow-md ring-2 ring-amber-500/20 scale-105 opacity-100"
                        : isUnlocked
                          ? "bg-slate-50 border-amber-200 opacity-90"
                          : "bg-slate-50/50 border-slate-100 opacity-40 grayscale"
                    }`}
                  >
                    <img
                      src={lvl.icon}
                      alt={lvl.title}
                      className="w-10 h-10 object-contain mb-2 drop-shadow"
                    />
                    <span className="text-[11px] font-bold text-slate-800 line-clamp-1 font-[iranSans-r]">
                      {lvl.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono mt-1">
                      {lvl.minScore} امتیاز
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* ۴: کارت آزمون جامع */}
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white/90 backdrop-blur-xl border border-slate-100 rounded-3xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    کارت آزمون جامع علمی
                  </h3>
                  <p className="text-xs text-slate-400 font-[iranSans-r]">
                    مجوز ورود به جلسه و جزئیات آزمون
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold flex items-center gap-1 font-[iranSans-r]">
                <CheckCircle2 className="w-4 h-4" /> فعال
              </span>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-right w-full sm:w-auto font-[iranSans-r]">
                <div className="text-xs text-slate-400">
                  وضعیت شرکت در آزمون:
                </div>
                <div className="text-sm font-bold text-slate-800">
                  آماده برای دریافت کارت ورود به جلسه
                </div>
              </div>
              <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-xl transition-all shadow-md text-sm font-[iranSans-r] cursor-pointer">
                مشاهده و چاپ کارت آزمون
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </Container>
  );
}
