'use client'

import React, { ReactNode } from 'react'
import { useIsPWA } from './../../../hooks/useIsPWA'

interface AppShellProps {
  websiteUI: ReactNode
  appUI: ReactNode
}

export default function AppShell({ websiteUI, appUI }: AppShellProps) {
  const { isPWA, isMounted } = useIsPWA()

  // جلوگیری از Hydration Mismatch: تا زمان Mount کامل در کلاینت، UI وب‌سایت رندر می‌شود
  if (!isMounted) {
    return <>{websiteUI}</>
  }

  // اگر کاربر از آیکن Home Screen (Standalone) وارد شده باشد
  if (isPWA) {
    return (
      <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-blue-500 selection:text-white max-w-md mx-auto relative shadow-2xl overflow-x-hidden">
        {appUI}
      </div>
    )
  }

  // در غیر این صورت، UI فعلی وب‌سایت نمایش داده می‌شود
  return <>{websiteUI}</>
}