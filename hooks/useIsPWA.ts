'use client'

import { useState, useEffect } from 'react'

export function useIsPWA() {
  const [isPWA, setIsPWA] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    const checkPWA = () => {
      // ۱. بررسی حالت Standalone مرورگر کروم اندروید و آیفون
      const isStandaloneMatch = window.matchMedia('(display-mode: standalone)').matches
      
      // ۲. بررسی مخصوص iOS
      const isIOSStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true
      
      // ۳. بررسی Query Parameter جهت اطمینان ۱۰۰ درصدی در اندروید
      const isUrlPWA = window.location.search.includes('mode=pwa') || document.referrer.includes('android-app://')

      setIsPWA(isStandaloneMatch || isIOSStandalone || isUrlPWA)
    }

    checkPWA()

    // ثبت Service Worker برای اندروید (الزامی برای شناسایی کامل PWA در کروم)
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