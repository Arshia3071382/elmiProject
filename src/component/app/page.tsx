'use client'

import React, { useState, useEffect } from 'react'
import AppShell from '@/component/app/AppShell'
import AppHome from '@/component/app/AppHome'
import AppHeader from '@/component/app/AppHeader'
import AppHero from '@/component/app/AppHero'
import AppQuickActions from '@/component/app/AppQuickActions'
import AppLeagueCard from '@/component/app/AppLeagueCard'
import AppQuickAccess from '@/component/app/AppQuickAccess'
import AppBottomNav, { TabType } from '@/component/app/AppBottomNav'

// 1. UI فعلی وب‌سایت شما (کدهای صفحه اصلی فعلی سایت را اینجا یا در فایل مجزا فراخوانی کنید)
function ExistingWebsiteHome() {
  return (
    <div className="w-full">
      {/* محتوای فعلی صفحه اصلی سایت شما در اینجا قرار می‌گیرد */}
      {/* این بخش در مرورگر عادی دقیقاً مانند قبل نمایش داده می‌شود */}
    </div>
  )
}

// 2. UI اختصاصی PWA / App
function PWAAppHome() {
  const [activeTab, setActiveTab] = useState<TabType>('home')
  const [studentData, setStudentData] = useState({
    name: 'دانش‌آموز',
    rank: 12,
    totalParticipants: 2450,
    progressPercentage: 60,
  })

  // فراخوانی APIها و Session فعلی پروژه برای جایگزینی داده‌های واقعی
  useEffect(() => {
    async function fetchUserData() {
      try {
        // مثال: فراخوانی API فعلی کاربر/پروفایل
        // const res = await fetch('/api/user/profile')
        // const data = await res.json()
        // if (data?.name) setStudentData(prev => ({ ...prev, name: data.name }))
      } catch (error) {
        console.error('Error fetching PWA user data:', error)
      }
    }
    fetchUserData()
  }, [])

  return (
    <AppHome
      header={
        <AppHeader
          onNotificationClick={() => console.log('Notification clicked')}
          onMenuClick={() => console.log('Menu clicked')}
        />
      }
      hero={
        <AppHero
          studentName={studentData.name}
          subtitle="هر روز یک قدم به آینده نزدیک‌تر شو."
          buttonText="مشاهده برنامه امروز"
          onActionClick={() => {
            window.location.href = '/dashboard'
          }}
        />
      }
      quickActions={
        <AppQuickActions
          onActionClick={(id) => {
            if (id === 'quizzes') window.location.href = '/quizzes'
            if (id === 'league') window.location.href = '/league'
            if (id === 'courses') window.location.href = '/courses'
            if (id === 'goftino') window.location.href = '/chat'
          }}
        />
      }
      leagueCard={
        <AppLeagueCard
          rank={studentData.rank}
          totalParticipants={studentData.totalParticipants}
          progressPercentage={studentData.progressPercentage}
          onViewLeaderboard={() => {
            window.location.href = '/league'
          }}
        />
      }
      quickAccess={
        <AppQuickAccess
          onItemClick={(id) => {
            if (id === 'honors') window.location.href = '/profile/honors'
            if (id === 'notes') window.location.href = '/notes'
            if (id === 'calendar') window.location.href = '/events'
            if (id === 'videos') window.location.href = '/videos'
          }}
        />
      }
      bottomNav={
        <AppBottomNav
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab)
            if (tab === 'quizzes') window.location.href = '/quizzes'
            if (tab === 'league') window.location.href = '/league'
            if (tab === 'courses') window.location.href = '/courses'
            if (tab === 'profile') window.location.href = '/profile'
          }}
        />
      }
    />
  )
}

export default function HomePage() {
  return (
    <AppShell
      websiteUI={<ExistingWebsiteHome />}
      appUI={<PWAAppHome />}
    />
  )
}