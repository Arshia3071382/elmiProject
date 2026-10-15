"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Crown, Shield, Award, Trophy, Users, Brain, Zap, 
  Video, MessageSquare, LineChart, FlaskConical, Sparkles, CheckCircle2,
  LayoutGrid, ChevronRight, ChevronLeft, ArrowRight, BookOpen, Radio, Calendar, Cpu, Terminal, Gamepad2, FileSpreadsheet
} from "lucide-react";
import { conferenceSteps, ShowcaseStep } from "./../../../data/conferenceShowcaseData";
import { levels, classScores, scienceScores, examScores, impactScores } from "./../../../data/leagueData";

export default function ConferenceDeck() {
  const [activeId, setActiveId] = useState<string>("intro");
  const [viewMode, setViewMode] = useState<"grid" | "slider">("grid");

  const currentIndex: number = conferenceSteps.findIndex((s: ShowcaseStep) => s.id === activeId);
  const currentStep: ShowcaseStep = conferenceSteps[currentIndex] || conferenceSteps[0];

  // بخش URL عکس‌ها (به راحتی قابل تغییر توسط شما)
  const images = {
    // لوگوی هدر بالای صفحه سمت راست
    headerLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop",
    
    // اسلاید ۱: معرفی
    introLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop",

    // اسلاید ۳: آزمون مدارس
    examImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop",

    // اسلاید ۴: لیگ نخبگان علمی
    leagueBaseTable: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop",
    leagueEliteTable: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop",

    // اسلاید ۸: گفتینو (چند تصویر)
    goftino1: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=400&auto=format&fit=crop",
    goftino2: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=400&auto=format&fit=crop",
    goftino3: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&auto=format&fit=crop",

    // اسلاید ۹: پنل دانش‌آموز (عکس برای هر ویژگی)
    studentRadar: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=400&auto=format&fit=crop",
    studentRank: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=400&auto=format&fit=crop",
    studentMedals: "https://images.unsplash.com/photo-1567427017947-545c5f2d16ad?q=80&w=400&auto=format&fit=crop",

    // اسلاید ۱۰: پنل معین‌ها
    mentorChecklist: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&auto=format&fit=crop",
    mentorReportCard: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&auto=format&fit=crop",
    mentorLeagueScores: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=400&auto=format&fit=crop",

    // اسلاید ۱۱: ایستگاه کنجکاوی
    curiosity1: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=400&auto=format&fit=crop",
    curiosity2: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=400&auto=format&fit=crop",
    curiosity3: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop",

    // اسلاید ۱۲: سایر امکانات سامانه
    extraLive: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&auto=format&fit=crop",
    extraPodcast: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=400&auto=format&fit=crop",
    extraCountdown: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=400&auto=format&fit=crop",
    extraBorhan: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=400&auto=format&fit=crop",
    extraShowcase: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=400&auto=format&fit=crop",
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== "slider") return;
      if (e.key === "ArrowLeft") handleNext();
      if (e.key === "ArrowRight") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, viewMode]);

  const handleNext = () => {
    if (currentIndex < conferenceSteps.length - 1) {
      setActiveId(conferenceSteps[currentIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setActiveId(conferenceSteps[currentIndex - 1].id);
    }
  };

  const selectStep = (id: string) => {
    setActiveId(id);
    setViewMode("slider");
  };

  return (
    <div className="w-full h-full flex flex-col justify-between relative z-10 max-w-7xl mx-auto">
      
      {/* هدر ناوبری همایش */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          {/* جایگزینی آیکون چرخان با لوگوی علمی مجموعه در هدر */}
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center overflow-hidden border border-blue-400/30">
            <img src={images.headerLogo} alt="لوگوی علمی" className="w-full h-full object-cover rounded-xl" />
          </div>
          <div>
            <h1 className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-blue-400">
              سامانه علمی منتظران
            </h1>
            <p className="text-xs text-slate-400">ویترین تعاملی همایش</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ${
              viewMode === "grid" 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <LayoutGrid className="w-4 h-4" /> انتخاب موضوع
          </button>
          <button
            onClick={() => setViewMode("slider")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ${
              viewMode === "slider" 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Video className="w-4 h-4" /> نمای اسلایدر
          </button>
        </div>
      </div>

      {/* محتوای اصلی */}
      <div className="my-auto py-3">
        <AnimatePresence mode="wait">
          
          {viewMode === "grid" ? (
            <motion.div
              key="grid-mode"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[72vh] overflow-y-auto pr-1"
            >
              {conferenceSteps.map((step: ShowcaseStep, idx: number) => (
                <motion.button
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => selectStep(step.id)}
                  className="group relative bg-slate-900/70 hover:bg-gradient-to-br hover:from-slate-900 hover:to-blue-950/60 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-5 text-right transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col justify-between min-h-[130px]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500 group-hover:text-blue-400 font-bold">
                      0{idx + 1}
                    </span>
                    <span className="p-2 bg-slate-800 group-hover:bg-blue-600/20 group-hover:text-blue-400 rounded-xl text-slate-300 transition-colors">
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white group-hover:text-blue-300 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {step.subtitle}
                    </p>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            
            <motion.div
              key={`slider-${activeId}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden min-h-[480px] flex flex-col justify-center"
            >
              {/* اسلاید ۱: معرفی با لوگوی مجموعه */}
              {activeId === "intro" && (
                <div className="text-center space-y-6 max-w-2xl mx-auto">
                  <motion.div 
                    initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 0.6 }}
                    className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/40 border border-blue-400/40 p-1.5"
                  >
                    <img src={images.introLogo} alt="لوگوی مجموعه" className="w-full h-full object-cover rounded-2xl" />
                  </motion.div>
                  <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                    سامانه جامع علمی آموزشی <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">منتظران</span>
                  </h2>
                  <p className="text-slate-300 text-sm leading-relaxed max-w-xl mx-auto">
                    پلتفرم هوشمند گیمیفیکیشن، برگزاری آزمون‌های آنلاین، سطح‌بندی علمی دانش‌آموزان و هدایت تحصیلی تخصصی.
                  </p>
                </div>
              )}

              {/* اسلاید ۲: ساختار */}
              {activeId === "structure" && (
                <div className="space-y-6">
                  <div className="text-center max-w-xl mx-auto">
                    <h3 className="text-2xl font-black text-white">کادر تشکیلاتی مجموعه</h3>
                    <p className="text-slate-400 text-xs mt-1">مدیریت سه سطحی و ساختار یافته علمی</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl text-center shadow-lg">
                      <Crown className="w-9 h-9 text-amber-400 mx-auto mb-3" />
                      <h4 className="font-bold text-white text-base">مسئول علمی</h4>
                      <p className="text-xs text-slate-400 mt-2">راهبری کلان علمی مجموعه</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl text-center shadow-lg">
                      <Shield className="w-9 h-9 text-blue-400 mx-auto mb-3" />
                      <h4 className="font-bold text-white text-base">معین ارشد علمی</h4>
                      <p className="text-xs text-slate-400 mt-2">معین کل مقطع (ابتدایی یا راهنمایی)</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl text-center shadow-lg">
                      <Award className="w-9 h-9 text-emerald-400 mx-auto mb-3" />
                      <h4 className="font-bold text-white text-base">معین علمی پایه</h4>
                      <p className="text-xs text-slate-400 mt-2">مسئول علمی مستقیم هر پایه</p>
                    </motion.div>
                  </div>
                </div>
              )}

              {/* اسلاید ۳: آزمون مدارس (عکس در کنار بدون متن امتیاز ۳۰) */}
              {activeId === "exam" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-xs font-bold border border-cyan-500/20">جذب و تعیین سطح</span>
                    <h3 className="text-2xl md:text-3xl font-black text-white">برگزاری آزمون‌های آنلاین مدارس</h3>
                    <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                      جذب دانش‌آموزان از مدارس و طبقه‌بندی هوشمند آن‌ها جهت تشکیل کلاس‌های درسی بر اساس تراز و ارزیابی استاندارد.
                    </p>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl h-56">
                    <img src={images.examImage} alt="آزمون مدارس" className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                      <span className="text-xs font-bold text-cyan-300 bg-cyan-950/80 px-3 py-1 rounded-lg border border-cyan-500/30">سیستم آزمون هوشمند</span>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* اسلاید ۴: تایتل بزرگ لیگ نخبگان علمی + نمایش جایگاه جداول */}
              {activeId === "leagues" && (
                <div className="space-y-5">
                  <div className="text-center">
                    <motion.h3 initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                      لیگ نخبگان علمی
                    </motion.h3>
                    <p className="text-slate-400 text-xs mt-1">رقابت‌های پویا، جوایز ارزنده ماهانه و فصلی</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-slate-950/80 border border-blue-900/40 p-4 rounded-2xl flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <Trophy className="w-6 h-6 text-blue-400" />
                          <h4 className="text-sm font-bold text-white">لیگ علمی پایه</h4>
                        </div>
                        <p className="text-[11px] text-slate-400">رقابت درون‌پایه‌ای با جوایز ویژه ماهانه برای برترین‌ها.</p>
                      </div>
                      <div className="mt-3 h-32 rounded-xl overflow-hidden border border-slate-800 relative shadow-inner">
                        <img src={images.leagueBaseTable} alt="جدول لیگ پایه" className="w-full h-full object-cover" />
                        <div className="absolute bottom-2 right-2 bg-slate-950/90 px-2 py-0.5 rounded text-[10px] text-blue-300 border border-slate-800">نمایش جدول لیگ پایه</div>
                      </div>
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-slate-950/80 border border-purple-900/40 p-4 rounded-2xl flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <Users className="w-6 h-6 text-purple-400" />
                          <h4 className="text-sm font-bold text-white">لیگ نخبگان مقطع</h4>
                        </div>
                        <p className="text-[11px] text-slate-400">رقابت سراسری مقطع با جوایز بزرگ پایان سال تحصیلی.</p>
                      </div>
                      <div className="mt-3 h-32 rounded-xl overflow-hidden border border-slate-800 relative shadow-inner">
                        <img src={images.leagueEliteTable} alt="جدول لیگ نخبگان" className="w-full h-full object-cover" />
                        <div className="absolute bottom-2 right-2 bg-slate-950/90 px-2 py-0.5 rounded text-[10px] text-purple-300 border border-slate-800">نمایش جدول نخبگان</div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}

              {/* اسلاید ۵: امتیازدهی */}
              {activeId === "scores" && (
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-white text-center">معیارهای جامع امتیازدهی دانش‌آموزان</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl text-xs space-y-2">
                      <div className="font-bold text-blue-400 border-b border-slate-800 pb-1">امتیاز کلاس</div>
                      {classScores.map((item: string[], i: number) => (
                        <div key={i} className="flex justify-between"><span>{item[0]}</span><span className="text-emerald-400 font-bold">+{item[1]}</span></div>
                      ))}
                    </div>
                    <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl text-xs space-y-2">
                      <div className="font-bold text-purple-400 border-b border-slate-800 pb-1">فعالیت علمی</div>
                      {scienceScores.slice(0, 3).map((item: string[], i: number) => (
                        <div key={i} className="flex justify-between"><span>{item[0]}</span><span className="text-emerald-400 font-bold">+{item[1]}</span></div>
                      ))}
                    </div>
                    <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl text-xs space-y-2">
                      <div className="font-bold text-amber-400 border-b border-slate-800 pb-1">اثرگذاری</div>
                      {impactScores.slice(0, 3).map((item: string[], i: number) => (
                        <div key={i} className="flex justify-between"><span>{item[0]}</span><span className="text-emerald-400 font-bold">+{item[1]}</span></div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* اسلاید ۶: سطح‌بندی */}
              {activeId === "levels" && (
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-white text-center">سطح‌بندی علمی دانش‌آموزان (نشان شهدا)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {levels.map((lvl: any, idx: number) => (
                      <motion.div key={idx} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }} className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
                        <span className="text-2xl">{lvl.icon}</span>
                        <div>
                          <div className="text-xs font-bold text-white">{lvl.name}</div>
                          <div className="text-[10px] text-blue-400">{lvl.from} تا {lvl.to} امتیاز</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* اسلاید ۷: دوره‌های آموزشی با انیمیشن ظهور یکی‌یکی هر ۱ ثانیه */}
              {activeId === "academy" && (
                <div className="space-y-4 text-center">
                  <h3 className="text-2xl font-black text-white">دوره‌های آموزشی اختصاصی</h3>
                  <p className="text-xs text-slate-400">بارگذاری شده در سایت و کانال آپارات مجموعه</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl mx-auto">
                    {[
                      { title: "آموزش آفیس", icon: <FileSpreadsheet className="w-6 h-6 text-blue-400 animate-bounce" /> },
                      { title: "ریاضی راهنمایی", icon: <BookOpen className="w-6 h-6 text-purple-400 animate-bounce" /> },
                      { title: "فیزیک کنکور", icon: <Zap className="w-6 h-6 text-amber-400 animate-bounce" /> },
                      { title: "فتوشاپ با هوش مصنوعی", icon: <Cpu className="w-6 h-6 text-cyan-400 animate-bounce" /> },
                      { title: "پایتون پیشرفته", icon: <Terminal className="w-6 h-6 text-emerald-400 animate-bounce" /> },
                      { title: "بازی‌سازی با هوش مصنوعی", icon: <Gamepad2 className="w-6 h-6 text-rose-400 animate-bounce" /> },
                    ].map((item, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 30, scale: 0.9 }} 
                        animate={{ opacity: 1, y: 0, scale: 1 }} 
                        transition={{ duration: 0.5, delay: i * 0.25 }}
                        whileHover={{ scale: 1.05 }}
                        className="bg-slate-950/90 border border-slate-800 hover:border-blue-500/60 p-4 rounded-2xl flex flex-col items-center justify-center gap-2.5 shadow-2xl"
                      >
                        <div className="p-3 bg-slate-900 rounded-2xl shadow-inner">{item.icon}</div>
                        <span className="text-xs font-bold text-slate-200">{item.title}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* اسلاید ۸: گفتینو با ۳ جای عکس و ظاهر جذاب‌تر */}
              {activeId === "goftino" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3 text-right">
                    <MessageSquare className="w-8 h-8 text-blue-400 animate-pulse" />
                    <h3 className="text-2xl font-black text-white">گفتینو (مشاور تحصیلی هوشمند)</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      پاسخگویی آنی به سوالات متداول و راهنمایی تخصصی انتخاب رشته دانش‌آموزان به صورت چت‌باکس هوشمند و تعاملی.
                    </p>
                  </motion.div>
                  <div className="grid grid-cols-3 gap-2.5">
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl overflow-hidden border border-slate-800 h-36">
                      <img src={images.goftino1} alt="گفتینو ۱" className="w-full h-full object-cover" />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl overflow-hidden border border-slate-800 h-36 mt-4">
                      <img src={images.goftino2} alt="گفتینو ۲" className="w-full h-full object-cover" />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl overflow-hidden border border-slate-800 h-36">
                      <img src={images.goftino3} alt="گفتینو ۳" className="w-full h-full object-cover" />
                    </motion.div>
                  </div>
                </div>
              )}

              {/* اسلاید ۹: پنل دانش‌آموز (عکس مجزا برای هر ویژگی با انیمیشن آبشاری) */}
              {activeId === "studentPanel" && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-2xl font-black text-white">پنل اختصاصی دانش‌آموز</h3>
                    <p className="text-xs text-slate-400">امکانات پیشرفته پیگیری وضعیت علمی</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { title: "رادار تعقیب‌کننده جدول", img: images.studentRadar, desc: "مشاهده جایگاه خود نسبت به رقبا" },
                      { title: "محاسبه فاصله تا برترین‌ها", img: images.studentRank, desc: "تحلیل آنی امتیازات لازم تا صعود" },
                      { title: "مدال‌های افتخار و کارنامه", img: images.studentMedals, desc: "نمایش دستاوردها و نمودار پیشرفت" },
                    ].map((feat, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.2 }}
                        className="bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden p-3 flex flex-col justify-between shadow-xl"
                      >
                        <div className="h-28 rounded-xl overflow-hidden mb-2 border border-slate-800/60">
                          <img src={feat.img} alt={feat.title} className="w-full h-full object-cover transform hover:scale-105 transition-transform" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-xs">{feat.title}</h4>
                          <p className="text-[10px] text-slate-400 mt-1">{feat.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* اسلاید ۱۰: پنل معین‌ها (عکس برای هر کدام با ظاهر آبشاری) */}
              {activeId === "mentorPanel" && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-2xl font-black text-white">پنل معین‌های ارشد علمی</h3>
                    <p className="text-xs text-slate-400">ابزارهای نظارتی و مدیریتی کادر آموزشی</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { title: "چک‌لیست نکات کلاس‌های آموزشی", img: images.mentorChecklist },
                      { title: "ثبت کارنامه درسی دانش‌آموزان", img: images.mentorReportCard },
                      { title: "ثبت امتیازات لیگ نخبگان", img: images.mentorLeagueScores },
                    ].map((item, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.2 }}
                        className="bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden p-3 space-y-2 shadow-xl"
                      >
                        <div className="h-32 rounded-xl overflow-hidden border border-slate-800">
                          <img src={item.img} alt={item.title} className="w-full h-full object-cover transform hover:scale-105 transition-transform" />
                        </div>
                        <h4 className="font-bold text-white text-xs text-center">{item.title}</h4>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* اسلاید ۱۱: ایستگاه کنجکاوی (۳ عکس) */}
              {activeId === "media" && (
                <div className="space-y-4">
                  <div className="text-center">
                    <FlaskConical className="w-7 h-7 text-amber-400 mx-auto mb-1 animate-bounce" />
                    <h3 className="text-2xl font-black text-white">ایستگاه کنجکاوی & پخش زنده</h3>
                    <p className="text-xs text-slate-400">پاسخ مقاله‌ای به سوالات چالشی علمی و فناوری‌های نوین</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto">
                    {[
                      { title: "مقالات داغ علمی", img: images.curiosity1 },
                      { title: "پخش زنده کلاس‌ها", img: images.curiosity2 },
                      { title: "پادکست‌های تخصصی", img: images.curiosity3 },
                    ].map((item, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.15 }}
                        className="rounded-2xl overflow-hidden border border-slate-800 h-36 relative shadow-xl"
                      >
                        <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent p-2.5 flex items-end">
                          <span className="text-[11px] font-bold text-amber-300">{item.title}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* اسلاید ۱۲: سایر امکانات سامانه */}
              {activeId === "extra" && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-2xl font-black text-white">سایر امکانات تخصصی سامانه</h3>
                    <p className="text-xs text-slate-400">زیرساخت‌های جامع پژوهشی و اجرایی</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {[
                      { title: "پخش زنده", img: images.extraLive, icon: <Radio className="w-3.5 h-3.5 text-rose-400" /> },
                      { title: "پادکست‌ها", img: images.extraPodcast, icon: <Video className="w-3.5 h-3.5 text-blue-400" /> },
                      { title: "روزشمار", img: images.extraCountdown, icon: <Calendar className="w-3.5 h-3.5 text-amber-400" /> },
                      { title: "تیم برهان", img: images.extraBorhan, icon: <Users className="w-3.5 h-3.5 text-emerald-400" /> },
                      { title: "ویترین فعالیت", img: images.extraShowcase, icon: <Sparkles className="w-3.5 h-3.5 text-purple-400" /> },
                    ].map((item, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden p-2.5 flex flex-col justify-between shadow-lg"
                      >
                        <div className="h-20 rounded-lg overflow-hidden mb-2">
                          <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          {item.icon}
                          <span className="text-[11px] font-bold text-slate-200">{item.title}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* کنترل‌گر اسلایدر پایین */}
      {viewMode === "slider" && (
        <div className="flex flex-col gap-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                currentIndex === 0 
                  ? "opacity-30 cursor-not-allowed bg-slate-900 text-slate-600" 
                  : "bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 shadow-md"
              }`}
            >
              <ChevronRight className="w-4 h-4" /> بخش قبلی
            </button>

            <span className="text-xs text-slate-400 font-mono bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
              {currentStep?.title} ({currentIndex + 1} از {conferenceSteps.length})
            </span>

            <button
              onClick={handleNext}
              disabled={currentIndex === conferenceSteps.length - 1}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                currentIndex === conferenceSteps.length - 1 
                  ? "opacity-30 cursor-not-allowed bg-slate-900 text-slate-600" 
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25"
              }`}
            >
              بخش بعدی <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 overflow-x-auto py-1">
            {conferenceSteps.map((s: ShowcaseStep) => (
              <button
                key={s.id}
                onClick={() => setActiveId(s.id)}
                className={`h-2 rounded-full transition-all ${
                  activeId === s.id ? "w-8 bg-blue-500 shadow-md shadow-blue-500/50" : "w-2 bg-slate-800 hover:bg-slate-700"
                }`}
                title={s.title}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}