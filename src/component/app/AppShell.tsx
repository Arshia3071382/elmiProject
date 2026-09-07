'use client'

import React from 'react'
import { useIsPWA } from './../../../hooks/useIsPWA'

interface AppShellProps {
  websiteUI: React.ReactNode
  appUI: React.ReactNode
}

export default function AppShell({ websiteUI, appUI }: AppShellProps) {
  const { isPWA, isMounted } = useIsPWA()

  // تا زمانی که Client-side مونت نشده، برای جلوگیری از FLS و Hydration Error همان websiteUI رندر می‌شود
  if (!isMounted) {
    return <>{websiteUI}</>
  }

  // اگر PWA یا حالت standalone باشد، AppUI رندر می‌شود
  if (isPWA) {
    return <>{appUI}</>
  }

  // در غیر این صورت UI اصلی سایت
  return <>{websiteUI}</>
}