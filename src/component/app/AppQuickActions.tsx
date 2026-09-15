'use client'

import React from 'react'
import Link from 'next/link'
import { FileText, Trophy, BookOpen, MessageSquare, Zap } from 'lucide-react'

interface QuickActionItem {
  id: string
  title: string
  href: string
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
      title: 'آزمون',
      href: '/under-construction',
      icon: <FileText className="w-5 h-5 stroke-[1.75]" />,
      bgColor: 'bg-cyan-50/80',
      textColor: 'text-cyan-600',
    },
    {
      id: 'league',
      title: 'لیگ نخبگان',
      href: '/elite-league',
      icon: <Trophy className="w-5 h-5 stroke-[1.75]" />,
      bgColor: 'bg-amber-50/80',
      textColor: 'text-amber-500',
    },
    {
      id: 'courses',
      title: 'دوره آموزشی',
      href: '/courses',
      icon: <BookOpen className="w-5 h-5 stroke-[1.75]" />,
      bgColor: 'bg-emerald-50/80',
      textColor: 'text-emerald-600',
    },
    {
      id: 'goftino',
      title: 'گفتینو',
      href: '/chat-guidance',
      icon: <MessageSquare className="w-5 h-5 stroke-[1.75]" />,
      bgColor: 'bg-sky-50/80',
      textColor: 'text-sky-500',
    },
  ]

  return (
    <div className="space-y-3">
      {/* Title */}
      <div className="flex items-center gap-1.5 px-1">
        <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
        <h4 className="text-xs font-bold text-slate-800 tracking-tight">
          دسترسی سریع
        </h4>
      </div>

      {/* Grid Items */}
      <div className="grid grid-cols-4 gap-3">
        {actions.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            onClick={() => {
              if (item.onClick) {
                item.onClick()
              }
              if (onActionClick) {
                onActionClick(item.id)
              }
            }}
            className="flex flex-col items-center justify-center p-3 bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm hover:border-slate-200 hover:shadow-md transition-all active:scale-95 group"
          >
            <div
              className={`w-12 h-12 rounded-2xl ${item.bgColor} ${item.textColor} flex items-center justify-center mb-2 transition-transform duration-200 group-hover:scale-110`}
            >
              {item.icon}
            </div>
            <span className="text-xs font-medium text-slate-700 tracking-tight whitespace-nowrap">
              {item.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}