// src/component/league/steps/StepPenalties.tsx
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { SectionTitle } from "../SectionTitle";
import { ScoreTable } from "../ScoreTable";
import { NextButton } from "../NextButton";
import { penalties } from "./../../../../data/leagueData";

export function StepPenalties({ onNext }: { onNext: () => void }) {
  return (
    <div>
      <SectionTitle
        eyebrow="قوانین رقابت"
        title="حواست به امتیازاتت باشه! ⚠️"
        description="این امتیازها برای تنبیه نیستن؛ فقط کمک می‌کنن رقابت برای همه عادلانه بمونه."
      />

      <ScoreTable title="موارد کسر امتیاز" rows={penalties} accent="orange" />

      <div className="mt-6 rounded-[2rem] bg-white p-7 shadow-sm">
        <h3 className="font-[iranBold] text-lg">چند قانون مهم</h3>

        <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
          <li>✓ امتیاز فعالیت‌های خاص باید توسط کادر علمی تأیید شود.</li>
          <li>✓ فعالیت غیرواقعی امتیاز نخواهد داشت.</li>
          <li>✓ کارت‌های جهش شرایط استفاده خودشان را دارند.</li>
          <li>✓ نشان‌های ویژه محدود هستند.</li>
          <li>✓ رتبه‌بندی بر اساس امتیازات ثبت‌شده انجام می‌شود.</li>
          <li>
            ✓ تصمیم نهایی فعالیت‌های نیازمند تأیید با کادر علمی مجموعه است.
          </li>
        </ul>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="mt-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1F3A5F] via-[#2563EB] to-[#38BDF8] p-8 text-center text-white shadow-xl"
      >
        <Sparkles className="mx-auto" size={40} />

        <h2 className="mt-5 font-[iranBold] text-2xl md:text-3xl">
          خب قهرمان... 🏆
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-8 text-blue-50 md:text-base">
          حالا دیگه می‌دونی لیگ چطوری کار می‌کنه.
          <br />
          فقط یه سؤال مونده...
        </p>

        <h3 className="mt-6 font-[iranBold] text-xl md:text-2xl">
          آماده‌ای وارد رقابت بشی؟ 🚀
        </h3>

        <button
          onClick={onNext}
          className="mt-7 rounded-2xl bg-white px-8 py-4 font-[iranBold] text-blue-700 shadow-lg transition hover:scale-105"
        >
          شروع مسیر من 🏆
        </button>
      </motion.div>

      <div className="mt-10 text-center">
        <p className="font-[iranBold] text-slate-800">
          رقابت برای رشد، تلاش برای آینده
        </p>

        <p className="mt-2 text-sm text-slate-400">مجموعه علمی منتظران</p>
      </div>
    </div>
  );
}