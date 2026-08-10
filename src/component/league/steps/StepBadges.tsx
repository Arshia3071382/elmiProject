// src/component/league/steps/StepBadges.tsx
import { Award, Crown } from "lucide-react";
import { SectionTitle } from "../SectionTitle";
import { NextButton } from "../NextButton";

export function StepBadges({ onNext }: { onNext: () => void }) {
  return (
    <div>
      <SectionTitle
        eyebrow="نشان‌های ویژه"
        title="بعضی امتیازها معمولی نیستن! ⭐"
      />

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-[2rem] bg-white p-7 shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
            <Award size={32} />
          </div>

          <h3 className="mt-5 font-[iranBold] text-xl">نشان ویژه معین علمی</h3>

          <p className="mt-4 text-sm leading-8 text-slate-500">
            هر معین علمی ماهانه فقط یک بار این نشان را به یک دانش‌آموز می‌دهد.
          </p>

          <div className="mt-5 rounded-2xl bg-blue-50 p-4 font-[iranBold] text-blue-600">
            +۱۰۰ امتیاز
          </div>

          <ul className="mt-5 space-y-3 text-sm text-slate-600">
            <li>✓ پیشرفت چشمگیر</li>
            <li>✓ تلاش بالا</li>
            <li>✓ فعالیت مؤثر</li>
            <li>✓ رشد علمی محسوس</li>
          </ul>
        </div>

        <div className="rounded-[2rem] bg-gradient-to-br from-[#1F3A5F] to-[#2563EB] p-7 text-white shadow-lg">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
            <Crown size={32} />
          </div>

          <h3 className="mt-5 font-[iranBold] text-xl">نشان شایستگی</h3>

          <p className="mt-4 text-sm leading-8 text-blue-100">
            این نشان ماهانه فقط به یک دانش‌آموز در کل مجموعه تعلق می‌گیرد.
          </p>

          <div className="mt-5 rounded-2xl bg-white/10 p-4 font-[iranBold]">
            +۲۰۰ امتیاز
          </div>

          <ul className="mt-5 space-y-3 text-sm text-blue-100">
            <li>✓ عملکرد فوق‌العاده</li>
            <li>✓ اخلاق ممتاز</li>
            <li>✓ فعالیت علمی خاص</li>
            <li>✓ اثرگذاری بالا</li>
            <li>✓ رشد چشمگیر</li>
          </ul>
        </div>
      </div>

      <NextButton onClick={onNext}>
        حالا بریم ببینیم چه سطحی می‌گیری! 🚀
      </NextButton>
    </div>
  );
}