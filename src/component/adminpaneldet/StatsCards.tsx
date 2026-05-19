"use client";

import { Layers, BookOpen, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  categoriesCount: number;
  coursesCount: number;
  averageCourses: number;
}

export default function StatsCards({ categoriesCount, coursesCount, averageCourses }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm mb-1">تعداد گروه‌ها</p>
            <p className="text-3xl font-bold text-gray-800">{categoriesCount}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-xl">
            <Layers className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm mb-1">تعداد دوره‌ها</p>
            <p className="text-3xl font-bold text-gray-800">{coursesCount}</p>
          </div>
          <div className="bg-green-100 p-3 rounded-xl">
            <BookOpen className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm mb-1">میانگین دوره در گروه</p>
            <p className="text-3xl font-bold text-gray-800">{averageCourses}</p>
          </div>
          <div className="bg-purple-100 p-3 rounded-xl">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
}