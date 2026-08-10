// src/component/league/steps/StepIntro.tsx
import { Trophy } from "lucide-react";
import { SectionTitle } from "../SectionTitle";
import { NextButton } from "../NextButton";

export function StepIntro({
  education,
  onNext,
}: {
  education: "primary" | "middle";
  onNext: () => void;
}) {
  return (
    <div>
      <SectionTitle eyebrow="مرحله اول" title="اصلاً لیگ نخبگان چیه؟ 🏆" />

      <div className="rounded-[2rem] bg-white p-7 shadow-sm md:p-10">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
            <Trophy size={32} />
          </div>

          <div>
            <p className="text-sm text-slate-400">مسیر انتخابی تو</p>

            <p className="font-[iranBold] text-lg">
              {education === "primary"
                ? "ابتدایی | پایه دوم تا ششم"
                : "راهنمایی | پایه هفتم تا نهم"}
            </p>
          </div>
        </div>

        <p className="text-base leading-9 text-slate-600">
          لیگ نخبگان علمی یه مسابقه بزرگ بین بچه‌های مجموعه علمیه منتظرانه.
          اینجا فقط نمره بالا مهم نیست!
          <br />
          <br />
          حضور توی کلاس، پیشرفت توی آزمون، انجام آزمایش، کتاب خوندن، ساخت کلیپ
          علمی، کمک به دوستات و کلی فعالیت دیگه می‌تونه برات امتیاز بیاره.
          <br />
          <br />
          هرچی بیشتر تلاش کنی، امتیازت بیشتر میشه، سطح بالاتری می‌گیری و به
          قهرمانی نزدیک‌تر میشی. 🚀
        </p>

        <NextButton onClick={onNext}>
          خب، حالا چه جوری رقابت می‌کنیم؟
        </NextButton>
      </div>
    </div>
  );
}