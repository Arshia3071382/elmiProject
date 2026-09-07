'use client'

import { useState, useEffect } from 'react'

export function useIsPWA() {
  const [isPWA, setIsPWA] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    const checkPWA = () => {
      // 1. بررسی استاندارد display-mode
      const isStandaloneMatch = window.matchMedia('(display-mode: standalone)').matches

      // 2. بررسی مخصوص iOS Safari
      const isIOSStandalone =
        (window.navigator as unknown as { standalone?: boolean }).standalone === true

      // 3. بررسی URL Query (برای اطمینان ۱۰۰٪ در آیفون)
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