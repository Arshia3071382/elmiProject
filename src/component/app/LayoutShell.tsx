'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Navbar from '@/component/Navbar'
import Footer from '@/component/Footer'
import { useIsPWA } from './../../../hooks/useIsPWA'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isPWA, isMounted } = useIsPWA()
  
  // بررسی وضعیت پریلودر فقط برای نسخه وب عادی
  const [hasSeenPreloader, setHasSeenPreloader] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !!sessionStorage.getItem('hasSeenPreloader')
    }
    return false
  })

  useEffect(() => {
    const handlePreloaderComplete = () => setHasSeenPreloader(true)
    window.addEventListener('preloaderComplete', handlePreloaderComplete)

    return () => {
      window.removeEventListener('preloaderComplete', handlePreloaderComplete)
    }
  }, [])

  const isAdminRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/senior-admin')
  const isHomePage = pathname === '/'

  // در حالت PWA کلاً کاری به پریلودر سایت نداریم
  const isWebsitePreloaderActive = !isPWA && isHomePage && !hasSeenPreloader

  // اگر PWA باشد، مسیر ادادمین باشد، یا پریلودر وب فعال باشد، هدر و فوتر وب رندر نمیشوند
  const isHideLayout = isAdminRoute || (isMounted && isPWA) || isWebsitePreloaderActive

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