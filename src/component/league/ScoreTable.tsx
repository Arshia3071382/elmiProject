// src/component/league/ScoreTable.tsx

export function ScoreTable({
  title,
  rows,
  accent = "blue",
}: {
  title: string;
  rows: (string | number)[][]; // تغییر برای پشتیبانی از اعداد
  accent?: "blue" | "green" | "orange" | "purple";
}) {
  const accentClasses = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    orange: "bg-orange-50 text-orange-700",
    purple: "bg-purple-50 text-purple-700",
  };

  // تابع تبدیل اعداد به فارسی
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
          const numericScore = Number(score);
          const isPositive = numericScore >= 0;

          return (
            <div
              key={index}
              className="flex items-center justify-between gap-4 px-5 py-3.5 transition hover:bg-slate-50"
            >
              <span className="text-sm text-slate-700 font-[IRANSansXFaNum-Regular]">
                {activity}
              </span>

              <span
                className={`shrink-0 rounded-xl px-3 py-1 font-black text-xs ${
                  isPositive
                    ? "bg-emerald-600 text-white"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {isPositive ? "+" : ""}
                {toPersianDigits(numericScore)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}