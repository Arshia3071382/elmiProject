'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppHome from '@/component/app/AppHome'
import AppHeader from '@/component/app/AppHeader'
import AppCountdownBanner from '@/component/app/AppCountdownBanner'
import AppQuickActions from '@/component/app/AppQuickActions'
import AppLeagueCard from '@/component/app/AppLeagueCard'
import AppQuickAccess from '@/component/app/AppQuickAccess'
import AppBottomNav, { TabType } from '@/component/app/AppBottomNav'
import AppPreloader from '@/component/app/AppPreloader'

export default function AppPreviewPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('home')
  const [showPreloader, setShowPreloader] = useState(true)

  return (
    <>
      {/* پریلودر ۳ ثانیه‌ای پیش‌نمایش */}
      {showPreloader && (
        <AppPreloader
          duration={3000}
          onComplete={() => setShowPreloader(false)}
        />
      )}

      <div className="fixed inset-0 z-[9999] bg-slate-900 py-0 sm:py-8 flex justify-center items-center overflow-hidden">
        {/* شاسی موبایل برای نمایش شبیه‌سازی‌شده در دسکتاپ */}
        <div className="w-full max-w-md bg-white h-full sm:h-[844px] sm:max-h-[90vh] sm:rounded-[40px] shadow-2xl overflow-y-auto relative border-0 sm:border-[8px] sm:border-slate-800 scrollbar-none dir-rtl">
          <AppHome
            header={
              <AppHeader
                onMenuClick={() => {}}
              />
            }
            quickActions={
              <div className="space-y-3 pt-1 -mt-1">
                {/* بنر شمارش معکوس پایان لیگ نخبگان - تاریخ ۱ خرداد ۱۴۰۶ */}
                <AppCountdownBanner
                  targetDate="2027-05-22T00:00:00+03:30"
                  targetUrl="/elite-league"
                  imageSrc="/image/appHero.jpg"
                />

                {/* اکشن‌های سریع */}
                <AppQuickActions
                  onActionClick={(id) => {
                    if (id === 'quizzes') router.push('/under-construction')
                    if (id === 'league') router.push('/elite-league')
                    if (id === 'courses') router.push('/courses')
                    if (id === 'goftino') router.push('/chat-guidance/chat')
                  }}
                />
              </div>
            }
            leagueCard={
              <AppLeagueCard
                rank={12}
                totalParticipants={2450}
                progressPercentage={60}
                onViewLeaderboard={() => router.push('/elite-league')}
              />
            }
            quickAccess={
              <AppQuickAccess
                onItemClick={(id) => {
                  if (id === 'honors') router.push('/student/dashboard')
                  if (id === 'notes') router.push('/student/dashboard')
                  if (id === 'calendar') router.push('/calendar')
                  if (id === 'videos') router.push('/courses')
                }}
              />
            }
            bottomNav={
              <AppBottomNav
                activeTab={activeTab}
                onTabChange={(tab) => {
                  setActiveTab(tab)
                  if (tab === 'home') router.push('/')
                  if (tab === 'news') router.push('/news')
                  if (tab === 'about') router.push('/aboutUs')
                  if (tab === 'contact') router.push('/contactUs')
                  if (tab === 'login') router.push('/auth/login')
                }}
              />
            }
          />
        </div>
      </div>
    </>
  )
}