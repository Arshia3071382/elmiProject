// src/component/league/steps/StepPowerCards.tsx
import { motion } from "framer-motion";
import { SectionTitle } from "../SectionTitle";
import { NextButton } from "../NextButton";
import { powerCards } from "./../../../../data/leagueData";

export function StepPowerCards({ onNext }: { onNext: () => void }) {
  return (
    <div>
      <SectionTitle
        eyebrow="کارت‌های جهش علمی"
        title="یه کارت می‌تونه همه‌چی رو عوض کنه! 💠"
        description="این کارت‌ها محدودن و شرایط خاص خودشون رو دارن."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        {powerCards.map((card, index) => (
          <motion.div
            key={card.title}
            whileHover={{ y: -5, rotateY: 3 }}
            className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1F3A5F] to-[#2563EB] p-6 text-white shadow-lg"
          >
            <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

            <div className="relative">
              <div className="text-4xl">{card.icon}</div>

              <h3 className="mt-5 font-[iranBold] text-xl">{card.title}</h3>

              <p className="mt-3 text-sm leading-8 text-blue-100">
                {card.text}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <NextButton onClick={onNext}>فقط خودم مهمم؟ 🤝</NextButton>
    </div>
  );
}