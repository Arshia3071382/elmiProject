// components/auth/StudentRegisterModal/NavigationButtons.tsx
"use client";

import React from "react";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

interface NavigationButtonsProps {
  onNext?: () => void;
  onPrev?: () => void;
  showPrev?: boolean;
  showNext?: boolean;
  isNextLoading?: boolean;
  nextLabel?: string;
  nextType?: "button" | "submit";
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onNext,
  onPrev,
  showPrev = true,
  showNext = true,
  isNextLoading = false,
  nextLabel = "ادامه",
  nextType = "button",
}) => {
  return (
    <div className="flex items-center gap-3 pt-4">
      {showPrev && onPrev && (
        <button
          type="button"
          onClick={onPrev}
          className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-gray-200 font-[iranBold]"
        >
          <ArrowRight className="w-4 h-4" />
          مرحله قبل
        </button>
      )}

      {showNext && (
        <button
          type={nextType}
          onClick={nextType === "button" ? onNext : undefined}
          disabled={isNextLoading}
          className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20 font-[iranBold]"
        >
          {isNextLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              {nextLabel}
              <ArrowLeft className="w-4 h-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
};