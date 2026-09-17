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

export default function AppPreviewPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('home')
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  // بررسی فوری جهت اجرای تک‌باره پریلودر
  const [showPreloader, setShowPreloader] = useState(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('pwa_preloader_seen')
    }
    return false
  })

  // خواندن آنی وضعیت لاگین از لوکال استوریج در اولین رندر برای جلوگیری از پرش
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      return Boolean(
        localStorage.getItem('studentPhone') || 
        localStorage.getItem('studentNationalId') || 
        localStorage.getItem('studentToken') || 
        localStorage.getItem('token')
      )
    }
    return false
  })

  const [studentData, setStudentData] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('studentName')
      return {
        name: storedName || 'دانش‌آموز',
        inEliteLeague: true,
        eliteRank: 12,
        eliteTotal: 50,
        basicRank: 5,
        basicTotal: 30,
        medalImageUrl: '',
        medalTitle: 'مدال علمی',
      }
    }
    return {
      name: 'دانش‌آموز',
      inEliteLeague: true,
      eliteRank: 12,
      eliteTotal: 50,
      basicRank: 5,
      basicTotal: 30,
      medalImageUrl: '',
      medalTitle: 'مدال علمی',
    }
  })

  // دریافت اطلاعات کامل‌تر از سرور در پس‌زمینه
  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/student/dashboard')
      if (res.ok) {
        const data = await res.json()
        if (data?.student) {
          setIsLoggedIn(true)
          setStudentData({
            name: data.student.name || 'دانش‌آموز',
            inEliteLeague: Boolean(data.student.inEliteLeague),
            eliteRank: data.student.eliteRank || 12,
            eliteTotal: data.student.eliteTotal || 50,
            basicRank: data.student.basicRank || 5,
            basicTotal: data.student.basicTotal || 30,
            medalImageUrl: data.student.medalImageUrl || '',
            medalTitle: data.student.medalTitle || 'مدال علمی',
          })
          if (data.student.name) {
            localStorage.setItem('studentName', data.student.name)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching preview student data:', error)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false)
    setIsLoggedIn(true)
    const storedName = localStorage.getItem('studentName')
    if (storedName) {
      setStudentData(prev => ({ ...prev, name: storedName }))
    }
    fetchUserData()
    router.refresh()
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Error logging out:', error)
    }
    
    localStorage.removeItem("studentPhone")
    localStorage.removeItem("studentNationalId")
    localStorage.removeItem("studentName")
    localStorage.removeItem("studentToken")
    localStorage.removeItem("token")

    setIsLoggedIn(false)
    router.refresh()
  }

  const handlePreloaderComplete = () => {
    localStorage.setItem('pwa_preloader_seen', 'true')
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
              <AppHeader
                isLoggedIn={isLoggedIn}
                studentName={studentData.name}
                onLogout={handleLogout}
                onOpenLoginModal={() => setIsLoginModalOpen(true)}
              />
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
            }
          />
        </div>
      </div>
    </>
  )
}