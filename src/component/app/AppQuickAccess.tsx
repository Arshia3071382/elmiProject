'use client'

import React from 'react'
import {
  Camera,
  Mic,
  Tv,
  Lightbulb,
  Calendar,
  Rocket,
  Compass,
} from 'lucide-react'

interface ShowcaseItem {
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
  const items: ShowcaseItem[] = [
    {
      id: 'showcase',
      title: 'ویترین',
      icon: <Camera className="w-5 h-5" />,
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      id: 'radio',
      title: 'رادیو علمی',
      icon: <Mic className="w-5 h-5" />,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      id: 'live',
      title: 'پخش زنده',
      icon: <Tv className="w-5 h-5" />,
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-500',
    },
    {
      id: 'curiosity',
      title: 'ایستگاه کنجکاوی',
      icon: <Lightbulb className="w-5 h-5" />,
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600',
    },
    {
      id: 'countdown',
      title: 'روزشمار',
      icon: <Calendar className="w-5 h-5" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      id: 'borhan',
      title: 'برهان',
      icon: <Rocket className="w-5 h-5" />,
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
    },
  ]

  return (
    <div className="space-y-3">
      {/* Title */}
      <div className="flex items-center gap-1.5 px-1">
        <Compass className="w-4 h-4 text-blue-600 fill-blue-50" />
        <h4 className="text-xs font-bold text-slate-800 tracking-tight">
          قطب‌نمای علمی
        </h4>
      </div>

      {/* Grid Items (2 سطر 3 تایی) */}
      <div className="grid grid-cols-3 gap-2.5">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.onClick) item.onClick()
              else if (onItemClick) onItemClick(item.id)
            }}
            className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-100 shadow-xs hover:border-slate-200 transition-all active:scale-95 group"
          >
            <div
              className={`w-11 h-11 rounded-xl ${item.bgColor} ${item.textColor} flex items-center justify-center mb-2 transition-transform group-hover:scale-105`}
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