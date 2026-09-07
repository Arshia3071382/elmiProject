'use client'

import { useState, useEffect } from 'react'

export function useIsPWA() {
  const [isPWA, setIsPWA] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    const checkPWA = () => {
      // ۱. بررسی استاندارد display-mode مرورگرها
      const isStandaloneMatch = window.matchMedia('(display-mode: standalone)').matches

      // ۲. بررسی مخصوص iOS Safari هنگام اجرا از Home Screen
      const isIOSStandalone =
        (window.navigator as unknown as { standalone?: boolean }).standalone === true

      // ۳. بررسی پارامتر URL جهت اطمینان کامل
      const isUrlPWA = window.location.search.includes('mode=pwa')

      setIsPWA(isStandaloneMatch || isIOSStandalone || isUrlPWA)
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