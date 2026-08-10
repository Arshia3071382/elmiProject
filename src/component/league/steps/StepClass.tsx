// src/component/league/steps/StepClass.tsx
import { SectionTitle } from "../SectionTitle";
import { ScoreTable } from "../ScoreTable";
import { NextButton } from "../NextButton";
import { classScores, activityScores, homeworkScores } from "./../../../../data/leagueData";

export function StepClass({ onNext }: { onNext: () => void }) {
  return (
    <div>
      <SectionTitle
        eyebrow="امتیاز کلاس"
        title="کلاس رفتن هم امتیاز داره! 📚"
        description="پس کلاس رو جدی بگیر؛ همین کارهای ساده می‌تونن امتیازت رو بالا ببرن."
      />

      <div className="grid gap-5">
        <ScoreTable title="حضور در کلاس" rows={classScores} />
        <ScoreTable title="فعالیت کلاسی" rows={activityScores} accent="green" />
        <ScoreTable title="تکالیف" rows={homeworkScores} accent="purple" />
      </div>

      <NextButton onClick={onNext}>جایزه چی هست حالا؟ 🎁</NextButton>
    </div>
  );
}