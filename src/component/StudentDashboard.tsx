"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Trophy, Award, Flame, Rocket, BookOpen, 
  HelpCircle, BarChart2, Bell, RefreshCw, LogOut, ChevronLeft 
} from "lucide-react";

interface DashboardData {
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
  };
  eliteLeague?: {
    score: number;
    rank: number;
    category: string;
  };
  badges: Array<{ title: string; icon: string }>;
  recentActivities: Array<{ title: string; scoreChange: number; date: string }>;
  lastLeagueUpdate: string;
}

export default function StudentDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/student/dashboard");
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // حالت Skeleton Loading حرفه‌ای
  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="w-full max-w-7xl space-y-6 animate-pulse">
          <div className="h-44 w-full bg-slate-200 rounded-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-56 bg-slate-200 rounded-3xl" />
            <div className="h-56 bg-slate-200 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  // حالت خطای سرور و دکمه تلاش مجدد
  if (error || !data) {
    return (
      <div dir="rtl" className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-md w-full">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">⚠️</div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">دریافت اطلاعات با مشکل مواجه شد</h3>
          <p className="text-sm text-slate-500 mb-6">نتوانستیم اطلاعات حساب کاربری شما را بارگذاری کنیم.</p>
          <button
            onClick={fetchDashboardData}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>تلاش مجدد</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 p-4 sm:p-6 lg:p-8 pb-20">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ۱. Hero بخش خوش‌آمدگویی */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-[#1F3A5F] via-[#2563EB] to-[#38BDF8] rounded-3xl p-6 sm:p-8 text-white shadow-2xl"
        >
          <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium">
                  پایه تحصیلی: {data.profile.grade}
                </span>
                <span className="px-3 py-1 bg-emerald-500/80 backdrop-blur-md rounded-full text-xs font-medium">
                  {data.profile.level}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                سلام {data.profile.name} عزیز! 👋
              </h1>
              <p className="text-blue-100 text-sm mt-1">
                آماده‌ای رکورد جدیدی در مسیر علمی خودت ثبت کنی؟ 🚀
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              <div className="text-left">
                <div className="text-xs text-blue-200">امتیاز کل شما</div>
                <div className="text-2xl font-black text-amber-300">
                  {data.profile.totalScore.toLocaleString('fa-IR')} <span className="text-xs font-normal">XP</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ۲. کارت‌های رتبه لیگ‌ها (گرید دو ستونه) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* لیگ علمی پایه */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl p-6 shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-inner">
                  🏆
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">لیگ علمی پایه</h3>
                  <p className="text-xs text-slate-400">آخرین بروزرسانی: {data.lastLeagueUpdate}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold">
                سطح: {data.gradeLeague?.scientificLevelTitle}
              </span>
            </div>

            {data.gradeLeague ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-xs text-slate-400 block">رتبه شما</span>
                    <span className="text-xl font-black text-blue-600">#{data.gradeLeague.rank}</span>
                    <span className="text-xs text-slate-400 mr-1">از {data.gradeLeague.totalStudents}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">امتیاز لیگ</span>
                    <span className="text-xl font-black text-slate-800">{data.gradeLeague.score.toLocaleString('fa-IR')}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                    <span>پیشرفت تا سطح بعدی</span>
                    <span>{data.profile.scoreToNextLevel} امتیاز مانده</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "70%" }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full" 
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-sm">
                هنوز اطلاعات لیگ شما ثبت نشده است.
              </div>
            )}
          </motion.div>

          {/* لیگ نخبگان */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl p-6 shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 shadow-inner">
                  👑
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">لیگ نخبگان</h3>
                  <p className="text-xs text-slate-400">رقابت برتر کشوری</p>
                </div>
              </div>
              {data.eliteLeague && (
                <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-xl text-xs font-bold">
                  دسته: {data.eliteLeague.category}
                </span>
              )}
            </div>

            {data.eliteLeague ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-xs text-slate-400 block">رتبه نخبگان</span>
                    <span className="text-xl font-black text-purple-600">#{data.eliteLeague.rank}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">امتیاز نخبگان</span>
                    <span className="text-xl font-black text-slate-800">{data.eliteLeague.score.toLocaleString('fa-IR')}</span>
                  </div>
                </div>
                <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100/50 text-xs text-purple-900 font-medium">
                  🌟 تبریک! شما جزو برترین‌های لیگ نخبگان هستید.
                </div>
              </div>
            ) : (
              <div className="py-6 text-center space-y-3">
                <p className="text-sm text-slate-500">هنوز وارد لیگ نخبگان نشده‌ای.</p>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-600/20">
                  آشنایی با لیگ نخبگان
                </button>
              </div>
            )}
          </motion.div>

        </div>

        {/* ۳. نشان‌ها و دستاوردها */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>نشان‌های من</span>
            </h3>
            <span className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline">مشاهده همه نشان‌ها</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {data.badges.map((badge, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.03 }}
                className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col items-center text-center gap-2 shadow-sm"
              >
                <div className="text-3xl">{badge.icon}</div>
                <span className="text-xs font-bold text-slate-800">{badge.title}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ۴. راهنمای افزایش امتیاز و اقدامات سریع */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* راهنمای افزایش امتیاز */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl p-6 shadow-xl">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-500" />
              <span>چطور امتیازت را بیشتر کنی؟</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: "شرکت در آزمون", xp: "+50 امتیاز", color: "bg-blue-50 text-blue-700" },
                { title: "فعالیت علمی", xp: "+30 امتیاز", color: "bg-emerald-50 text-emerald-700" },
                { title: "پروژه علمی", xp: "+100 امتیاز", color: "bg-purple-50 text-purple-700" },
                { title: "مطالعه کتاب", xp: "+20 امتیاز", color: "bg-amber-50 text-amber-700" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-bold text-slate-800">{item.title}</span>
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-extrabold ${item.color}`}>{item.xp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* دسترسی سریع */}
          <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-blue-600" />
                <span>دسترسی سریع</span>
              </h3>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-blue-50/60 hover:bg-blue-100/60 text-blue-900 text-xs font-bold transition-all">
                  <span>📝 شرکت در آزمون جامع</span>
                  <ChevronLeft className="w-4 h-4 text-blue-500" />
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all">
                  <span>💬 درخواست مشاوره</span>
                  <ChevronLeft className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* ۵. فعالیت‌های اخیر */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl p-6 shadow-xl">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-emerald-600" />
            <span>فعالیت‌های اخیر</span>
          </h3>
          <div className="space-y-3">
            {data.recentActivities.map((act, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{act.title}</h4>
                    <span className="text-[10px] text-slate-400">{act.date}</span>
                  </div>
                </div>
                <span className="text-xs font-black text-emerald-600">+{act.scoreChange} XP</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}