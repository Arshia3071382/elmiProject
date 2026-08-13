"use client";

import React, { useState, useEffect, useRef } from "react";
import { Headphones, Play, Pause, Download, Sparkles, Volume2, Calendar, Radio, FastForward, Rewind } from "lucide-react";

export default function PodcastsPage() {
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAudio, setActiveAudio] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [durationTime, setDurationTime] = useState("00:00");
  const [playbackRate, setPlaybackRate] = useState(1); // سرعت پیش‌فرض روی 1x
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch("/api/podcasts")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPodcasts(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // اعمال تغییرات سرعت روی المان صوتی
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handlePlayToggle = (pod: any) => {
    if (activeAudio === pod.audioUrl) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      setActiveAudio(pod.audioUrl);
      setActiveTitle(pod.title);
      setIsPlaying(true);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.playbackRate = playbackRate;
          audioRef.current.play();
        }
      }, 150);
    }
  };

  // قابلیت پرش ۵ ثانیه به جلو یا عقب
  const handleSkip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        Math.max(audioRef.current.currentTime + seconds, 0),
        audioRef.current.duration || 0
      );
    }
  };

  // تغییر سرعت بین مقادیر مختلف (شامل ۲ برابری)
  const handleSpeedChange = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextIndex = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    setPlaybackRate(speeds[nextIndex]);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration || 0;
      setProgress(duration > 0 ? (current / duration) * 100 : 0);
      setCurrentTime(formatTime(current));
      setDurationTime(formatTime(duration));
    }
  };

  const handleProgressSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = percentage * audioRef.current.duration;
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[var(--color-bg)] font-[iranSans-r] py-12 px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
      
      {/* هدر صفحه */}
      <div className="max-w-5xl mx-auto text-center mb-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[var(--color-accent)]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] text-xs sm:text-sm font-bold mb-4 border border-[var(--color-secondary)]/20 shadow-xs">
          <Sparkles className="w-4 h-4 text-[var(--color-secondary)] animate-spin" />
          <span>رادیو علمی منتظران</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-[iranBold] text-[var(--color-primary)] tracking-tight mb-4">
          پادکست‌های صوتی و آموزشی
        </h1>
        <p className="text-[var(--color-text-secondary)] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          عمیق‌ترین مباحث علمی، تحلیل‌های تخصصی و گفتگوهای انگیزشی را به صورت صوتی گوش دهید یا برای مرور آفلاین دانلود کنید.
        </p>
      </div>

      {/* محتوای اصلی */}
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-[var(--color-secondary)] border-t-transparent rounded-full animate-spin" />
            <p className="text-[var(--color-text-secondary)] text-sm font-bold">در حال بارگذاری اپیزودها...</p>
          </div>
        ) : podcasts.length === 0 ? (
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-blue-50 text-[var(--color-secondary)] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Headphones className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-[iranBold] text-[var(--color-text-primary)] mb-1">هنوز پادکستی منتشر نشده است</h3>
            <p className="text-[var(--color-text-secondary)] text-sm">به زودی جذاب‌ترین اپیزودهای علمی در این بخش قرار می‌گیرند.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {podcasts.map((pod: any, idx: number) => {
              const isCurrentActive = activeAudio === pod.audioUrl;
              return (
                <div 
                  key={pod._id || idx}
                  className={`bg-[var(--color-surface)] border rounded-3xl p-6 sm:p-7 shadow-sm transition-all duration-300 hover:shadow-md relative overflow-hidden ${
                    isCurrentActive ? "border-[var(--color-secondary)] ring-2 ring-[var(--color-secondary)]/10" : "border-[var(--color-border)]"
                  }`}
                >
                  {/* افکت بصری برای پادکست در حال پخش */}
                  {isCurrentActive && isPlaying && (
                    <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] animate-pulse" />
                  )}

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    
                    {/* اطلاعات پادکست */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner transition-transform duration-300 ${
                        isCurrentActive ? "bg-[var(--color-secondary)] text-white scale-105" : "bg-blue-50 text-[var(--color-secondary)]"
                      }`}>
                        {isCurrentActive && isPlaying ? (
                          <Radio className="w-7 h-7 animate-pulse" />
                        ) : (
                          <Headphones className="w-7 h-7" />
                        )}
                      </div>

                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)]">
                          <span className="flex items-center gap-1 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-[var(--color-secondary)]" />
                            {new Date(pod.createdAt || Date.now()).toLocaleDateString('fa-IR')}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                          <span className="text-[var(--color-success)] font-bold bg-[var(--color-success)]/10 px-2 py-0.5 rounded-md">
                            اپیزود علمی
                          </span>
                        </div>

                        <h3 className="text-lg sm:text-xl font-[iranBold] text-[var(--color-text-primary)]">
                          {pod.title}
                        </h3>
                        
                        <p className="text-[var(--color-text-secondary)] text-xs sm:text-sm leading-relaxed line-clamp-2">
                          {pod.description}
                        </p>
                      </div>
                    </div>

                    {/* دکمه‌های کنترل */}
                    <div className="flex items-center gap-3 justify-end shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-[var(--color-border)]">
                      
                      {/* دکمه دانلود مستقیم */}
                      <a
                        href={pod.audioUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[var(--color-text-secondary)] font-bold text-xs sm:text-sm transition-all active:scale-95"
                        title="دانلود مستقیم فایل صوتی"
                      >
                        <Download className="w-4 h-4 text-[var(--color-primary)]" />
                        <span>دانلود</span>
                      </a>

                      {/* دکمه پخش / توقف */}
                      <button
                        onClick={() => handlePlayToggle(pod)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-[iranBold] text-xs sm:text-sm text-white shadow-md transition-all active:scale-95 cursor-pointer ${
                          isCurrentActive && isPlaying 
                            ? "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20" 
                            : "bg-[var(--color-secondary)] hover:bg-blue-700 shadow-[var(--color-secondary)]/25"
                        }`}
                      >
                        {isCurrentActive && isPlaying ? (
                          <>
                            <Pause className="w-4 h-4 fill-current" />
                            <span>توقف پخش</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 fill-current" />
                            <span>پخش آنلاین</span>
                          </>
                        )}
                      </button>

                    </div>
                  </div>

                  {/* نوار پیشرفت سفارشی و امکانات تکمیلی (فقط برای پادکست فعال) */}
                  {isCurrentActive && (
                    <div className="mt-6 pt-4 border-t border-[var(--color-border)] animate-in fade-in duration-300">
                      
                      {/* ابزارهای کنترلی جدید (سرعت و پرش ۵ ثانیه) */}
                      <div className="flex items-center justify-between mb-3 text-xs">
                        <div className="flex items-center gap-2">
                          {/* دکمه عقب ۵ ثانیه */}
                          <button
                            onClick={() => handleSkip(-5)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-[var(--color-text-secondary)] font-bold transition-all active:scale-95"
                            title="۵ ثانیه عقب"
                          >
                            <Rewind className="w-3.5 h-3.5" />
                            <span>۵- ثانیه</span>
                          </button>

                          {/* دکمه جلو ۵ ثانیه */}
                          <button
                            onClick={() => handleSkip(5)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-[var(--color-text-secondary)] font-bold transition-all active:scale-95"
                            title="۵ ثانیه جلو"
                          >
                            <span>۵+ ثانیه</span>
                            <FastForward className="w-3.5 h-3.5" />
                          </button>

                          {/* دکمه تغییر سرعت (1x, 1.25x, 1.5x, 2x) */}
                          <button
                            onClick={handleSpeedChange}
                            className="px-2.5 py-1.5 rounded-lg bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] font-bold hover:bg-[var(--color-secondary)]/25 transition-all active:scale-95"
                            title="تغییر سرعت پخش"
                          >
                            سرعت: {playbackRate}x
                          </button>
                        </div>

                        <div dir="ltr" className="font-mono text-gray-500 font-bold">
                          {currentTime} / {durationTime}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)] font-bold mb-1">
                        <span className="text-[var(--color-secondary)] flex items-center gap-1">
                          <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                          {isStreamingStatusText(isPlaying)}
                        </span>
                      </div>

                      {/* نوار اسکراب شونده - تنظیم شده روی LTR */}
                      <div 
                        dir="ltr"
                        onClick={handleProgressSeek}
                        className="w-full bg-gray-200 h-3 rounded-full cursor-pointer relative overflow-hidden group shadow-inner py-1 my-1"
                      >
                        <div className="w-full h-full bg-transparent relative rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] h-full transition-all duration-75 relative rounded-full" 
                            style={{ width: `${progress}%` }}
                          >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-2 border-[var(--color-secondary)] rounded-full shadow-md scale-75 group-hover:scale-100 transition-transform" />
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

        {/* پلیر صوتی اصلی و مخفی */}
        {activeAudio && (
          <audio
            ref={audioRef}
            src={activeAudio}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => {
              setIsPlaying(false);
              setProgress(0);
            }}
          />
        )}
      </div>

    </div>
  );
}

// تابع کمکی برای وضعیت پخش
function isStreamingStatusText(isPlaying: boolean) {
  return isPlaying ? "در حال پخش اپیزود..." : "متوقف شده";
}