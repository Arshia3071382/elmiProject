'use client'

import React from 'react'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div dir="rtl" className="flex flex-col min-h-screen text-right">
      <main className="flex-grow w-full overflow-x-hidden antialiased text-right dir-rtl font-sans">
        {children}
      </main>
    </div>
  )
}