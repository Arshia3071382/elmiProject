'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppHome from '@/component/app/AppHome'
import AppHeader from '@/component/app/AppHeader'
import AppCountdownBanner from '@/component/app/AppCountdownBanner'
import AppQuickActions from '@/component/app/AppQuickActions'
import AppLeagueCard from '@/component/app/AppLeagueCard'
import AppQuickAccess from '@/component/app/AppQuickAccess'
import AppBottomNav, { TabType } from '@/component/app/AppBottomNav'
import AppPreloader from '@/component/app/AppPreloader'
import StudentLoginModal from '@/component/auth/StudentLoginModal'

// تابع محاسبه مدال و تصویر دقیقاً مطابق پنل و امتیاز کل دانش‌آموز
const getScientificBadgeInfo = (score: number) => {
  if (score <= 500) return { title: "باید بیشتر تلاش کنی", imageUrl: "/image/hero11.png" };
  if (score <= 2500) return { title: "شهید رضایی نژاد", imageUrl: "/image/levels/le1.png" };
  if (score <= 5000) return { title: "شهید علیمحمدی", imageUrl: "/image/levels/le2.png" };
  if (score <= 7500) return { title: "شهید احمدی روشن", imageUrl: "/image/levels/le3.png" };
  if (score <= 10000) return { title: "شهید شهریاری", imageUrl: "/image/levels/le4.png" };
  if (score <= 12500) return { title: "شهید طهرانی مقدم", imageUrl: "/image/levels/le5.png" };
  return { title: "شهید فخری زاده", imageUrl: "/image/levels/le6.png" };
};

export default function AppPreviewPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('home')
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  // اجبار به اجرای پریلودر در هر بار رفرش یا ورود جدید به صفحه
  const [showPreloader, setShowPreloader] = useState(true)

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [studentData, setStudentData] = useState({
    name: 'دانش‌آموز',
    inEliteLeague: false,
    eliteRank: 0,
    eliteTotal: 50,
    basicRank: 1,
    basicTotal: 30,
    medalImageUrl: '/image/hero11.png',
    medalTitle: 'باید بیشتر تلاش کنی',
  })

  // تابع کمکی برای ریست کردن کامل اطلاعات در حالت خروج
  const handleLoggedOutState = () => {
    setIsLoggedIn(false)
    setStudentData({
      name: 'دانش‌آموز',
      inEliteLeague: false,
      eliteRank: 0,
      eliteTotal: 50,
      basicRank: 1,
      basicTotal: 30,
      medalImageUrl: '/image/hero11.png',
      medalTitle: 'باید بیشتر تلاش کنی',
    })
  }

  const fetchUserData = async () => {
    try {
      // استفاده از هدرهای ضدکش (No-Store) برای جلوگیری از ماندگاری دیتا در سافاری آیفون
      const res = await fetch('/api/student/dashboard', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      })

      if (res.ok) {
        const json = await res.json()
        if (json?.success && json?.data) {
          const { profile, gradeLeague, eliteLeague } = json.data
          setIsLoggedIn(true)

          const name = profile?.name || 'دانش‌آموز'
          const totalScore = profile?.totalScore || 0
          
          const badgeInfo = getScientificBadgeInfo(totalScore)

          const basicRank = gradeLeague?.rank || 1
          const basicTotal = gradeLeague?.totalStudents || 30
          
          const inEliteLeague = Boolean(eliteLeague && eliteLeague.rank > 0)
          const eliteRank = eliteLeague?.rank || 0
          const eliteTotal = eliteLeague?.totalStudents || 50

          setStudentData({
            name,
            inEliteLeague,
            eliteRank,
            eliteTotal,
            basicRank,
            basicTotal,
            medalImageUrl: badgeInfo.imageUrl,
            medalTitle: badgeInfo.title,
          })
        } else {
          handleLoggedOutState()
        }
      } else {
        handleLoggedOutState()
      }
    } catch (error) {
      console.error('Error fetching preview student data:', error)
      handleLoggedOutState()
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false)
    setIsLoggedIn(true)
    fetchUserData()
    router.refresh()
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/student/logout', { 
        method: 'POST',
        credentials: 'include' 
      })
    } catch (error) {
      console.error('Error logging out:', error)
    }
    
    const keysToRemove = [
      "studentPhone", "studentNationalId", "studentName", 
      "studentToken", "token", "studentInEliteLeague", 
      "studentEliteRank", "studentEliteTotal", "studentBasicRank", 
      "studentBasicTotal", "studentMedalImageUrl", "studentMedalTitle",
      "pwa_preloader_seen"
    ]
    keysToRemove.forEach(key => localStorage.removeItem(key))

    // ریست فوری استیت‌ها و نمایش مجدد پریلودر هنگام خروج
    handleLoggedOutState()
    setShowPreloader(true)
    router.refresh()
  }

  const handlePreloaderComplete = () => {
    setShowPreloader(false)
  }

  return (
    <>
      {showPreloader && (
        <AppPreloader
          duration={3000}
          onComplete={handlePreloaderComplete}
        />
      )}

      <StudentLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false)
          router.push('/auth/register')
        }}
      />

      <div className="fixed inset-0 z-[9999] bg-slate-900 py-0 sm:py-8 flex justify-center items-center overflow-hidden">
        <div className="w-full max-w-md bg-white h-full sm:h-[844px] sm:max-h-[90vh] sm:rounded-[40px] shadow-2xl overflow-y-auto relative border-0 sm:border-[8px] sm:border-slate-800 scrollbar-none dir-rtl">
          <AppHome
            header={
              !showPreloader ? (
                <AppHeader
                  isLoggedIn={isLoggedIn}
                  studentName={studentData.name}
                  onLogout={handleLogout}
                  onOpenLoginModal={() => setIsLoginModalOpen(true)}
                />
              ) : null
            }
            quickActions={
              <div className="space-y-3 pt-1 -mt-1">
                <AppCountdownBanner
                  targetDate="2027-05-22T00:00:00+03:30"
                  targetUrl="/elite-league"
                  imageSrc="/image/appHero.jpg"
                />

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
                isLoggedIn={isLoggedIn}
                inEliteLeague={studentData.inEliteLeague}
                eliteRank={studentData.eliteRank}
                eliteTotal={studentData.eliteTotal}
                basicRank={studentData.basicRank}
                basicTotal={studentData.basicTotal}
                medalImageUrl={studentData.medalImageUrl}
                medalTitle={studentData.medalTitle}
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
              !showPreloader ? (
                <AppBottomNav
                  activeTab={activeTab}
                  onTabChange={(tab) => {
                    setActiveTab(tab)
                    if (tab === 'home') router.push('/')
                    if (tab === 'news') router.push('/news')
                    if (tab === 'about') router.push('/aboutUs')
                    if (tab === 'contact') router.push('/contactUs')
                    if (tab === 'login') {
                      if (!isLoggedIn) {
                        setIsLoginModalOpen(true)
                      } else {
                        router.push('/student/dashboard')
                      }
                    }
                  }}
                />
              ) : null
            }
          />
        </div>
      </div>
    </>
  )
}