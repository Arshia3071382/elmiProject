// src/component/league/steps/StepProgress.tsx
import { Rocket } from "lucide-react";
import { SectionTitle } from "../SectionTitle";
import { NextButton } from "../NextButton";

export function StepProgress({ onNext }: { onNext: () => void }) {
  return (
    <div>
      <SectionTitle
        eyebrow="پیشرفت"
        title="اینجا حتی رشد کردنت هم امتیاز داره! 📈"
      />

      <div className="rounded-[2rem] bg-white p-7 shadow-sm md:p-10">
        <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-sky-500 p-7 text-white">
          <Rocket size={42} />

          <h3 className="mt-5 font-[iranBold] text-2xl">
            هر ۱۰٪ پیشرفت = ۲۰ امتیاز
          </h3>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-4">
              <span className="text-xs text-blue-100">آزمون قبلی</span>
              <strong className="mt-1 block text-xl">۴۰٪</strong>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <span className="text-xs text-blue-100">آزمون جدید</span>
              <strong className="mt-1 block text-xl">۶۰٪</strong>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <span className="text-xs text-blue-100">امتیاز</span>
              <strong className="mt-1 block text-xl">+۴۰</strong>
            </div>
          </div>
        </div>

        <p className="mt-7 leading-8 text-slate-600">
          لازم نیست از همون اول بهترین باشی.
          <br />
          مهم اینه که نسبت به خودِ قبلیت بهتر بشی! 💪
        </p>
      </div>

      <NextButton onClick={onNext}>فعالیت علمی هم امتیاز داره؟ 🧪</NextButton>
    </div>
  );
}