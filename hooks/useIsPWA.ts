'use client'

import { useState, useEffect } from 'react'

export function useIsPWA() {
  const [isPWA, setIsPWA] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    const checkPWA = () => {
      // ۱. بررسی display-mode استاندارد مرورگرها
      const isStandaloneMatch = window.matchMedia('(display-mode: standalone)').matches

      // ۲. بررسی حالت TWA / WebAPK در اندروید
      const isAndroidApp = document.referrer.includes('android-app://')

      // ۳. بررسی مخصوص iOS Safari
      const isIOSStandalone =
        (window.navigator as unknown as { standalone?: boolean }).standalone === true

      // ۴. بررسی URL Query (برای تضمین ۱۰۰ درصدی)
      const isUrlPWA = window.location.search.includes('mode=pwa')

      setIsPWA(isStandaloneMatch || isAndroidApp || isIOSStandalone || isUrlPWA)
    }

    checkPWA()

    // ثبت Service Worker برای اندروید
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.log('SW registration failed:', err)
      })
    }

    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    const handleChange = (e: MediaQueryListEvent) => {
      setIsPWA(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return { isPWA, isMounted }
}