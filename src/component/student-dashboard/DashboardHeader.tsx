import { LogOut, Loader2, UserCog, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardHeaderProps {
  name: string;
  grade: number;
  level: string;
  avatar?: string;
  isLoggingOut: boolean;
  onLogout: () => void;
  onEditProfile: () => void;
}

export default function DashboardHeader({
  name,
  grade,
  level,
  avatar,
  isLoggingOut,
  onLogout,
  onEditProfile,
}: DashboardHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-white/85 backdrop-blur-2xl rounded-3xl p-4 sm:p-8 text-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 group"
    >
      {/* افکت‌های نوری ملایم در پس‌زمینه */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* بخش بالای هدر: شامل آواتار، نام و پایه‌ها */}
      <div className="flex items-start sm:items-center gap-3.5 sm:gap-6 relative z-10 w-full md:w-auto">
        {/* تصویر پروفایل کاملاً دایره‌ای با قاب گرادیانی درخشان */}
        <div className="relative shrink-0">
          <div className="w-16 h-16 sm:w-22 sm:h-22 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-blue-500/10">
            <div className="w-full h-full bg-white rounded-full overflow-hidden flex items-center justify-center">
              {avatar ? (
                <img src={avatar} alt={name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl sm:text-2xl font-bold text-blue-600 font-[iranBold]">{name?.charAt(0) || "ک"}</span>
              )}
            </div>
          </div>
          {/* نشانگر ستاره‌ای */}
          <div className="absolute bottom-0 right-0 bg-amber-500 text-white p-0.5 sm:p-1 rounded-full shadow-md">
            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </div>
        </div>

        {/* اطلاعات متنی کاربر */}
        <div className="flex-1 min-w-0">
          {/* نام کاربر و ایموجی دست (در صورت طولانی بودن نام، به صورت ریسپانسیو می‌شکفد و به خط بعد می‌رود بدون اینکه نقطه‌چین شود) */}
          <h1 className="text-lg sm:text-3xl font-extrabold tracking-tight font-[iranBold] flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-900 shrink-0">سلام</span>
            <span className="inline-flex items-center gap-1.5 flex-wrap">
              <span className="aurora-text">{name}!</span>
              <span className="inline-block animate-bounce text-base sm:text-2xl shrink-0">👋</span>
            </span>
          </h1>

          {/* پایه تحصیلی و سطح دقیقا زیر نام */}
          <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2 flex-wrap">
            <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-blue-50/80 text-blue-700 border border-blue-100/60 rounded-full text-[10px] sm:text-xs font-bold font-[iranSans-r] shrink-0">
              پایه تحصیلی: {grade}
            </span>
            <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-emerald-50/80 text-emerald-700 border border-emerald-100/60 rounded-full text-[10px] sm:text-xs font-bold font-[iranSans-r] shrink-0">
              {level}
            </span>
          </div>
        </div>
      </div>

      {/* دکمه‌های ویرایش اطلاعات و خروج */}
      <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto relative z-10 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
        <button
          onClick={onEditProfile}
          className="flex-1 md:flex-none bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm font-[iranSans-r] text-[11px] sm:text-sm border border-slate-200/60 cursor-pointer active:scale-95"
        >
          <UserCog className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
          <span>ویرایش اطلاعات</span>
        </button>

        <button
          onClick={onLogout}
          disabled={isLoggingOut}
          className="flex-1 md:flex-none bg-red-50/80 hover:bg-red-100 text-red-600 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm font-[iranSans-r] text-[11px] sm:text-sm border border-red-100/80 cursor-pointer active:scale-95"
        >
          {isLoggingOut ? (
            <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-red-600 shrink-0" />
          ) : (
            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 shrink-0" />
          )}
          <span>{isLoggingOut ? "در حال خروج..." : "خروج"}</span>
        </button>
      </div>
    </motion.div>
  );
}