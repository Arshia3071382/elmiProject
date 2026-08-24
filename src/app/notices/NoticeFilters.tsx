// Filters component
"use client";

import { useState } from "react";
import { Search, X, Filter, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { typeConfig, typeOptions, dateOptions } from "./constants";

interface NoticeFiltersProps {
  searchQuery: string;
  selectedType: string;
  dateFilter: string;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onClear: () => void;
}

export default function NoticeFilters({
  searchQuery,
  selectedType,
  dateFilter,
  onSearchChange,
  onTypeChange,
  onDateChange,
  onClear,
}: NoticeFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = searchQuery || selectedType !== "all" || dateFilter !== "all";

  return (
    <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-border)] p-4 md:p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search input */}
        <div className="flex-1 relative">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-secondary)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="جستجو در عنوان و متن اعلان‌ها..."
            className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl py-3 pr-11 pl-4 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/20 transition-all"
            style={{ fontFamily: "iranSans-r" }}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]/40 transition-colors ${
              showFilters ? "border-[var(--color-secondary)] text-[var(--color-secondary)]" : ""
            }`}
            style={{ fontFamily: "iranSans-r" }}
          >
            <Filter className="h-4 w-4" />
            فیلترها
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>

          {hasActiveFilters && (
            <button
              onClick={onClear}
              className="flex items-center justify-center gap-1.5 px-3.5 py-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 hover:bg-red-100 transition-colors whitespace-nowrap"
              style={{ fontFamily: "iranSans-r" }}
            >
              <X className="h-4 w-4" />
              پاک‌سازی
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[var(--color-border)]">
              {/* Type filter */}
              <div>
                <label
                  className="block text-xs font-bold text-[var(--color-text-primary)] mb-2"
                  style={{ fontFamily: "iranBold" }}
                >
                  نوع اعلان
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {typeOptions.map((type) => {
                    const config = type !== "all" ? typeConfig[type as keyof typeof typeConfig] : null;
                    const isSelected = selectedType === type;
                    return (
                      <button
                        key={type}
                        onClick={() => onTypeChange(type)}
                        className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                          isSelected
                            ? "bg-[var(--color-primary)] text-white shadow-sm font-bold"
                            : "bg-[var(--color-bg)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]/50"
                        }`}
                        style={{ fontFamily: "iranSans-r" }}
                      >
                        {type === "all" ? "همه موارد" : config?.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date filter */}
              <div>
                <label
                  className="block text-xs font-bold text-[var(--color-text-primary)] mb-2"
                  style={{ fontFamily: "iranBold" }}
                >
                  بازه زمانی
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {dateOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => onDateChange(option.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                        dateFilter === option.value
                          ? "bg-[var(--color-primary)] text-white shadow-sm font-bold"
                          : "bg-[var(--color-bg)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]/50"
                      }`}
                      style={{ fontFamily: "iranSans-r" }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}