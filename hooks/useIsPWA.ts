'use client'

import { useState, useEffect } from 'react'

export function useIsPWA(): { isPWA: boolean; isMounted: boolean } {
  const [isPWA, setIsPWA] = useState<boolean>(false)
  const [isMounted, setIsMounted] = useState<boolean>(false)

  useEffect(() => {
    setIsMounted(true)

    const checkPWA = () => {
      // 1. Check standard display-mode: standalone
      const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches

      // 2. Check iOS Safari specific standalone flag
      const isIOSStandalone =
        (window.navigator as unknown as { standalone?: boolean }).standalone === true

      // 3. Check document referrer fallback (Android TWA / Launchers)
      const isReferrerStandalone = document.referrer.includes('android-app://')

      return isStandaloneMedia || isIOSStandalone || isReferrerStandalone
    }

    setIsPWA(checkPWA())

    // Listen to changes in display-mode (e.g. dynamic state changes)
    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    const handleChange = (e: MediaQueryListEvent) => {
      setIsPWA(e.matches)
    }

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
    } else {
      mediaQuery.addListener(handleChange)
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange)
      } else {
        mediaQuery.removeListener(handleChange)
      }
    }
  }, [])

  return { isPWA, isMounted }
}