"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MessageCircle, Trophy, BookOpen } from "lucide-react";

const DOCK_ITEMS = [
  {
    id: "chat",
    label: "گفتینو",
    href: "/chat-guidance",
    icon: MessageCircle,
    bgGradient: "from-blue-600 to-indigo-600",
    border: "border-blue-400/40",
    glow: "rgba(37, 99, 235, 0.6)",
    iconColor: "text-white",
  },
  {
    id: "league",
    label: "لیگ نخبگان",
    href: "/elite-league",
    icon: Trophy,
    bgGradient: "from-amber-500 to-amber-400",
    border: "border-amber-300/50",
    glow: "rgba(245, 158, 11, 0.6)",
    iconColor: "text-slate-950",
  },
  {
    id: "courses",
    label: "دوره‌ها",
    href: "/courses",
    icon: BookOpen,
    bgGradient: "from-white to-slate-50",
    border: "border-slate-200",
    glow: "rgba(148, 163, 184, 0.5)",
    iconColor: "text-slate-700",
  },
];

export default function FloatingActionDock() {
  const pathname = usePathname();

  return (
    <div className="relative z-30 mt-3.5 flex justify-center pb-2">
      {/* جعبه فرورفته اصلی */}
      <div className="relative flex items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-slate-200/60 p-2 backdrop-blur-2xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.08),0_1px_0_rgba(255,255,255,0.8)]">
        {DOCK_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.id} href={item.href} className="relative">
              <motion.div
                whileTap={{ scale: 1.15 }}
                whileHover={{ scale: 1.08 }}
                className={`relative z-10 flex items-center justify-center sm:gap-2 p-2.5 sm:px-3.5 rounded-xl border bg-gradient-to-tr transition-all duration-300 ${
                  item.bgGradient
                } ${item.border} ${
                  isActive
                    ? "scale-110 shadow-xl ring-2 ring-white z-20"
                    : "opacity-80 hover:opacity-100 scale-100"
                }`}
                style={{
                  boxShadow: isActive
                    ? `0 10px 25px -4px ${item.glow}, 0 4px 6px -2px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)`
                    : "0 1px 2px rgba(0,0,0,0.04)",
                }}
              >
                <Icon className={`h-5 w-5 shrink-0 ${item.iconColor}`} />
                {/* متن فقط در سایز sm به بالا نمایش داده می‌شود و در موبایل مخفی است */}
                <span
                  className={`text-xs font-bold ${item.iconColor} hidden sm:inline-block`}
                >
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}