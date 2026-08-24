// Admin menu component
"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { menuItems, MainTab } from "./constants";

interface AdminMenuProps {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
}

export default function AdminMenu({ activeTab, onTabChange }: AdminMenuProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const activeItemTitle = menuItems.find(i => i.id === activeTab)?.label || "انتخاب بخش";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 sm:mt-6">
      {/* Mobile menu */}
      <div className="block lg:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-full flex items-center justify-between bg-white border border-gray-200 px-4 py-3 rounded-2xl shadow-sm font-bold text-gray-800 text-sm cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Menu className="w-5 h-5" />
            </span>
            <span>بخش فعال: <strong className="text-blue-600">{activeItemTitle}</strong></span>
          </div>
          <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">تغییر بخش</span>
        </button>

        {isMobileMenuOpen && (
          <div className="mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl p-2 space-y-1 z-50 relative animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 mb-1">
              <span className="text-xs font-bold text-gray-400">انتخاب بخش مدیریت</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all text-right cursor-pointer ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-500"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop menu */}
      <div className="hidden lg:flex bg-white rounded-2xl shadow-sm border border-gray-100 p-2 items-center gap-1 overflow-x-auto scrollbar-thin">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs xl:text-sm whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-gray-500"}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}