"use client";

import Link from "next/link";
import { 
  Award, 
  ArrowRight, 
  ChevronLeft, 
  Sparkles,
  Rocket,
  Flame,
  Zap
} from "lucide-react";

const GRADES = [
  { 
    id: 2, 
    label: "پایه دوم", 
    description: "شروع شگفت‌انگیز یادگیری", 
    icon: Rocket,
    titleColor: "text-emerald-950",
    descColor: "text-emerald-600",
    iconBg: "bg-emerald-200/60 text-emerald-800",
    cardBg: "bg-emerald-50/70 hover:bg-emerald-100/60 border-emerald-200/80 hover:border-emerald-400"
  },
  { 
    id: 3, 
    label: "پایه سوم", 
    description: "کشف استعدادها و خلاقیت", 
    icon: Flame,
    titleColor: "text-green-950",
    descColor: "text-green-600",
    iconBg: "bg-green-200/60 text-green-800",
    cardBg: "bg-green-50/70 hover:bg-green-100/60 border-green-200/80 hover:border-green-400"
  },
  { 
    id: 4, 
    label: "پایه چهارم", 
    description: "ماجراجویی در دنیای علوم", 
    icon: Zap,
    titleColor: "text-teal-950",
    descColor: "text-teal-600",
    iconBg: "bg-teal-200/60 text-teal-800",
    cardBg: "bg-teal-50/70 hover:bg-teal-100/60 border-teal-200/80 hover:border-teal-400"
  },
  { 
    id: 5, 
    label: "پایه پنجم", 
    description: "اوج‌گیری مهارت‌ها و رقابت", 
    icon: Rocket,
    titleColor: "text-emerald-950",
    descColor: "text-emerald-600",
    iconBg: "bg-emerald-200/60 text-emerald-800",
    cardBg: "bg-emerald-50/70 hover:bg-emerald-100/60 border-emerald-200/80 hover:border-emerald-400"
  },
  { 
    id: 6, 
    label: "پایه ششم", 
    description: "تثبیت دانش و آمادگی بزرگ", 
    icon: Flame,
    titleColor: "text-green-950",
    descColor: "text-green-600",
    iconBg: "bg-green-200/60 text-green-800",
    cardBg: "bg-green-50/70 hover:bg-green-100/60 border-green-200/80 hover:border-green-400"
  },
  { 
    id: 7, 
    label: "پایه هفتم", 
    description: "ورود به دنیای چالش‌های جدی", 
    icon: Zap,
    titleColor: "text-teal-950",
    descColor: "text-teal-600",
    iconBg: "bg-teal-200/60 text-teal-800",
    cardBg: "bg-teal-50/70 hover:bg-teal-100/60 border-teal-200/80 hover:border-teal-400"
  },
  { 
    id: 8, 
    label: "پایه هشتم", 
    description: "رقابت نفس‌گیر نخبگان", 
    icon: Rocket,
    titleColor: "text-emerald-950",
    descColor: "text-emerald-600",
    iconBg: "bg-emerald-200/60 text-emerald-800",
    cardBg: "bg-emerald-50/70 hover:bg-emerald-100/60 border-emerald-200/80 hover:border-emerald-400"
  },
  { 
    id: 9, 
    label: "پایه نهم", 
    description: "گروه شهید بکائی", 
    icon: Flame,
    titleColor: "text-green-950",
    descColor: "text-green-600",
    iconBg: "bg-green-200/60 text-green-800",
    cardBg: "bg-green-50/70 hover:bg-green-100/60 border-green-200/80 hover:border-green-400"
  },
];

export default function SelectGradePage() {
  return (
    <div dir="rtl" className="min-h-screen bg-slate-100/70 text-slate-900 font-[iranBold] py-10 px-4 mt-10  sm:mt-30 sm:px-6 lg:px-8">
      {/* کانتینر اصلی صفحه */}
      <div className="max-w-5xl mx-auto bg-emerald-50/40 border border-emerald-200/60 rounded-[32px] p-6 sm:p-10 shadow-xl backdrop-blur-sm">
        
        {/* دکمه بازگشت */}
        <div className="mb-8">
          <Link
            href="/elite-league"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-100/80 hover:bg-emerald-200/80 text-emerald-900 border border-emerald-300/70 text-sm transition-all duration-300 font-[iranSans-r] shadow-sm"
          >
            <ArrowRight className="w-4 h-4" />
            بازگشت به انتخاب لیگ‌ها
          </Link>
        </div>

        {/* هدر صفحه */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 mb-5">
            <Award className="w-10 h-10" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-emerald-950 mb-3 tracking-tight">
            لیگ علمی پایه‌های تحصیلی
          </h1>
          <p className="text-emerald-700/80 text-sm md:text-base max-w-xl mx-auto font-[iranSans-r] leading-relaxed">
            پایه تحصیلی خود را انتخاب کنید تا وارد جدول هیجان‌انگیز رقابت‌ها و رتبه‌بندی دانش‌آموزان شوید.
          </p>
        </div>

        {/* کارت‌های انتخاب پایه */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {GRADES.map((g) => {
            const IconComponent = g.icon;
            return (
              <Link
                key={g.id}
                href={`/league/grade/${g.id}`}
                className={`group relative ${g.cardBg} border rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-md flex flex-col justify-between`}
              >
                <div>
                  {/* آیکون کارت */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl ${g.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-xs text-emerald-700/60 font-mono font-bold">#0{g.id}</span>
                  </div>

                  {/* عنوان با سبز پر رنگ و توضیحات با سبز ملایم‌تر */}
                  <h2 className={`text-2xl font-black ${g.titleColor} mb-2`}>
                    {g.label}
                  </h2>
                  <p className={`text-xs ${g.descColor} font-[iranSans-r] leading-relaxed font-semibold`}>
                    {g.description}
                  </p>
                </div>

                {/* فوتر کارت */}
                <div className="mt-8 pt-4 border-t border-emerald-200/60 flex items-center justify-between text-xs font-bold font-[iranSans-r]">
                  <span className={`flex items-center gap-1 ${g.descColor}`}>
                    <Sparkles className="w-3.5 h-3.5" />
                    مشاهده جدول
                  </span>
                  <div className={`w-7 h-7 rounded-full ${g.iconBg} flex items-center justify-center transition-transform group-hover:-translate-x-1`}>
                    <ChevronLeft className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}