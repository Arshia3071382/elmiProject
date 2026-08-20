// Progress bar component
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

interface ProgressBarProps {
  currentScore: number;
  nextLevelTitle?: string;
  nextLevelMinScore?: number;
  progressPercent: number;
  scoreNeeded: number;
}

export default function ProgressBar({
  currentScore,
  nextLevelTitle,
  nextLevelMinScore,
  progressPercent,
  scoreNeeded,
}: ProgressBarProps) {
  return (
    <div className="space-y-2">
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
              {nextLevelTitle
                ? `فقط ${scoreNeeded.toLocaleString("fa-IR")} امتیاز تا رسیدن به مرحله بعدی مانده است!`
                : "تبریک! به بالاترین سطح رسیده‌اید 🎉"}
            </p>
          </div>
        </div>
        {nextLevelTitle && (
          <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-xl text-xs font-bold font-[iranSans-r]">
            سطح بعدی: {nextLevelTitle}
          </span>
        )}
      </div>

      <div dir="ltr" className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-0.5 border border-slate-200">
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
        {nextLevelMinScore !== undefined && (
          <span>
            هدف سطح بعدی:{" "}
            <strong className="text-slate-700">
              {nextLevelMinScore.toLocaleString("fa-IR")}
            </strong>
          </span>
        )}
      </div>
    </div>
  );
}