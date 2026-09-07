'use client'

import React from 'react'
import { useIsPWA } from './../../../hooks/useIsPWA'

interface AppShellProps {
  websiteUI: React.ReactNode
  appUI: React.ReactNode
}

export default function AppShell({ websiteUI, appUI }: AppShellProps) {
  const { isPWA, isMounted } = useIsPWA()

  // تا زمانی که Client-side مونت نشده، UI اصلی سایت رندر شود
  if (!isMounted) {
    return <>{websiteUI}</>
  }

  // اگر PWA باشد، دقیقاً AppUI رندر می‌شود
  if (isPWA) {
    return <>{appUI}</>
  }

  // در غیر این صورت UI اصلی سایت
  return <>{websiteUI}</>
}