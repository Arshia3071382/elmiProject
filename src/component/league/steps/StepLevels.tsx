// src/component/league/steps/StepLevels.tsx
import { Crown } from "lucide-react";
import { SectionTitle } from "../SectionTitle";
import { LevelCard } from "../LevelCard";
import { NextButton } from "../NextButton";
import { levels } from "./../../../../data/leagueData";

export function StepLevels({ onNext }: { onNext: () => void }) {
  return (
    <div>
      <SectionTitle
        eyebrow="سطح‌بندی"
        title="هرچی بیشتر تلاش کنی، سطحتم بالاتر میره! 🚀"
        description="مسیرت رو ادامه بده و خودت رو به بالاترین سطح برسون."
      />

      <div className="space-y-4">
        {levels.map((level, index) => (
          <LevelCard key={level.name} level={level} index={index} />
        ))}
      </div>

      <div className="mt-6 rounded-3xl bg-slate-900 p-6 text-center text-white">
        <Crown className="mx-auto" size={34} />

        <p className="mt-4 font-[iranBold]">سطح نهایی: شهید فخری‌زاده 👑</p>

        <p className="mt-2 text-sm text-slate-300">۱۲۵۰۰ امتیاز به بالا</p>
      </div>

      <NextButton onClick={onNext}>خب... آخرش چی گیرم میاد؟ 🎁</NextButton>
    </div>
  );
}