// src/component/league/steps/StepImpact.tsx
import { SectionTitle } from "../SectionTitle";
import { ScoreTable } from "../ScoreTable";
import { NextButton } from "../NextButton";
import { impactScores } from "./../../../../data/leagueData";

export function StepImpact({ onNext }: { onNext: () => void }) {
  return (
    <div>
      <SectionTitle
        eyebrow="امتیاز اثرگذاری"
        title="نه! اینجا رشد بقیه هم مهمه 🤝"
        description="اگر باعث پیشرفت دوستات بشی، خودت هم امتیاز می‌گیری."
      />

      <ScoreTable title="امتیاز اثرگذاری" rows={impactScores} accent="green" />

      <div className="mt-6 rounded-3xl bg-green-50 p-6 text-green-800">
        <p className="font-[iranBold]">
          قهرمان واقعی کسیه که بقیه رو هم بالا بکشه. 💚
        </p>
      </div>

      <NextButton onClick={onNext}>نشان ویژه هم داریم؟ ⭐</NextButton>
    </div>
  );
}