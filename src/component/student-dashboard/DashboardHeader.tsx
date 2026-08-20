// Welcome header with logout
import { LogOut, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardHeaderProps {
  name: string;
  grade: number;
  level: string;
  isLoggingOut: boolean;
  onLogout: () => void;
}

export default function DashboardHeader({
  name,
  grade,
  level,
  isLoggingOut,
  onLogout,
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

      <button
        onClick={onLogout}
        disabled={isLoggingOut}
        className="bg-red-500/85 hover:bg-red-600 text-white px-5 py-3 rounded-2xl backdrop-blur-md transition-all flex items-center gap-2 shadow-lg font-[iranSans-r] text-sm shrink-0 border border-red-400/40 cursor-pointer"
      >
        {isLoggingOut ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <LogOut className="w-4 h-4" />
        )}
        <span>خروج از حساب کاربری</span>
      </button>
    </motion.div>
  );
}