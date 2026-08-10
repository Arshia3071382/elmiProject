// src/component/league/steps/StepExam.tsx
import { SectionTitle } from "../SectionTitle";
import { ScoreTable } from "../ScoreTable";
import { NextButton } from "../NextButton";
import { examScores, percentageScores } from "./../../../../data/leagueData";

export function StepExam({ onNext }: { onNext: () => void }) {
  return (
    <div>
      <SectionTitle
        eyebrow="امتیاز آزمون"
        title="آزمون فقط برای نمره نیست! 🧠"
        description="شرکت کنی امتیاز می‌گیری؛ درصد خوب هم امتیاز بیشتری میاره."
      />

      <div className="space-y-5">
        <ScoreTable title="شرکت در آزمون" rows={examScores} />

        <ScoreTable
          title="میانگین درصد آزمون"
          rows={percentageScores}
          accent="green"
        />
      </div>

      <NextButton onClick={onNext}>اگه پیشرفت کنم چی؟ 🚀</NextButton>
    </div>
  );
}