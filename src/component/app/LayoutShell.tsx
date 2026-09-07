'use client'

import React from 'react'
import Navbar from '@/component/Navbar'
import Footer from '@/component/Footer'
import { useIsPWA } from './../../../hooks/useIsPWA'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const { isPWA, isMounted } = useIsPWA()

  // در حالت PWA/Standalone وب‌سایت نباید هیچ Navbar و Footerی داشته باشد
  if (isMounted && isPWA) {
    return (
      <main className="flex-grow w-full min-h-screen bg-slate-50">
        {children}
      </main>
    )
  }

  // در حالت مرورگر عادی، Navbar و Footer وب‌سایت نمایش داده می‌شوند
  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  )
}