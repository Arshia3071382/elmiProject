'use client'

import React, { useState } from 'react'
import AppHome from '@/component/app/AppHome'
import AppHeader from '@/component/app/AppHeader'
import AppHero from '@/component/app/AppHero'
import AppQuickActions from '@/component/app/AppQuickActions'
import AppLeagueCard from '@/component/app/AppLeagueCard'
import AppQuickAccess from '@/component/app/AppQuickAccess'
import AppBottomNav, { TabType } from '@/component/app/AppBottomNav'

export default function AppPreviewPage() {
  const [activeTab, setActiveTab] = useState<TabType>('home')

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900 py-0 sm:py-8 flex justify-center items-center overflow-hidden">
      {/* شاسی موبایل برای نمایش شبیه‌سازی‌شده در دسکتاپ */}
      <div className="w-full max-w-md bg-white h-full sm:h-[844px] sm:max-h-[90vh] sm:rounded-[40px] shadow-2xl overflow-y-auto relative border-0 sm:border-[8px] sm:border-slate-800 scrollbar-none dir-rtl">
        <AppHome
          header={
            <AppHeader
              onNotificationClick={() => alert('کلیک روی اعلان‌ها')}
              onMenuClick={() => alert('کلیک روی منو')}
            />
          }
          hero={
            <AppHero
              studentName="امیرحسین"
              subtitle="هر روز یک قدم به آینده نزدیک‌تر شو."
              buttonText="مشاهده برنامه امروز"
              onActionClick={() => alert('مشاهده برنامه امروز')}
            />
          }
          quickActions={
            <AppQuickActions
              onActionClick={(id) => alert(`کلیک روی اکشن: ${id}`)}
            />
          }
          leagueCard={
            <AppLeagueCard
              rank={12}
              totalParticipants={2450}
              progressPercentage={60}
              onViewLeaderboard={() => alert('مشاهده جدول لیگ')}
            />
          }
          quickAccess={
            <AppQuickAccess
              onItemClick={(id) => alert(`کلیک روی دسترسی سریع: ${id}`)}
            />
          }
          bottomNav={
            <AppBottomNav
              activeTab={activeTab}
              onTabChange={(tab) => setActiveTab(tab)}
            />
          }
        />
      </div>
    </div>
  )
}