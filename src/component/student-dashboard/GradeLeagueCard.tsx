// Grade league rank card
import { motion } from "framer-motion";
import AnimatedCounter from "./AnimatedCounter";

interface GradeLeagueCardProps {
  score: number;
  rank: number;
  totalStudents: number;
  scientificLevelTitle: string;
  lastUpdate: string;
}

export default function GradeLeagueCard({
  score,
  rank,
  totalStudents,
  scientificLevelTitle,
  lastUpdate,
}: GradeLeagueCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="relative overflow-hidden bg-white/90 backdrop-blur-xl border-2 border-emerald-500/30 rounded-3xl p-6 shadow-xl flex flex-col justify-between"
    >
      <div className="absolute right-0 top-0 w-40 h-40 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 text-xl shadow-inner">
              🏆
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                رتبه در لیگ پایه
              </h3>
              <p className="text-xs text-slate-400 font-[iranSans-r]">
                آخرین بروزرسانی: {lastUpdate}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold font-[iranSans-r]">
            {scientificLevelTitle}
          </span>
        </div>
      </div>

      <div className="my-4 grid grid-cols-2 gap-4 items-center">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-5 rounded-2xl shadow-lg text-center relative overflow-hidden">
          <span className="text-xs text-emerald-100 block mb-1 font-[iranSans-r]">
            رتبه شما در پایه
          </span>
          <motion.span
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white drop-shadow-md block"
          >
            {rank}
          </motion.span>
        </div>

        <div className="bg-emerald-50/80 border border-emerald-100 p-5 rounded-2xl text-center">
          <span className="text-xs text-slate-500 block mb-1 font-[iranSans-r]">
            امتیاز کل لیگ
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono mt-1">
            <AnimatedCounter value={score} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}