'use client'

import React from 'react'
import { Home, ClipboardList, Trophy, GraduationCap, User, LucideIcon } from 'lucide-react'

export type TabType = 'home' | 'quizzes' | 'league' | 'courses' | 'profile'

interface TabItem {
  id: TabType
  label: string
  icon: LucideIcon
  isCenter?: boolean
}

interface AppBottomNavProps {
  activeTab?: TabType
  onTabChange?: (tab: TabType) => void
}

export default function AppBottomNav({
  activeTab = 'home',
  onTabChange,
}: AppBottomNavProps) {
  const tabs: TabItem[] = [
    { id: 'profile', label: 'پروفایل', icon: User },
    { id: 'quizzes', label: 'آزمون', icon: ClipboardList },
    { id: 'home', label: 'خانه', icon: Home, isCenter: true },
    { id: 'league', label: 'لیگ', icon: Trophy },
    { id: 'courses', label: 'دوره‌ها', icon: GraduationCap },
  ]

  return (
    <div className="bg-white/95 backdrop-blur-md border-t border-slate-100 px-3 py-2 pb-safe shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          if (tab.isCenter) {
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className="flex flex-col items-center relative -top-4 group"
              >
                <div
                  className={`w-13 h-13 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 active:scale-90 ${
                    isActive
                      ? 'bg-blue-600 text-white ring-4 ring-blue-500/20'
                      : 'bg-white text-slate-600 border border-slate-100'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span
                  className={`text-[10px] font-semibold mt-1 transition-colors ${
                    isActive ? 'text-blue-600' : 'text-slate-400'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            )
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className="flex flex-col items-center py-1 px-2.5 rounded-xl transition-all active:scale-90"
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-blue-600' : 'text-slate-400'
                }`}
              />
              <span
                className={`text-[10px] font-medium mt-1 transition-colors ${
                  isActive ? 'text-blue-600 font-bold' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}