'use client'

import React from 'react'
import Link from 'next/link'
import { Home, FileText, Sparkles, PhoneCall, User, LucideIcon } from 'lucide-react'

export type TabType = 'home' | 'quizzes' | 'about' | 'contact' | 'profile'

interface TabItem {
  id: TabType
  label: string
  href: string
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
    { id: 'profile', label: 'پروفایل', href: '/student', icon: User },
    { id: 'quizzes', label: 'آزمون', href: '/under-construction', icon: FileText },
    { id: 'home', label: 'خانه', href: '/', icon: Home, isCenter: true },
    { id: 'about', label: 'درباره ما', href: '/aboutUs', icon: Sparkles },
    { id: 'contact', label: 'ارتباط با ما', href: '/contactUs', icon: PhoneCall },
  ]

  return (
    // کانتینر شناور استاندارد موبایل با پشتیبانی از Safe-Area
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-2 pointer-events-none">
      <nav className="max-w-md mx-auto bg-white/90 backdrop-blur-lg border border-slate-200/80 rounded-3xl shadow-xl shadow-slate-200/50 pointer-events-auto px-3 py-1.5">
        <div className="flex items-center justify-around relative">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            if (tab.isCenter) {
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  onClick={() => onTabChange?.(tab.id)}
                  className="flex flex-col items-center relative -top-5 group"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 active:scale-90 ${
                      isActive
                        ? 'bg-blue-600 text-white ring-4 ring-blue-500/20 shadow-blue-500/30'
                        : 'bg-white text-slate-600 border border-slate-100'
                    }`}
                  >
                    <Icon className="w-6 h-6 stroke-[1.75]" />
                  </div>
                  <span
                    className={`text-[10px] font-semibold mt-1 transition-colors ${
                      isActive ? 'text-blue-600' : 'text-slate-400'
                    }`}
                  >
                    {tab.label}
                  </span>
                </Link>
              )
            }

            return (
              <Link
                key={tab.id}
                href={tab.href}
                onClick={() => onTabChange?.(tab.id)}
                className="flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all active:scale-90"
              >
                <Icon
                  className={`w-5 h-5 stroke-[1.75] transition-transform duration-200 ${
                    isActive ? 'text-blue-600 scale-110' : 'text-slate-400'
                  }`}
                />
                <span
                  className={`text-[10px] mt-0.5 transition-colors ${
                    isActive ? 'text-blue-600 font-bold' : 'text-slate-400 font-medium'
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}