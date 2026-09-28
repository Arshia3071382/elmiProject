'use client'

import { useState, useEffect } from 'react'

const PREVIEW_KEY = 'pwa_preview_mode'

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

      // ۴. بررسی URL Query Parameter یا صفحه پیش‌نمایش
      const isUrlPWA =
        window.location.search.includes('mode=pwa') ||
        window.location.pathname.startsWith('/app-preview')

      // حالت پیش‌نمایش در همین تب به‌خاطر سپرده می‌شود تا با ناوبری کامل صفحه
      // (مثلاً رفتن به /student/dashboard) از بین نرود
      try {
        if (isUrlPWA) sessionStorage.setItem(PREVIEW_KEY, '1')
      } catch {}

      let isRememberedPreview = false
      try {
        isRememberedPreview = sessionStorage.getItem(PREVIEW_KEY) === '1'
      } catch {}

      setIsPWA(
        isStandaloneMatch ||
          isIOSStandalone ||
          isAndroidApp ||
          isUrlPWA ||
          isRememberedPreview
      )
    }

    checkPWA()

    // ثبت Service Worker برای مرورگر اندروید
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.log('SW registration error:', err)
      })
    }

    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    const handleChange = () => checkPWA()

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return { isPWA, isMounted }
}