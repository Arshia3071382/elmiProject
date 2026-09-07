'use client'

import React from 'react'

interface AppHomeProps {
  header?: React.ReactNode
  hero?: React.ReactNode
  quickActions?: React.ReactNode
  leagueCard?: React.ReactNode
  quickAccess?: React.ReactNode
  bottomNav?: React.ReactNode
}

export default function AppHome({
  header,
  hero,
  quickActions,
  leagueCard,
  quickAccess,
  bottomNav,
}: AppHomeProps) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-24 select-none">
      {/* Header Sticky */}
      {header && <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100">{header}</header>}

      {/* Main Content Area */}
      <main className="flex-1 px-4 pt-4 space-y-5">
        {hero && <section className="w-full">{hero}</section>}
        {quickActions && <section className="w-full">{quickActions}</section>}
        {leagueCard && <section className="w-full">{leagueCard}</section>}
        {quickAccess && <section className="w-full">{quickAccess}</section>}
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