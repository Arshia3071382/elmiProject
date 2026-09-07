'use client'

import React from 'react'
import Navbar from '@/component/Navbar'
import Footer from '@/component/Footer'
import { useIsPWA } from './../../../hooks/useIsPWA'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const { isPWA, isMounted } = useIsPWA()

  // تا قبل از Mount شدن کلاینت، UI عادی وب‌سایت نمایش داده می‌شود
  if (!isMounted || !isPWA) {
    return (
      <>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </>
    )
  }

  // در حالت Standalone (PWA) فقط محتوای اصلی رندر می‌شود (بدون Navbar و Footer وب‌سایت)
  return <main className="flex-grow">{children}</main>
}