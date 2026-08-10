// src/component/league/steps/StepLibrary.tsx
import { BookOpen, Users, Award } from "lucide-react";
import { SectionTitle } from "../SectionTitle";
import { ScoreTable } from "../ScoreTable";
import { NextButton } from "../NextButton";
import { libraryScores } from "./../../../../data/leagueData";

export function StepLibrary({ onNext }: { onNext: () => void }) {
  return (
    <div>
      <SectionTitle eyebrow="کتابخانه" title="کتاب بخون، امتیاز بگیر! 📚" />

      <ScoreTable
        title="امتیازات کتابخانه"
        rows={libraryScores}
        accent="purple"
      />

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <BookOpen className="text-purple-600" />

          <h3 className="mt-4 font-[iranBold] text-lg">چالش «راوی کتاب»</h3>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            یک کتاب رو در ۲ تا ۵ دقیقه برای بقیه معرفی کن.
          </p>

          <span className="mt-4 inline-block rounded-xl bg-purple-50 px-4 py-2 font-[iranBold] text-purple-600">
            +۸۰ امتیاز
          </span>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <Users className="text-blue-600" />

          <h3 className="mt-4 font-[iranBold] text-lg">چالش «سفیر مطالعه»</h3>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            دوستت رو به کتابخانه یا مسابقه کتابخوانی علاقه‌مند کن.
          </p>

          <span className="mt-4 inline-block rounded-xl bg-blue-50 px-4 py-2 font-[iranBold] text-blue-600">
            +۷۰ امتیاز
          </span>
        </div>
      </div>

      <div className="mt-5 rounded-3xl bg-gradient-to-l from-purple-600 to-blue-600 p-6 text-white">
        <div className="flex items-center gap-3">
          <Award />
          <h3 className="font-[iranBold]">نشان «سفیر مطالعه»</h3>
        </div>

        <p className="mt-3 text-sm leading-7 text-purple-100">
          این نشان ماهانه فقط به یک دانش‌آموز داده می‌شود.
        </p>

        <div className="mt-4 font-[iranBold] text-xl">+۱۰۰ امتیاز</div>
      </div>

      <NextButton onClick={onNext}>حالا بریم سراغ چالش‌های خفن! 🔥</NextButton>
    </div>
  );
}