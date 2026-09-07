'use client'

import React from 'react'
import { Medal, BookOpenCheck, Calendar, Tv, Zap } from 'lucide-react'

interface QuickAccessItem {
  id: string
  title: string
  icon: React.ReactNode
  bgColor: string
  textColor: string
  onClick?: () => void
}

interface AppQuickAccessProps {
  onItemClick?: (id: string) => void
}

export default function AppQuickAccess({ onItemClick }: AppQuickAccessProps) {
  const items: QuickAccessItem[] = [
    {
      id: 'honors',
      title: 'افتخارات من',
      icon: <Medal className="w-5 h-5" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      id: 'notes',
      title: 'یادداشت‌ها',
      icon: <BookOpenCheck className="w-5 h-5" />,
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-500',
    },
    {
      id: 'calendar',
      title: 'تقویم رویدادها',
      icon: <Calendar className="w-5 h-5" />,
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-500',
    },
    {
      id: 'videos',
      title: 'ویدیوهای آموزشی',
      icon: <Tv className="w-5 h-5" />,
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-500',
    },
  ]

  return (
    <div className="space-y-3">
      {/* Title */}
      <div className="flex items-center gap-1.5 px-1">
        <Zap className="w-4 h-4 text-blue-600 fill-blue-600" />
        <h4 className="text-xs font-bold text-slate-800 tracking-tight">
          دسترسی سریع
        </h4>
      </div>

      {/* Grid Items */}
      <div className="grid grid-cols-4 gap-2.5">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.onClick) item.onClick()
              else if (onItemClick) onItemClick(item.id)
            }}
            className="flex flex-col items-center justify-center p-2.5 bg-white rounded-2xl border border-slate-100 shadow-xs hover:border-slate-200 transition-all active:scale-95 group"
          >
            <div
              className={`w-10 h-10 rounded-xl ${item.bgColor} ${item.textColor} flex items-center justify-center mb-1.5 transition-transform group-hover:scale-105`}
            >
              {item.icon}
            </div>
            <span className="text-[11px] font-medium text-slate-700 tracking-tight text-center leading-tight">
              {item.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}