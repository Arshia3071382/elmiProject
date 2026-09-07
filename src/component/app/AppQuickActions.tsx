'use client'

import React from 'react'
import { ClipboardCheck, Trophy, GraduationCap, MessageSquare } from 'lucide-react'

interface QuickActionItem {
  id: string
  title: string
  icon: React.ReactNode
  bgColor: string
  textColor: string
  onClick?: () => void
}

interface AppQuickActionsProps {
  onActionClick?: (id: string) => void
}

export default function AppQuickActions({ onActionClick }: AppQuickActionsProps) {
  const actions: QuickActionItem[] = [
    {
      id: 'quizzes',
      title: 'آزمون‌ها',
      icon: <ClipboardCheck className="w-6 h-6" />,
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-500',
    },
    {
      id: 'league',
      title: 'لیگ نخبگان',
      icon: <Trophy className="w-6 h-6" />,
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-500',
    },
    {
      id: 'courses',
      title: 'دوره‌ها',
      icon: <GraduationCap className="w-6 h-6" />,
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-500',
    },
    {
      id: 'goftino',
      title: 'گفتینو',
      icon: <MessageSquare className="w-6 h-6" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-500',
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-3">
      {actions.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            if (item.onClick) item.onClick()
            else if (onActionClick) onActionClick(item.id)
          }}
          className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-100 shadow-xs hover:border-slate-200 transition-all active:scale-95 group"
        >
          <div
            className={`w-12 h-12 rounded-2xl ${item.bgColor} ${item.textColor} flex items-center justify-center mb-2 transition-transform group-hover:scale-105`}
          >
            {item.icon}
          </div>
          <span className="text-xs font-medium text-slate-700 tracking-tight">
            {item.title}
          </span>
        </button>
      ))}
    </div>
  )
}