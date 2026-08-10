// src/component/league/steps/StepRewards.tsx
import { Medal, Crown, Rocket, Gift, Sparkles, Zap, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { SectionTitle } from "../SectionTitle";
import { NextButton } from "../NextButton";
import { gradeLeagueRewards, eliteLeagueRewards } from "./../../../../data/leagueData";

export function StepRewards({ onNext }: { onNext: () => void }) {
  return (
    <div>
      <SectionTitle
        eyebrow="رتبه و جایزه"
        title="خب... آخرش چی گیرم میاد؟ 😎🎁"
        description="هرچه بیشتر تلاش کنی، جوایز بزرگ‌تری در انتظارت هست!"
      />

      {/* لیگ علمی - جوایز ماهانه */}
      <div className="mb-8">
        <h3 className="mb-4 flex items-center gap-3 font-[iranBold] text-2xl text-blue-700">
          <Medal className="text-blue-600" size={28} />
          لیگ علمی ماهانه
        </h3>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-[2rem] bg-white p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <Gift className="text-blue-600" size={24} />
              <h4 className="font-[iranBold] text-xl text-slate-800">
                {gradeLeagueRewards.monthly.title}
              </h4>
            </div>

            <p className="mt-3 text-sm text-slate-500">
              سه نفر اول هر پایه در پایان ماه:
            </p>

            <ul className="mt-5 space-y-3">
              {gradeLeagueRewards.monthly.items.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 rounded-xl bg-blue-50 p-3 text-sm font-medium text-blue-700"
                >
                  <span className="text-xl">{item.split(" ")[0]}</span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] bg-gradient-to-br from-blue-600 to-sky-500 p-7 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <Sparkles size={24} />
              <h4 className="font-[iranBold] text-xl">
                {gradeLeagueRewards.seasonal.title}
              </h4>
            </div>

            <p className="mt-3 text-sm text-blue-100">
              جوایز ویژه برای برترین‌های هر فصل:
            </p>

            <ul className="mt-5 space-y-3">
              {gradeLeagueRewards.seasonal.items.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="flex items-center gap-3 rounded-xl bg-white/10 p-3 text-sm font-medium text-blue-50 backdrop-blur"
                >
                  <span className="text-xl">{item.split(" ")[0]}</span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* لیگ نخبگان علمی - جوایز سالانه */}
      <div className="mb-8">
        <h3 className="mb-4 flex items-center gap-3 font-[iranBold] text-2xl text-purple-700">
          <Crown className="text-purple-600" size={28} />
          لیگ نخبگان علمی
        </h3>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-[2rem] bg-gradient-to-br from-purple-600 to-indigo-600 p-7 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <Crown size={24} />
              <h4 className="font-[iranBold] text-xl">
                {eliteLeagueRewards.topThree.title}
              </h4>
            </div>

            <p className="mt-3 text-sm text-purple-100">
              سه نفر اول لیگ نخبگان در پایان سال:
            </p>

            <ul className="mt-5 space-y-3">
              {eliteLeagueRewards.topThree.items.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 rounded-xl bg-white/10 p-3 text-sm font-medium text-purple-50 backdrop-blur"
                >
                  <span className="text-xl">{item.split(" ")[0]}</span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] bg-gradient-to-br from-amber-500 to-orange-500 p-7 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <Zap size={24} />
              <h4 className="font-[iranBold] text-xl">
                {eliteLeagueRewards.seasonal.title}
              </h4>
            </div>

            <p className="mt-3 text-sm text-amber-100">
              جوایز ویژه برای نخبگان هر فصل:
            </p>

            <ul className="mt-5 space-y-3">
              {eliteLeagueRewards.seasonal.items.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="flex items-center gap-3 rounded-xl bg-white/10 p-3 text-sm font-medium text-amber-50 backdrop-blur"
                >
                  <span className="text-xl">{item.split(" ")[0]}</span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* نفرات اول تا بیستم */}
      <div className="mt-5 rounded-[2rem] border border-orange-100 bg-orange-50 p-7">
        <div className="flex items-center gap-3 text-orange-600">
          <Rocket />
          <h3 className="font-[iranBold] text-xl">نفرات اول تا بیستم</h3>
        </div>

        <p className="mt-4 leading-8 text-orange-700">
          اردوی علمی ویژه + هدیه اختصاصی مجموعه
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-3 text-center text-sm shadow-sm">
            📝 دفتر برنامه‌ریزی
          </div>

          <div className="rounded-xl bg-white p-3 text-center text-sm shadow-sm">
            🎁 پک علمی
          </div>

          <div className="rounded-xl bg-white p-3 text-center text-sm shadow-sm">
            🏅 هدیه یادبود
          </div>
        </div>
      </div>

      {/* جمع‌بندی جوایز */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1F3A5F] via-[#2563EB] to-[#38BDF8] p-6 text-white shadow-xl"
      >
        <div className="flex items-center gap-3">
          <Trophy size={28} />
          <h3 className="font-[iranBold] text-xl">جمع‌بندی جوایز 🏆</h3>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
            <p className="font-[iranBold] text-blue-100">لیگ علمی ماهانه</p>
            <ul className="mt-2 space-y-2 text-sm text-blue-50">
              <li>• دو جلسه فوتسال رایگان</li>
              <li>• جوایز متعدد فصلی</li>
              <li>• هدایای ویژه ماهانه</li>
            </ul>
          </div>

          <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
            <p className="font-[iranBold] text-blue-100">لیگ نخبگان علمی</p>
            <ul className="mt-2 space-y-2 text-sm text-blue-50">
              <li>• سه نفر برتر: ۳ میلیون تومان بن</li>
              <li>• جوایز نفیس فصلی</li>
              <li>• تندیس و لوح تقدیر ویژه</li>
            </ul>
          </div>
        </div>
      </motion.div>

      <NextButton onClick={onNext}>
        فقط حواست باشه امتیازت رو از دست ندی! ⚠️
      </NextButton>
    </div>
  );
}