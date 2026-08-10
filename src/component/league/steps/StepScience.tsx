// src/component/league/steps/StepScience.tsx
import { SectionTitle } from "../SectionTitle";
import { ScoreTable } from "../ScoreTable";
import { NextButton } from "../NextButton";
import { scienceScores } from "./../../../../data/leagueData";

export function StepScience({ onNext }: { onNext: () => void }) {
  return (
    <div>
      <SectionTitle
        eyebrow="فعالیت علمی"
        title="دانشمند بازی دربیار! 🧪"
        description="آزمایش، تحقیق، پروژه و کارهای علمی هم بخشی از لیگ هستن."
      />

      <ScoreTable
        title="فعالیت‌های علمی و پژوهشی"
        rows={scienceScores}
        accent="orange"
      />

      <NextButton onClick={onNext}>ویدیوهای علمی چی؟ 🎬</NextButton>
    </div>
  );
}