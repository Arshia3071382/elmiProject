"use client";

import React from "react";
import ConferenceDeck from "@/component/conference/ConferenceDeck";

export default function ConferencePage() {
  return (
    <main dir="rtl" className="w-screen h-screen bg-slate-950 text-white overflow-hidden p-4 md:p-8 select-none relative flex flex-col justify-between">
      {/* هاله پس‌زمینه همایش */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      <ConferenceDeck />
    </main>
  );
}