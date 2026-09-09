'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Navbar from '@/component/Navbar'
import Footer from '@/component/Footer'
import { useIsPWA } from './../../../hooks/useIsPWA'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isPWA, isMounted } = useIsPWA()

  // بررسی مسیرهایی که نباید نوبار و فوتر عمومی داشته باشند
  const isAdminRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/senior-admin')
  const isHideLayout = isAdminRoute || (isMounted && isPWA)

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