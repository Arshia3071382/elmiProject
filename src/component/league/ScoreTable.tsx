// src/component/league/ScoreTable.tsx

export function ScoreTable({
  title,
  rows,
  accent = "blue",
}: {
  title: string;
  rows: string[][];
  accent?: "blue" | "green" | "orange" | "purple";
}) {
  const accentClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className={`px-5 py-4 font-[iranBold] ${accentClasses[accent]}`}>
        {title}
      </div>

      <div className="divide-y divide-slate-100">
        {rows.map(([activity, score], index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-slate-50"
          >
            <span className="text-sm leading-7 text-slate-700">{activity}</span>

            <span className="shrink-0 rounded-xl bg-slate-900 px-3 py-1.5 font-[iranBold] text-sm text-white">
              +{score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}