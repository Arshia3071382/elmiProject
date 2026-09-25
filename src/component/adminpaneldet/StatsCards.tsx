import React from "react";

interface GradeStat {
  grade: number;
  count: number;
  unlistedCount?: number;
}

interface StatsCardsProps {
  categoriesCount: number;
  coursesCount: number;
  averageCourses: number;
  elementaryGrades?: GradeStat[];
  middleGrades?: GradeStat[];
}

export default function StatsCards({
  categoriesCount,
  coursesCount,
  averageCourses,
  elementaryGrades = [],
  middleGrades = [],
}: StatsCardsProps) {
  const totalElementary = elementaryGrades.reduce((acc, curr) => acc + curr.count, 0);
  const totalMiddle = middleGrades.reduce((acc, curr) => acc + curr.count + (curr.unlistedCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* کارت‌های کلی */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">تعداد گروه‌ها</p>
            <h3 className="text-2xl font-black text-gray-800 mt-1">{categoriesCount}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-xl">📁</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">تعداد کل دوره‌ها</p>
            <h3 className="text-2xl font-black text-gray-800 mt-1">{coursesCount}</h3>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-black text-xl">📚</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">میانگین دوره در هر گروه</p>
            <h3 className="text-2xl font-black text-gray-800 mt-1">{averageCourses}</h3>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-black text-xl">📊</div>
        </div>
      </div>

      {/* نمودارها و آمار تفکیکی پایه‌ها */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* مقطع ابتدایی */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h4 className="font-black text-gray-800 text-base">مقطع ابتدایی (پایه‌های ۲ تا ۶)</h4>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
              مجموع: {totalElementary} نفر
            </span>
          </div>
          <div className="space-y-3">
            {elementaryGrades.map((item) => (
              <div key={item.grade} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-gray-600">
                  <span>پایه {item.grade}</span>
                  <span>{item.count} دانش‌آموز</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${totalElementary > 0 ? (item.count / totalElementary) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* مقطع راهنمایی */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h4 className="font-black text-gray-800 text-base">مقطع راهنمایی (پایه‌های ۷ تا ۹)</h4>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
              مجموع: {totalMiddle} نفر
            </span>
          </div>
          <div className="space-y-3">
            {middleGrades.map((item) => {
              const hasUnlisted = item.grade === 7 && item.unlistedCount && item.unlistedCount > 0;
              return (
                <div key={item.grade} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-gray-600">
                    <span>پایه {item.grade}</span>
                    <div className="flex items-center gap-2">
                      <span>{item.count} دانش‌آموز</span>
                      {hasUnlisted && (
                        <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-[10px]">
                          ({item.unlistedCount} ثبت‌نشده)
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${totalMiddle > 0 ? ((item.count + (item.unlistedCount || 0)) / totalMiddle) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}