'use client'

import React from 'react'
import Image from 'next/image'
import { Star, ChevronLeft } from 'lucide-react'

interface AppLeagueCardProps {
  rank?: number
  totalParticipants?: number
  progressPercentage?: number
  onViewLeaderboard?: () => void
  trophyImageUrl?: string
}

export default function AppLeagueCard({
  rank = 12,
  totalParticipants = 2450,
  progressPercentage = 60,
  onViewLeaderboard,
  trophyImageUrl,
}: AppLeagueCardProps) {
  // تبدیل اعداد به فرمت فارسی
  const formattedRank = rank.toLocaleString('fa-IR')
  const formattedTotal = totalParticipants.toLocaleString('fa-IR')
  const formattedProgress = progressPercentage.toLocaleString('fa-IR')

  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-50/60 via-slate-50 to-white border border-blue-100/80 p-5 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        {/* Detail Area */}
        <div className="flex-1 space-y-3">
          {/* Header Title */}
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">
              لیگ نخبگان علمی
            </h3>
          </div>

          {/* Rank Display */}
          <div>
            <span className="text-[11px] font-medium text-slate-400 block mb-0.5">
              رتبه شما
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-blue-600 tracking-tight">
                {formattedRank}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                از {formattedTotal} نفر
              </span>
            </div>
          </div>

          {/* View Leaderboard Button */}
          <button
            onClick={onViewLeaderboard}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold rounded-xl transition-all active:scale-95 border border-slate-200/50"
          >
            <span>مشاهده جدول</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Trophy Illustration */}
        <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
          {trophyImageUrl ? (
            <Image
              src={trophyImageUrl}
              alt="جام لیگ نخبگان"
              width={96}
              height={96}
              className="object-contain"
            />
          ) : (
            <div className="w-20 h-20 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-200/50">
              <span className="text-4xl">🏆</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <span className="text-[11px] font-semibold text-blue-600 shrink-0">
          %{formattedProgress}
        </span>
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-sky-400 to-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
          />
        </div>
        <span className="text-[11px] font-medium text-slate-400 shrink-0">
          پیشرفت شما در این ماه
        </span>
      </div>
    </div>
  )
}