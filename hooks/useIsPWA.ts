'use client'

import { useState, useEffect } from 'react'

export function useIsPWA() {
  const [isPWA, setIsPWA] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    const checkPWA = () => {
      // ۱. بررسی دقیق حالت standalone واقعی مرورگرها
      const isStandaloneMatch = window.matchMedia('(display-mode: standalone)').matches

      // ۲. بررسی مخصوص iOS فقط زمان اجرا از Home Screen (وقتی بارگذاری در iOS WebApp است)
      const isIOSStandalone =
        (window.navigator as unknown as { standalone?: boolean }).standalone === true

      // فقط اگر یکی از شروط بالا برقراری واقعی در حالت آیکون نصب شده بود:
      setIsPWA(isStandaloneMatch || isIOSStandalone)
    }

    checkPWA()

    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    const handleChange = (e: MediaQueryListEvent) => {
      setIsPWA(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return { isPWA, isMounted }
}