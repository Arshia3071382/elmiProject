// Scientific level badge card
"use client";

import { motion } from "framer-motion";

// Define props interface
interface ScientificLevelCardProps {
  imageUrl: string;
  title: string;
}

export default function ScientificLevelCard({
  imageUrl,
  title,
}: ScientificLevelCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950 rounded-3xl p-6 text-white shadow-2xl border-[3px] border-amber-400/80 ring-4 ring-amber-500/20 flex flex-col items-center justify-center text-center"
    >
      <div className="absolute inset-2 rounded-2xl border border-amber-500/30 pointer-events-none" />
      <div className="absolute -left-10 -top-10 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-0 bottom-0 w-40 h-40 bg-yellow-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 mb-5">
        <span className="text-xs sm:text-sm text-amber-300 font-bold tracking-widest uppercase bg-amber-500/20 px-6 py-2 rounded-full border border-amber-400/50 shadow-md font-[iranSans-r]">
          سطح علمی شما
        </span>
      </div>

      <div className="relative z-10 my-3">
        <div className="absolute inset-0 bg-amber-400 rounded-full blur-2xl opacity-40 animate-pulse" />
        <motion.img
          src={imageUrl}
          alt="Medal"
          animate={{ scale: [1, 1.07, 1] }}
          transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 w-48 h-48 sm:w-60 sm:h-60 object-contain drop-shadow-[0_20px_35px_rgba(251,191,36,0.7)]"
          onError={(e) => {
            (e.target as HTMLElement).style.display = "none";
          }}
        />
      </div>
    </motion.div>
  );
}