// src/component/league/steps/StepLeagues.tsx
import { Medal, Crown, Gift, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { SectionTitle } from "../SectionTitle";
import { NextButton } from "../NextButton";
import { gradeLeagueRewards, eliteLeagueRewards } from "./../../../../data/leagueData";

export function StepLeagues({ onNext }: { onNext: () => void }) {
  return (
    <div>
      <SectionTitle eyebrow="مرحله دوم" title="دو مدل رقابت داریم! 🏆" />

      <div className="grid gap-5 md:grid-cols-2">
        {/* لیگ علمی */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-[2rem] border border-blue-100 bg-white p-7 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
            <Medal />
          </div>

          <h3 className="font-[iranBold] text-2xl">لیگ علمی</h3>

          <p className="mt-4 leading-8 text-slate-500">
            اینجا با بچه‌های هم‌پایه خودت رقابت می‌کنی.
          </p>

          <div className="mt-6 rounded-2xl bg-blue-50 p-5">
            <div className="flex items-center gap-2">
              <Gift size={20} className="text-blue-600" />
              <p className="font-[iranBold] text-blue-700">
                {gradeLeagueRewards.monthly.title}
              </p>
            </div>

            <ul className="mt-3 space-y-2">
              {gradeLeagueRewards.monthly.items.map((item, index) => (
                <li key={index} className="text-sm text-blue-600">
                  • {item}
                </li>
              ))}
            </ul>

            <div className="mt-4 border-t border-blue-200 pt-4">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-blue-600" />
                <p className="text-sm font-[iranBold] text-blue-700">
                  {gradeLeagueRewards.seasonal.title}
                </p>
              </div>
              <ul className="mt-2 space-y-1">
                {gradeLeagueRewards.seasonal.items.slice(0, 3).map((item, index) => (
                  <li key={index} className="text-xs text-blue-600">
                    • {item}
                  </li>
                ))}
                <li className="text-xs text-blue-400">• و...</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* لیگ نخبگان علمی */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-[2rem] border border-purple-100 bg-white p-7 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
            <Crown />
          </div>

          <h3 className="font-[iranBold] text-2xl">لیگ نخبگان علمی</h3>

          <p className="mt-4 leading-8 text-slate-500">
            اینجا رقابت بزرگه!
            <br />
            همه دانش‌آموزان پایه دوم تا نهم در جدول کلی با هم رقابت می‌کنن.
          </p>

          <div className="mt-6 rounded-2xl bg-purple-50 p-5">
            <div className="flex items-center gap-2">
              <Crown size={20} className="text-purple-600" />
              <p className="font-[iranBold] text-purple-700">
                {eliteLeagueRewards.topThree.title}
              </p>
            </div>

            <ul className="mt-3 space-y-2">
              {eliteLeagueRewards.topThree.items.map((item, index) => (
                <li key={index} className="text-sm text-purple-600">
                  • {item}
                </li>
              ))}
            </ul>

            <div className="mt-4 border-t border-purple-200 pt-4">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-purple-600" />
                <p className="text-sm font-[iranBold] text-purple-700">
                  {eliteLeagueRewards.seasonal.title}
                </p>
              </div>
              <ul className="mt-2 space-y-1">
                {eliteLeagueRewards.seasonal.items.slice(0, 3).map((item, index) => (
                  <li key={index} className="text-xs text-purple-600">
                    • {item}
                  </li>
                ))}
                <li className="text-xs text-purple-400">• و...</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      <NextButton onClick={onNext}>خب، امتیازها رو از کجا بگیرم؟</NextButton>
    </div>
  );
}