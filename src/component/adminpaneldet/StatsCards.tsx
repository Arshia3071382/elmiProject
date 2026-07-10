"use client";

import React from "react";
import { Folder, BookOpen, BarChart3 } from "lucide-react";

interface StatsCardsProps {
  categoriesCount: number;
  coursesCount: number;
  averageCourses: number;
}

export default function StatsCards({ categoriesCount, coursesCount, averageCourses }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Categories Count Card */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs text-gray-400 font-medium">تعداد گروه‌ها</span>
          <h4 className="text-2xl font-black text-gray-800">{categoriesCount}</h4>
        </div>
        <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
          <Folder className="w-6 h-6" />
        </div>
      </div>

      {/* Courses Count Card */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs text-gray-400 font-medium">تعداد کل دوره‌ها</span>
          <h4 className="text-2xl font-black text-gray-800">{coursesCount}</h4>
        </div>
        <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
          <BookOpen className="w-6 h-6" />
        </div>
      </div>

      {/* Average Courses Card */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs text-gray-400 font-medium">میانگین دوره در گروه</span>
          <h4 className="text-2xl font-black text-gray-800">{averageCourses}</h4>
        </div>
        <div className="bg-amber-50 text-amber-600 p-3 rounded-xl">
          <BarChart3 className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}