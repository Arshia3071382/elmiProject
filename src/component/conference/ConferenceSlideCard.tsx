"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Crown, Shield, Award, Trophy, Users, Brain, Zap, 
  Video, MessageSquare, LineChart, FlaskConical, Sparkles, CheckCircle2 
} from "lucide-react";
import { levels, classScores, activityScores, examScores, percentageScores, scienceScores, onlineScores, libraryScores, impactScores } from "../../../data/leagueData";

interface Props {
  activeStepId: string;
}

export default function ConferenceSlideCard({ activeStepId }: Props) {
  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden min-h-[480px] flex flex-col justify-center">
      
      {/* استپ ۱: معرفی و کادر تشکیلاتی */}
      {activeStepId === "structure" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-black text-white">کادر تشکیلاتی مجموعه علمی منتظران</h3>
            <p className="text-slate-400 text-sm mt-2">ساختار تخصصی هدایت، نظارت و ارزیابی تحصیلی دانش‌آموزان</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 text-center group hover:border-amber-500/50 transition-all">
              <Crown className="w-10 h-10 text-amber-400 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-white">مسئول علمی</h4>
              <p className="text-xs text-slate-400 mt-2">مدیریت کلان و راهبری استراتژیک زیرساخت‌های آموزشی</p>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 text-center group hover:border-blue-500/50 transition-all">
              <Shield className="w-10 h-10 text-blue-400 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-white">معین ارشد علمی</h4>
              <p className="text-xs text-slate-400 mt-2">ناظر تخصصی و کل مقطع (ابتدایی یا راهنمایی)</p>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 text-center group hover:border-emerald-500/50 transition-all">
              <Award className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-white">معین علمی پایه</h4>
              <p className="text-xs text-slate-400 mt-2">مربی و مسئول اختصاصی هر پایه (مثلاً پایه چهارم)</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* استپ ۲: آزمون آنلاین و جذب */}
      {activeStepId === "exam" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-xs font-bold border border-cyan-500/20">هوشمند و آنلاین</span>
            <h3 className="text-2xl md:text-3xl font-black text-white mt-3">آزمون‌های جذب و طبقه‌بندی مدارس</h3>
            <p className="text-slate-300 text-sm mt-3 leading-relaxed">
              سامانه به‌صورت خودکار آزمون‌های ورودی را برگزار کرده، سطح دانش‌آموز را تحلیل می‌کند و او را در کلاس‌های درسی استاندارد سازمان‌دهی می‌کند.
            </p>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-3">
            {examScores.map(([title, pts], i) => (
              <div key={i} className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-sm font-medium text-white">{title}</span>
                <span className="text-xs font-bold bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full">+{pts} امتیازی</span>
              </div>
            ))}
            <div className="text-xs text-slate-400 text-center pt-2">شبیه‌سازی خودکار تراز و درصدگیری پیشرفته</div>
          </div>
        </motion.div>
      )}

      {/* استپ ۳: دو مدل لیگ نخبگان */}
      {activeStepId === "leagues" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-950/60 border border-blue-900/40 rounded-2xl p-6 relative overflow-hidden">
            <Trophy className="w-8 h-8 text-blue-400 mb-3" />
            <h4 className="text-xl font-bold text-white">لیگ علمی پایه</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              رقابت جذاب میان دانش‌آموزان هر پایه (مثلاً لیگ پنجم ابتدایی) به صورت تفکیک‌شده.
            </p>
            <div className="mt-4 bg-blue-950/40 border border-blue-800/40 p-3 rounded-xl text-xs text-blue-300 font-bold">
              🎁 جوایز نفیس ویژه ماهانه برای ۳ نفر برتر هر پایه
            </div>
          </div>
          <div className="bg-slate-950/60 border border-purple-900/40 rounded-2xl p-6 relative overflow-hidden">
            <Users className="w-8 h-8 text-purple-400 mb-3" />
            <h4 className="text-xl font-bold text-white">لیگ نخبگان مقطع</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              رقابت کل مقطع (کل ابتدایی‌ها با هم، کل راهنمایی‌ها با هم) بر اساس فعالیت‌های آموزشی.
            </p>
            <div className="mt-4 bg-purple-950/40 border border-purple-800/40 p-3 rounded-xl text-xs text-purple-300 font-bold">
              🏆 جوایز فصلی + جایزه ویژه پایان سال تحصیلی
            </div>
          </div>
        </motion.div>
      )}

      {/* استپ ۴: معیارهای ارزیابی و امتیازات */}
      {activeStepId === "scores" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <h3 className="text-xl font-black text-white text-center">برخی معیارهای امتیازدهی در لیگ نخبگان</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[350px] overflow-y-auto pl-2">
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <h5 className="text-xs font-bold text-blue-400 mb-2">فعالیت کلاسی</h5>
              {classScores.map(([k, v], i) => (
                <div key={i} className="flex justify-between text-xs py-1 text-slate-300"><span>{k}</span><span className="text-emerald-400">+{v}</span></div>
              ))}
            </div>
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <h5 className="text-xs font-bold text-purple-400 mb-2">پروژه‌های علمی</h5>
              {scienceScores.slice(0, 3).map(([k, v], i) => (
                <div key={i} className="flex justify-between text-xs py-1 text-slate-300"><span>{k}</span><span className="text-emerald-400">+{v}</span></div>
              ))}
            </div>
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <h5 className="text-xs font-bold text-amber-400 mb-2">اثرگذاری و دوستان</h5>
              {impactScores.slice(0, 3).map(([k, v], i) => (
                <div key={i} className="flex justify-between text-xs py-1 text-slate-300"><span>{k}</span><span className="text-emerald-400">+{v}</span></div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* استپ ۵: سطح‌بندی شهدا */}
      {activeStepId === "levels" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="text-center">
            <h3 className="text-2xl font-black text-white">سطح‌بندی علمی (نشان‌های شهدا)</h3>
            <p className="text-slate-400 text-xs mt-1">ارتقای دانش‌آموز بر اساس مجموع امتیازات کسب‌شده</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {levels.map((lvl, idx) => (
              <div key={idx} className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
                <span className="text-2xl">{lvl.icon}</span>
                <div>
                  <h4 className="text-xs font-bold text-white">{lvl.name}</h4>
                  <span className="text-[10px] text-blue-400">{lvl.from} تا {lvl.to} امتیاز</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* استپ ۶ تا ۱۱: دوره‌های آموزشی، گفتینو، پنل‌ها و رسانه */}
      {activeStepId === "academy" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <h3 className="text-2xl font-black text-white">دوره‌های تخصصی و اساتید مجموعه</h3>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">ارائه ویدیوهای آموزشی باکیفیت در سایت و کانال آپارات مجموعه</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl mx-auto">
            {["آموزش نرم‌افزارهای آفیس", "ریاضیات راهنمایی", "فیزیک کنکور", "فتوشاپ با هوش مصنوعی", "برنامه‌نویسی پایتون", "بازی‌سازی با هوش مصنوعی"].map((c, i) => (
              <div key={i} className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs font-bold text-blue-300">
                {c}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {activeStepId === "goftino" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <MessageSquare className="w-12 h-12 text-blue-400 mx-auto" />
          <h3 className="text-2xl font-black text-white">سامانه گفتینو (مشاور و هوش مصنوعی)</h3>
          <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
            حل دغدغه بزرگ انتخاب رشته و سوالات متداول تحصیلی دانش‌آموزان به صورت چت تعاملی هوشمند با مشاوران مجموعه.
          </p>
        </motion.div>
      )}

      {activeStepId === "studentPanel" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="text-2xl font-black text-white">پنل اختصاصی دانش‌آموز</h3>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              رادار تعقیب رتبه، نمایش مدال‌های علمی، فاصله تا نفر بعدی جدول لیگ و بررسی نمودارهای پیشرفت تحصیلی ریزنمرات ثبت‌شده توسط معین علمی.
            </p>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-3 text-xs text-slate-300"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> رادار زنده تعقیب‌کننده در جدول لیگ</div>
            <div className="flex items-center gap-3 text-xs text-slate-300"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> کارنامه تحلیلی و نمودار نمرات درسی</div>
          </div>
        </motion.div>
      )}

      {activeStepId === "mentorPanel" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <Shield className="w-12 h-12 text-purple-400 mx-auto" />
          <h3 className="text-2xl font-black text-white">پنل معین‌های ارشد و پایه</h3>
          <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
            کارت‌های آنالیز و چک‌لیست‌های سریع کلاسی برای ثبت نقاط ضعف، قوت و نکات معلم جهت هدایت دقیق دانش‌آموزان.
          </p>
        </motion.div>
      )}

      {(activeStepId === "media" || activeStepId === "intro") && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <Sparkles className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="text-2xl font-black text-white">پخش زنده، پادکست و ایستگاه کنجکاوی</h3>
          <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
            پخش زنده کلاس‌ها، پادکست‌های علمی و پاسخ به کنجکاوی‌های علمی دانش‌آموزان (مانند *"ریاضی به چه دردی می‌خوره؟"* یا آینده هوش مصنوعی).
          </p>
        </motion.div>
      )}

    </div>
  );
}