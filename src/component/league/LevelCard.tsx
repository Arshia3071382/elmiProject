// src/component/league/LevelCard.tsx
import { motion } from "framer-motion";
import { levels } from "./../../../data/leagueData";

export function LevelCard({
  level,
  index,
}: {
  level: (typeof levels)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="absolute -left-10 -top-10 h-24 w-24 rounded-full bg-blue-100 blur-2xl" />

      <div className="relative flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-2xl">
          {level.icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-400">سطح {index + 1}</p>

          <h3 className="mt-1 font-[iranBold] text-lg text-slate-900">
            {level.name}
          </h3>

          <p className="mt-1 text-sm text-blue-600">
            {level.from} تا {level.to} امتیاز
          </p>
        </div>
      </div>
    </motion.div>
  );
}