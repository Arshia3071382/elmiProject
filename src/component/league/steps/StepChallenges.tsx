// src/component/league/steps/StepChallenges.tsx
import { motion } from "framer-motion";
import { Video, FlaskConical, Users } from "lucide-react";
import { SectionTitle } from "../SectionTitle";
import { NextButton } from "../NextButton";
import { challengeItems } from "./../../../../data/leagueData";

const iconMap: Record<string, React.ElementType> = {
  Video: Video,
  FlaskConical: FlaskConical,
  Users: Users,
};

export function StepChallenges({ onNext }: { onNext: () => void }) {
  return (
    <div>
      <SectionTitle
        eyebrow="چالش‌های نخبگی"
        title="اینجا می‌تونی حسابی امتیاز جمع کنی! 🔥"
      />

      <div className="grid gap-5">
        {challengeItems.map((challenge, index) => {
          const Icon = iconMap[challenge.icon] || Video;

          return (
            <motion.div
              key={challenge.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                    <Icon />
                  </div>

                  <div>
                    <h3 className="font-[iranBold] text-lg">
                      {challenge.title}
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-slate-500">
                      {challenge.text}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 rounded-xl bg-orange-50 px-3 py-2 font-[iranBold] text-sm text-orange-600">
                  +{challenge.score}
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-500">
                <strong className="text-slate-700">مثال:</strong>{" "}
                {challenge.examples}
              </div>
            </motion.div>
          );
        })}
      </div>

      <NextButton onClick={onNext}>کارت جهش دیگه چیه؟ 💠</NextButton>
    </div>
  );
}