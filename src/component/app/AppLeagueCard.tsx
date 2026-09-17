'use client'

import React from 'react'
import Image from 'next/image'
import { Star, Award, ShieldAlert } from 'lucide-react'

interface AppLeagueCardProps {
  isLoggedIn?: boolean
  inEliteLeague?: boolean
  eliteRank?: number
  eliteTotal?: number
  basicRank?: number
  basicTotal?: number
  medalImageUrl?: string
  medalTitle?: string
}

export default function AppLeagueCard({
  isLoggedIn = false,
  inEliteLeague = false,
  eliteRank = 12,
  eliteTotal = 50,
  basicRank = 5,
  basicTotal = 30,
  medalImageUrl,
  medalTitle = 'مدال علمی',
}: AppLeagueCardProps) {
  
  // ۱. عدم رندر کارت‌ها در صورت عدم لاگین
  if (!isLoggedIn) return null

  const fEliteRank = (eliteRank || 0).toLocaleString('fa-IR')
  const fEliteTotal = (eliteTotal || 0).toLocaleString('fa-IR')
  const fBasicRank = (basicRank || 0).toLocaleString('fa-IR')
  const fBasicTotal = (basicTotal || 0).toLocaleString('fa-IR')

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-100 p-3.5 shadow-xs flex items-stretch justify-between gap-3">
      
      {/* سمت راست: دو کارت رتبه (افقی و زیر هم) */}
      <div className="flex flex-col justify-center gap-2.5 flex-1">
        
        {/* لیگ نخبگان */}
        {inEliteLeague ? (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 border border-amber-300/80 p-2.5 flex items-center justify-between shadow-[0_0_12px_rgba(251,191,36,0.25)]">
            <div className="absolute inset-0 bg-amber-400/10 blur-md animate-pulse"></div>
            <div className="relative flex items-center gap-1.5 z-10">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-[11px] font-[iranBold] text-amber-900 tracking-tight">لیگ نخبگان</span>
            </div>
            <div className="relative z-10 text-[10px] font-semibold text-amber-800">
              رتبه <span className="text-sm font-black mx-0.5 text-amber-900">{fEliteRank}</span> از {fEliteTotal} نفر
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-2.5 flex items-center justify-between opacity-60">
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-[iranBold] text-slate-500 tracking-tight">لیگ نخبگان</span>
            </div>
            <span className="text-[9px] font-medium text-slate-400">عدم حضور در جدول</span>
          </div>
        )}

        {/* لیگ پایه */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-100 via-emerald-50 to-emerald-100 border border-emerald-300/80 p-2.5 flex items-center justify-between shadow-[0_0_12px_rgba(52,211,153,0.2)]">
          <div className="absolute inset-0 bg-emerald-400/10 blur-md animate-pulse"></div>
          <div className="relative flex items-center gap-1.5 z-10">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[11px] font-[iranBold] text-emerald-900 tracking-tight">لیگ پایه</span>
          </div>
          <div className="relative z-10 text-[10px] font-semibold text-emerald-800">
            رتبه <span className="text-sm font-black mx-0.5 text-emerald-950">{fBasicRank}</span> از {fBasicTotal} نفر
          </div>
        </div>

      </div>

      {/* سمت چپ: مدال سطح علمی */}
      <div className="relative w-24 shrink-0 flex flex-col items-center justify-center bg-slate-50/80 rounded-2xl border border-slate-100 p-2">
        {medalImageUrl ? (
          <Image
            src={medalImageUrl}
            alt={medalTitle}
            width={60}
            height={60}
            className="object-contain drop-shadow-sm mb-1"
          />
        ) : (
          <div className="w-12 h-12 bg-gradient-to-tr from-amber-100 to-amber-50 rounded-full flex items-center justify-center border border-amber-200/60 shadow-2xs mb-1">
            <span className="text-2xl">🏅</span>
          </div>
        )}
        <span className="text-[9px] font-[iranBold] text-slate-600 text-center leading-tight">
          {medalTitle}
        </span>
      </div>

    </div>
  )
}