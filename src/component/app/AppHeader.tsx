'use client'

import React from 'react'
import Image from 'next/image'
import { Bell, Menu } from 'lucide-react'

interface AppHeaderProps {
  onNotificationClick?: () => void
  onMenuClick?: () => void
  hasUnreadNotification?: boolean
}

export default function AppHeader({
  onNotificationClick,
  onMenuClick,
  hasUnreadNotification = true,
}: AppHeaderProps) {
  return (
    <div className="pt-safe px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between shadow-xs">
      {/* Notification Button */}
      <button
        onClick={onNotificationClick}
        aria-label="اعلان‌ها"
        className="relative p-2.5 rounded-2xl bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors active:scale-95"
      >
        <Bell className="w-5 h-5" />
        {hasUnreadNotification && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
        )}
      </button>

      {/* Brand Identity */}
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-1.5">
          <Image
            src="/icons/logo6.png"
            alt="لوگوی علمی منتظران"
            width={28}
            height={28}
            className="w-7 h-7 object-contain"
          />
          <h1 className="text-base font-bold text-slate-800 tracking-tight">
            علمی منتظران
          </h1>
        </div>
        <p className="text-[10px] text-slate-400 font-medium mt-0.5">
          آمادگی برای امروز، ساختن فردای بهتر
        </p>
      </div>

      {/* Menu Button */}
      <button
        onClick={onMenuClick}
        aria-label="منو"
        className="p-2.5 rounded-2xl bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors active:scale-95"
      >
        <Menu className="w-5 h-5" />
      </button>
    </div>
  )
}