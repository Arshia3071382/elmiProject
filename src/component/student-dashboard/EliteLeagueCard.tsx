// Elite league rank card - Minimal Gold Celebration Theme
import { motion } from "framer-motion";

interface EliteLeagueCardProps {
  rank: number;
  category: string;
}

export default function EliteLeagueCard({ rank, category }: EliteLeagueCardProps) {
  if (!rank || rank <= 0) return null;

  const confettiParticles = Array.from({ length: 8 });

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 rounded-3xl px-5 py-4 sm:px-6 sm:py-5 shadow-xl text-amber-950 border border-yellow-100 flex items-center justify-between gap-3 sm:gap-4"
    >
      {/* افکت ذرات جشن */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confettiParticles.map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-2.5 bg-white/80 rounded-full"
            initial={{
              top: "-10%",
              left: `${Math.random() * 100}%`,
              opacity: 0.8,
            }}
            animate={{
              top: "110%",
              rotate: Math.random() * 360,
              x: (Math.random() - 0.5) * 50,
            }}
            transition={{
              duration: Math.random() * 2.5 + 1.5,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* بخش متن مینیمال */}
      <div className="relative z-10">
        <span className="inline-block px-2.5 py-0.5 bg-white/40 backdrop-blur-md text-amber-900 rounded-full text-[11px] font-bold mb-1">
          {category === "elementary" ? "لیگ نخبگان دبستان" : "لیگ نخبگان متوسطه"}
        </span>
        <h2 className="text-base sm:text-lg font-black tracking-tight text-amber-950">
          تبریک! رتبه برتر نخبگان ✨
        </h2>
        <p className="text-xs text-amber-900/90 font-medium hidden sm:block mt-0.5">
          نام شما در صدر افتخارآفرینان درخشید.
        </p>
      </div>

      {/* بخش نمایش بزرگ رتبه (نزدیک‌تر به متن در دسکتاپ) */}
      <div className="relative z-10 flex items-center bg-white/30 backdrop-blur-md px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl border border-white/50 shadow-inner shrink-0">
        <div className="text-center">
          <motion.span
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="text-3xl sm:text-4xl font-black font-mono tracking-tighter text-amber-950 block leading-none"
          >
            {rank}
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}