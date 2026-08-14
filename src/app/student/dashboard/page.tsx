"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, FileText, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

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
  eliteLeague?: {
    score: number;
    rank: number;
    category: string;
  } | null;
  badges: Array<{ title: string; icon: string }>;
  lastLeagueUpdate: string;
}

export default function StudentDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

 const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // دریافت کد ملی از لوکال استوریج یا منبع ذخیره‌سازی شما
      const nationalId = localStorage.getItem("studentNationalId") || "";

      // ارسال کد ملی به عنوان کوئری استرینگ به API
      const res = await fetch(`/api/student/dashboard?nationalId=${nationalId}`);
      
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const json = await res.json();
      
      if (json.success && json.data) {
        const student = json.data;
        setData({
          isComplete: true, // این فیلد فعال شود تا لیگ نمایش داده شود
          profile: {
            name: `${student.firstName || ""} ${student.lastName || ""}`.trim() || "دانش‌آموز",
            grade: student.grade || 7,
            level: "عضو فعال لیگ",
            totalScore: student.totalScore || 0,
            scoreToNextLevel: 1000,
          },
          gradeLeague: {
            score: student.totalScore || 0,
            rank: 1,
            totalStudents: 10,
            scientificLevelTitle: `پایه ${student.grade || 7}`,
          },
          eliteLeague: null,
          badges: student.selectedActivities?.map((act: string) => ({
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
        totalScore: 0,
        scoreToNextLevel: 1000,
      },
      badges: [],
      lastLeagueUpdate: "امروز",
    });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
        <div className="w-full max-w-7xl space-y-6 animate-pulse">
          <div className="h-44 w-full bg-slate-200 rounded-3xl" />
          <div className="h-56 bg-slate-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  const dashboardData = data || {
    isComplete: false,
    profile: { name: "دانش‌آموز", grade: 7, level: "عضو جدید", totalScore: 0, scoreToNextLevel: 1000 },
    badges: [],
    lastLeagueUpdate: "امروز"
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 p-4 sm:p-6 lg:p-8 pb-20 font-[iranBold]">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* بخش خوش‌آمدگویی */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-[#1F3A5F] via-[#2563EB] to-[#38BDF8] rounded-3xl p-6 sm:p-8 text-white shadow-2xl"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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
          </div>
        </motion.div>

        {/* کارت آزمون جامع */}
        <motion.div whileHover={{ y: -2 }} className="bg-white/90 backdrop-blur-xl border border-slate-100 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">کارت آزمون جامع علمی</h3>
                <p className="text-xs text-slate-400 font-[iranSans-r]">مجوز ورود به جلسه و جزئیات آزمون</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold flex items-center gap-1 font-[iranSans-r]">
              <CheckCircle2 className="w-4 h-4" /> فعال
            </span>
          </div>
          
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-right w-full sm:w-auto font-[iranSans-r]">
              <div className="text-xs text-slate-400">وضعیت شرکت در آزمون:</div>
              <div className="text-sm font-bold text-slate-800">آماده برای دریافت کارت ورود به جلسه</div>
            </div>
            <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-xl transition-all shadow-md text-sm font-[iranSans-r]">
              مشاهده و چاپ کارت آزمون
            </button>
          </div>
        </motion.div>

        {/* اطلاعات لیگ علمی */}
        {dashboardData.gradeLeague && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div whileHover={{ y: -4 }} className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">🏆</div>
                  <div>
                    <h3 className="font-bold text-slate-900">لیگ علمی پایه</h3>
                    <p className="text-xs text-slate-400 font-[iranSans-r]">آخرین بروزرسانی: {dashboardData.lastLeagueUpdate}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold font-[iranSans-r]">
                  {dashboardData.gradeLeague.scientificLevelTitle}
                </span>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-100 font-[iranSans-r]">
                  <div>
                    <span className="text-xs text-slate-400 block">امتیاز کل لیگ</span>
                    <span className="text-xl font-black text-blue-600 font-mono">
                      {dashboardData.gradeLeague.score.toLocaleString('fa-IR')}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">وضعیت حضور</span>
                    <span className="text-sm font-bold text-emerald-600 mt-1 block">ثبت شده در جدول</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* فعالیت‌ها و نشان‌ها */}
        {dashboardData.badges.length > 0 && (
          <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>فعالیت‌ها و نشان‌های من</span>
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {dashboardData.badges.map((badge, idx) => (
                <motion.div key={idx} whileHover={{ scale: 1.03 }} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col items-center text-center gap-2">
                  <div className="text-3xl">{badge.icon}</div>
                  <span className="text-xs font-bold text-slate-800 font-[iranSans-r]">{badge.title}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}