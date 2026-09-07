'use client'

import React from 'react'
import Image from 'next/image'
import { ChevronLeft } from 'lucide-react'

interface AppHeroProps {
  studentName?: string
  subtitle?: string
  buttonText?: string
  onActionClick?: () => void
  illustrationUrl?: string
}

export default function AppHero({
  studentName = 'امیرحسین',
  subtitle = 'هر روز یک قدم به آینده نزدیک‌تر شو.',
  buttonText = 'مشاهده برنامه امروز',
  onActionClick,
  illustrationUrl,
}: AppHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-50/80 via-indigo-50/40 to-white border border-blue-100/60 p-5 shadow-xs">
      <div className="flex items-center justify-between gap-3">
        {/* Text Area */}
        <div className="flex-1 z-10 space-y-2">
          <div className="flex items-center gap-1.5">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              سلام {studentName}!
            </h2>
            <span className="text-lg animate-bounce">👋</span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed font-medium max-w-[190px]">
            {subtitle}
          </p>

          <button
            onClick={onActionClick}
            className="mt-3 inline-flex items-center gap-1 px-4 py-2 bg-[#1F3A5F] hover:bg-[#182e4c] text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95"
          >
            <span>{buttonText}</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hero Graphic / 3D Illustration */}
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
          {illustrationUrl ? (
            <Image
              src={illustrationUrl}
              alt="آموزش"
              width={112}
              height={112}
              className="object-contain"
              priority
            />
          ) : (
            <div className="w-24 h-24 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-200/50">
              <span className="text-4xl">📚</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}