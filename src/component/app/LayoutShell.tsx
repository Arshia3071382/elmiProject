'use client'

import React, { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Navbar from '@/component/Navbar'
import Footer from '@/component/Footer'
import { useIsPWA } from './../../../hooks/useIsPWA'

// کامپوننت‌های اختصاصی PWA
import AppHeader from '@/component/app/AppHeader'
import AppBottomNav, { TabType } from '@/component/app/AppBottomNav'
import AppPreloader from '@/component/app/AppPreloader'
import StudentLoginModal from '@/component/auth/StudentLoginModal'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isPWA, isMounted } = useIsPWA()
  
  // بررسی وضعیت پریلودر فقط برای نسخه وب عادی
  const [hasSeenPreloader, setHasSeenPreloader] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !!sessionStorage.getItem('hasSeenPreloader')
    }
    return false
  })

  // پریلودر اختصاصی PWA (فقط یک‌بار در طول نشست نمایش داده می‌شود)
  const [showPwaPreloader, setShowPwaPreloader] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('app_preloader_shown_session')
    }
    return true
  })

  // استیت‌های مربوط به لاگین و اطلاعات کاربر در PWA
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      return Boolean(
        localStorage.getItem("studentPhone") || 
        localStorage.getItem("studentNationalId") || 
        localStorage.getItem("studentToken") || 
        localStorage.getItem("token")
      )
    }
    return false
  })

  const [studentName, setStudentName] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("studentName") || "دانش‌آموز"
    }
    return "دانش‌آموز"
  })

  // تشخیص تب فعال بر اساس مسیر فعلی (Pathname) برای نوبار پایین PWA
  const [activeTab, setActiveTab] = useState<TabType>('home')

  useEffect(() => {
    if (pathname === '/') setActiveTab('home')
    else if (pathname?.startsWith('/news')) setActiveTab('news')
    else if (pathname?.startsWith('/aboutUs')) setActiveTab('about')
    else if (pathname?.startsWith('/contactUs')) setActiveTab('contact')
    else if (pathname?.startsWith('/student/dashboard')) setActiveTab('login')
  }, [pathname])

  useEffect(() => {
    const handlePreloaderComplete = () => setHasSeenPreloader(true)
    window.addEventListener('preloaderComplete', handlePreloaderComplete)

    return () => {
      window.removeEventListener('preloaderComplete', handlePreloaderComplete)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/student/logout", { 
        method: "POST",
        credentials: "include" 
      })
    } catch (error) {
      console.error("Error logging out:", error)
    }
    
    const keysToRemove = [
      "studentPhone", "studentNationalId", "studentName", 
      "studentToken", "token", "studentInEliteLeague", 
      "studentEliteRank", "studentEliteTotal", "studentBasicRank", 
      "studentBasicTotal", "studentMedalImageUrl", "studentMedalTitle"
    ]
    keysToRemove.forEach(key => localStorage.removeItem(key))

    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('app_preloader_shown_session')
    }

    setIsLoggedIn(false)
    setStudentName("دانش‌آموز")
    setShowPwaPreloader(true)
    router.refresh()
  }

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false)
    setIsLoggedIn(true)
    setStudentName(localStorage.getItem("studentName") || "دانش‌آموز")
    router.refresh()
  }

  const handlePwaPreloaderComplete = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('app_preloader_shown_session', 'true')
    }
    setShowPwaPreloader(false)
  }

  const isAdminRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/senior-admin')
  const isHomePage = pathname === '/'

  const isWebsitePreloaderActive = !isPWA && isHomePage && !hasSeenPreloader
  const isHideLayout = isAdminRoute || (isMounted && isPWA) || isWebsitePreloaderActive
  const showPWAShell = isMounted && isPWA && !isAdminRoute

  if (showPWAShell) {
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-900 py-0 sm:py-8 flex justify-center items-center overflow-hidden">
        <div className="w-full max-w-md bg-white h-full sm:h-[844px] sm:max-h-[90vh] sm:rounded-[40px] shadow-2xl flex flex-col relative border-0 sm:border-[8px] sm:border-slate-800 overflow-hidden dir-rtl">
          
          {/* پریلودر اختصاصی PWA که به صورت تک‌لایه و کاملاً مسلط اجرا می‌شود */}
          {showPwaPreloader && (
            <AppPreloader duration={3000} onComplete={handlePwaPreloaderComplete} />
          )}

          {/* هدر اپلیکیشن */}
          <div className="flex-shrink-0 z-20 bg-white">
            <AppHeader
              isLoggedIn={isLoggedIn}
              studentName={studentName}
              onLogout={handleLogout}
              onOpenLoginModal={() => setIsLoginModalOpen(true)}
            />
          </div>

          {/* محتوای صفحات */}
          <main className="flex-grow overflow-y-auto w-full antialiased text-right dir-rtl font-sans pb-20 scrollbar-none">
            {children}
          </main>

          {/* نوبار پایین */}
          <div className="absolute bottom-0 left-0 right-0 z-30 bg-white">
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
          </div>

          <StudentLoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onSuccess={handleLoginSuccess}
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={() => {
              setIsLoginModalOpen(false)
              router.push('/auth/register')
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div dir="rtl" className="flex flex-col min-h-screen text-right">
      {!isHideLayout && <Navbar />}
      
      <main className="flex-grow w-full overflow-x-hidden antialiased text-right dir-rtl font-sans">
        {children}
      </main>

      {!isHideLayout && <Footer />}
    </div>
  )
}