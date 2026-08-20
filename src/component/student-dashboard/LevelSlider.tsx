// Scientific levels slider
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Lock, CheckCircle } from "lucide-react";
import { SCIENTIFIC_LEVELS } from "./constants";

interface LevelSliderProps {
  currentIndex: number;
  userLevelIndex: number;
  userScore: number;
  onNext: () => void;    // رفتن به سطح بعدی (به راست)
  onPrev: () => void;    // رفتن به سطح قبلی (به چپ)
  onSelect: (index: number) => void;
}

export default function LevelSlider({
  currentIndex,
  userLevelIndex,
  userScore,
  onNext,
  onPrev,
  onSelect,
}: LevelSliderProps) {
  const activeLevel = SCIENTIFIC_LEVELS[currentIndex];
  const isUserCurrentLevel = userLevelIndex === currentIndex;
  const isUserUnlocked = userScore >= activeLevel.minScore;

  return (
    <div className="pt-6 border-t border-slate-100">
      <div className="text-center mb-4">
        <span className="text-xs font-bold text-slate-700 font-[iranSans-r]">
          برای مشاهده سایر سطوح، کارت را بکشید یا از دکمه‌ها استفاده کنید:
        </span>
      </div>

      <div className="w-full max-w-xl mx-auto relative z-10">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => {
            // Natural swipe behavior like flipping a book
            // Swipe right → go to previous (left)
            if (info.offset.x > 50) {
              onPrev(); // رفتن به چپ
            } 
            // Swipe left → go to next (right)
            else if (info.offset.x < -50) {
              onNext(); // رفتن به راست
            }
          }}
          className="cursor-grab active:cursor-grabbing"
        >
          <div className="relative min-h-[320px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`relative w-full bg-white border-2 rounded-3xl shadow-xl p-8 flex flex-col items-center text-center transition-all duration-500 ${
                  !isUserUnlocked
                    ? "border-slate-200 grayscale opacity-75 bg-slate-50/50"
                    : isUserCurrentLevel
                    ? "border-amber-500 ring-4 ring-amber-500/10 bg-amber-50/20"
                    : "border-slate-200"
                }`}
              >
                {/* Status icon */}
                <div className="absolute top-6 right-6">
                  {!isUserUnlocked ? (
                    <div className="bg-slate-200 p-2.5 rounded-2xl text-slate-500 shadow-sm">
                      <Lock className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className="bg-emerald-100 p-2.5 rounded-2xl text-emerald-600 shadow-sm">
                      <CheckCircle className="w-7 h-7" />
                    </div>
                  )}
                </div>

                {/* Level image */}
                <div className="w-36 h-36 bg-amber-50/60 rounded-3xl flex items-center justify-center mb-5 shadow-inner border border-amber-100/50">
                  <img
                    src={activeLevel.icon}
                    alt={activeLevel.title}
                    className="w-28 h-28 object-contain drop-shadow-md"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>

                <h3 className="font-[iranBold] text-slate-900 text-xl mb-2">
                  {activeLevel.title}
                </h3>

                <span className="text-xs text-amber-700 font-mono bg-amber-100/70 px-4 py-1.5 rounded-full mb-5 font-bold">
                  حداقل {activeLevel.minScore.toLocaleString("fa-IR")} امتیاز
                </span>

                {isUserCurrentLevel && (
                  <span className="px-4 py-1.5 bg-amber-600 text-white rounded-xl text-xs font-bold font-[iranSans-r] shadow-md animate-pulse">
                    سطح فعلی شما
                  </span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Navigation buttons and dots */}
        <div className="flex justify-between items-center mt-6 px-2">
          <button
            onClick={onPrev}
            className="w-11 h-11 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 flex items-center justify-center shadow-md cursor-pointer transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="flex gap-1.5 items-center">
            {SCIENTIFIC_LEVELS.map((_, i) => (
              <button
                key={i}
                onClick={() => onSelect(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  i === currentIndex
                    ? "w-6 bg-amber-500"
                    : "w-2 bg-slate-200 hover:bg-slate-300"
                }`}
              />
            ))}
          </div>

          <button
            onClick={onNext}
            className="w-11 h-11 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 flex items-center justify-center shadow-md cursor-pointer transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}