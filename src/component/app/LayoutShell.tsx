'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Navbar from '@/component/Navbar'
import Footer from '@/component/Footer'
import { useIsPWA } from './../../../hooks/useIsPWA'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isPWA, isMounted } = useIsPWA()
  
  // بررسی مستقیم وضعیت پریلودر جهت عدم رندر نوبار در لحظه اول
  const [hasSeenPreloader, setHasSeenPreloader] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !!sessionStorage.getItem('hasSeenPreloader')
    }
    return false
  })

  useEffect(() => {
    // گوش دادن به رویداد اتمام پریلودر
    const handlePreloaderDone = () => setHasSeenPreloader(true)
    window.addEventListener('preloaderComplete', handlePreloaderDone)

    return () => {
      window.removeEventListener('preloaderComplete', handlePreloaderDone)
    }
  }, [])

  const isAdminRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/senior-admin')
  const isHomePage = pathname === '/'
  const isPreloaderActive = isHomePage && !hasSeenPreloader

  // اگر PWA باشد، مسیر ادلمین باشد، یا پریلودر هنوز در حال اجرا باشد، هدر رندر نمی‌شود
  const isHideLayout = isAdminRoute || (isMounted && isPWA) || isPreloaderActive

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