'use client'

import React from 'react'

export interface AppHomeProps {
  header?: React.ReactNode
  hero?: React.ReactNode
  banner?: React.ReactNode
  quickActions?: React.ReactNode
  leagueCard?: React.ReactNode
  quickAccess?: React.ReactNode
  bottomNav?: React.ReactNode
  children?: React.ReactNode
}

export default function AppHome({
  header,
  hero,
  banner,
  quickActions,
  leagueCard,
  quickAccess,
  bottomNav,
  children,
}: AppHomeProps) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-24 select-none dir-rtl">
      {/* Header Sticky */}
      {header && (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
          {header}
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 px-4 pt-4 space-y-5">
        {hero && <section className="w-full">{hero}</section>}
        
        {/* بخش اختصاصی بنر شمارش معکوس */}
        {banner && <section className="w-full">{banner}</section>}
        
        {/* اکشن‌های سریع */}
        {quickActions && <section className="w-full">{quickActions}</section>}
        
        {/* کارت وضعیت لیگ */}
        {leagueCard && <section className="w-full">{leagueCard}</section>}
        
        {/* دسترسی سریع */}
        {quickAccess && <section className="w-full">{quickAccess}</section>}

        {/* محتوای سفارشی احتمالی */}
        {children && <section className="w-full">{children}</section>}
      </main>

      {/* Fixed Bottom Navigation */}
      {bottomNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto">
          {bottomNav}
        </nav>
      )}
    </div>
  )
}