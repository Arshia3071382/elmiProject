'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Bell, Sparkles, Headset, User, LucideIcon } from 'lucide-react'

export type TabType = 'home' | 'news' | 'about' | 'contact' | 'login'

interface TabItem {
  id: TabType
  label: string
  href: string
  icon: LucideIcon
  isWavePeak?: boolean
}

interface AppBottomNavProps {
  activeTab?: TabType
  onTabChange?: (tab: TabType) => void
}

export default function AppBottomNav({
  activeTab,
  onTabChange,
}: AppBottomNavProps) {
  const pathname = usePathname()

  // ترتیب ۵ تایی از راست به چپ (RTL) - خانه روی موج راست
  const tabs: TabItem[] = [
    { id: 'home', label: 'خانه', href: '/', icon: Home, isWavePeak: true },
    { id: 'news', label: 'اخبار', href: '/news', icon: Bell },
    { id: 'about', label: 'درباره ما', href: '/aboutUs', icon: Sparkles },
    { id: 'contact', label: 'ارتباط با ما', href: '/contactUs', icon: Headset },
    { id: 'login', label: 'ورود', href: '/auth/login', icon: User },
  ]

  const getIsActive = (tab: TabItem) => {
    if (activeTab) return activeTab === tab.id
    if (tab.href === '/') return pathname === '/'
    return pathname.startsWith(tab.href)
  }

  return (
    <div className="fixed bottom-3 left-0 right-0 z-50 pointer-events-none pb-[env(safe-area-inset-bottom)] px-4">
      {/* Container اصلی هم‌عرض کارت‌ها */}
      <div className="max-w-md mx-auto relative dir-rtl">
        
        {/* دکمه دایره‌ای شناور خانه - دقیقاً روی مرکز موج در سمت راست */}
        <div className="absolute -top-4 right-[10%] -translate-x-1/2 z-20 pointer-events-auto">
          {tabs.map((tab) => {
            if (!tab.isWavePeak) return null
            const isActive = getIsActive(tab)
            const Icon = tab.icon

            return (
              <Link
                key={tab.id}
                href={tab.href}
                onClick={() => onTabChange?.(tab.id)}
                className="flex flex-col items-center group focus:outline-none"
              >
                <div className="w-13 h-13 rounded-full bg-white p-1 shadow-lg flex items-center justify-center">
                  <div
                    className={`w-full h-full rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 ${
                      isActive
                        ? 'bg-[#0d52b5] text-white shadow-md shadow-blue-600/30'
                        : 'bg-[#0d52b5] text-white hover:bg-blue-700'
                    }`}
                  >
                    <Icon className="w-5.5 h-5.5 stroke-[2]" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* نوار پس‌زمینه با طراحی موج در راست و ادامه خط صاف به چپ */}
        <div className="relative w-full h-16 pointer-events-auto filter drop-shadow-xl">
          <svg
            className="w-full h-full text-[#0d52b5] fill-current"
            viewBox="0 0 375 64"
            preserveAspectRatio="none"
          >
            {/* 
              مسیر SVG:
              - لبه‌های گرد شناور با انحنای استاندارد
              - قوس موج دقیقاً در منطقه ۱۰٪ تا ۳۰٪ عرض از سمت راست
            */}
            <path d="M 24,14 
                     L 260,14 
                     C 272,14 278,2 295,2 
                     C 312,2 318,14 330,14 
                     L 351,14 
                     A 16,16 0 0 1 367,30 
                     L 367,46 
                     A 16,16 0 0 1 351,62 
                     L 24,62 
                     A 16,16 0 0 1 8,46 
                     L 8,30 
                     A 16,16 0 0 1 24,14 Z" />
          </svg>

          {/* چینش گزینه‌ها روی نوار */}
          <nav className="absolute inset-0 flex items-center justify-between px-3 text-white">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = getIsActive(tab)

              // متن خانه در پایین موج راست
              if (tab.isWavePeak) {
                return (
                  <div key={tab.id} className="w-[20%] flex flex-col items-center justify-end h-full pb-1.5">
                    <span
                      className={`text-[10px] font-bold transition-colors ${
                        isActive ? 'text-white' : 'text-blue-200'
                      }`}
                    >
                      {tab.label}
                    </span>
                  </div>
                )
              }

              // سایر آیتم‌های ۴‌تایی
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  onClick={() => onTabChange?.(tab.id)}
                  className="w-[20%] flex flex-col items-center justify-center h-full pt-1.5 transition-all active:scale-90"
                >
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? 'text-white scale-110 stroke-[2.2]' : 'text-blue-200/80 stroke-[1.75]'
                    }`}
                  />
                  <span
                    className={`text-[10px] mt-0.5 transition-colors ${
                      isActive ? 'text-white font-bold' : 'text-blue-200/80 font-medium'
                    }`}
                  >
                    {tab.label}
                  </span>
                </Link>
              )
            })}
          </nav>
        </div>

      </div>
    </div>
  )
}