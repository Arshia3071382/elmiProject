// src/component/league/steps/StepOnline.tsx
import { CheckCircle2 } from "lucide-react";
import { SectionTitle } from "../SectionTitle";
import { ScoreTable } from "../ScoreTable";
import { NextButton } from "../NextButton";
import { onlineScores } from "./../../../../data/leagueData";

export function StepOnline({ onNext }: { onNext: () => void }) {
  return (
    <div>
      <SectionTitle
        eyebrow="فعالیت آنلاین"
        title="حتی ویدیو دیدن هم می‌تونه امتیاز داشته باشه! 🎬"
      />

      <ScoreTable title="فعالیت‌های آموزشی آنلاین" rows={onlineScores} />

      <div className="mt-5 rounded-3xl border border-green-100 bg-green-50 p-6">
        <div className="flex items-center gap-3 text-green-700">
          <CheckCircle2 />
          <span className="font-[iranBold]">برنامه ویژه امتحانات</span>
        </div>

        <p className="mt-3 text-sm leading-8 text-green-700">
          حضور در برنامه ویژه امتحانات:
          <strong className="mr-2 text-lg">+۸۰ امتیاز</strong>
        </p>
      </div>

      <NextButton onClick={onNext}>بریم سراغ کتابخونه! 📚</NextButton>
    </div>
  );
}