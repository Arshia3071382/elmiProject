// Welcome header with edit profile and logout buttons side by side
import { LogOut, Loader2, UserCog } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardHeaderProps {
  name: string;
  grade: number;
  level: string;
  isLoggingOut: boolean;
  onLogout: () => void;
  onEditProfile: () => void;
}

export default function DashboardHeader({
  name,
  grade,
  level,
  isLoggingOut,
  onLogout,
  onEditProfile,
}: DashboardHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-gradient-to-r from-[#1F3A5F] via-[#2563EB] to-[#38BDF8] rounded-3xl p-6 sm:p-8 text-white shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
    >
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium font-[iranSans-r]">
            پایه تحصیلی: {grade}
          </span>
          <span className="px-3 py-1 bg-emerald-500/80 backdrop-blur-md rounded-full text-xs font-medium font-[iranSans-r]">
            {level}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          سلام {name}! 👋
        </h1>
        <p className="text-blue-100 text-sm mt-1 font-[iranSans-r]">
          آماده‌ای رکورد جدیدی در مسیر علمی خودت ثبت کنی؟ 🚀
        </p>
      </div>

      {/* دکمه‌های ویرایش اطلاعات و خروج در کنار هم (حتی در موبایل) */}
      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
        <button
          onClick={onEditProfile}
          className="flex-1 sm:flex-none bg-white/15 hover:bg-white/25 text-white px-3 sm:px-4 py-2.5 rounded-2xl backdrop-blur-md transition-all flex items-center justify-center gap-1.5 shadow-lg font-[iranSans-r] text-xs sm:text-sm border border-white/20 cursor-pointer"
        >
          <UserCog className="w-4 h-4" />
          <span>ویرایش اطلاعات</span>
        </button>

        <button
          onClick={onLogout}
          disabled={isLoggingOut}
          className="flex-1 sm:flex-none bg-red-500/85 hover:bg-red-600 text-white px-3 sm:px-4 py-2.5 rounded-2xl backdrop-blur-md transition-all flex items-center justify-center gap-1.5 shadow-lg font-[iranSans-r] text-xs sm:text-sm border border-red-400/40 cursor-pointer"
        >
          {isLoggingOut ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <LogOut className="w-4 h-4" />
          )}
          <span>{isLoggingOut ? "در حال خروج..." : "خروج"}</span>
        </button>
      </div>
    </motion.div>
  );
}