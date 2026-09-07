'use client'

import { useState, useEffect } from 'react'

export function useIsPWA() {
  const [isPWA, setIsPWA] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    const checkPWA = () => {
      // ۱. بررسی حالت Standalone مرورگر کروم و سافاری
      const isStandaloneMatch = window.matchMedia('(display-mode: standalone)').matches

      // ۲. بررسی مخصوص iOS
      const isIOSStandalone =
        (window.navigator as unknown as { standalone?: boolean }).standalone === true

      // ۳. بررسی TWA / Android WebAPK Referrer
      const isAndroidApp = document.referrer.includes('android-app://')

      // ۴. بررسی URL Query Parameter
      const isUrlPWA = window.location.search.includes('mode=pwa')

      setIsPWA(isStandaloneMatch || isIOSStandalone || isAndroidApp || isUrlPWA)
    }

    checkPWA()

    // ثبت Service Worker برای مرورگر اندروید
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.log('SW registration error:', err)
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