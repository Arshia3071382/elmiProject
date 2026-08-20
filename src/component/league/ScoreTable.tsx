// src/component/league/ScoreTable.tsx

export function ScoreTable({
  title,
  rows,
  accent = "blue",
}: {
  title: string;
  rows: (string | number)[][];
  accent?: "blue" | "green" | "orange" | "purple" | "red";
}) {
  const accentClasses = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    orange: "bg-orange-50 text-orange-700",
    purple: "bg-purple-50 text-purple-700",
    red: "bg-red-50 text-red-700",
  };

  // تابع تبدیل اعداد انگلیسی به فارسی
  const toPersianDigits = (n: number | string) => {
    return n.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className={`px-5 py-4 font-black ${accentClasses[accent]}`}>
        {title}
      </div>

      <div className="divide-y divide-slate-100">
        {rows.map(([activity, score], index) => {
          // استخراج عدد از هر نوع ورودی (چه عدد خالص، چه رشته فارسی یا منفی)
          const cleanScoreStr = score.toString().replace(/[۰-۹]/g, (d) => 
            "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString()
          );
          const numericScore = Number(cleanScoreStr) || 0;
          const isPositive = numericScore >= 0;

          // بررسی اینکه آیا این جدول مربوط به جریمه است یا خیر (اگر رنگ قرمز بود یا مقادیر منفی داشتند)
          const isPenaltyTable = accent === "red" || numericScore < 0;

          return (
            <div
              key={index}
              className="flex items-center justify-between gap-4 px-5 py-3.5 transition hover:bg-slate-50"
            >
              <span className="text-sm text-slate-700 font-[IRANSansXFaNum-Regular]">
                {activity}
              </span>

              <span
                dir="ltr"
                className={`inline-block shrink-0 rounded-xl px-3 py-1 font-black text-xs ${
                  isPenaltyTable
                    ? "bg-red-100 text-red-600"
                    : "bg-emerald-600 text-white"
                }`}
              >
                {isPenaltyTable ? "-" : "+"}
                {toPersianDigits(Math.abs(numericScore))}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}