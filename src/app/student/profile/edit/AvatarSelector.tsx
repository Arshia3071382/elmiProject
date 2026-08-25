"use client";

import { CheckCircle2 } from "lucide-react";

export interface AvatarOption {
  id: string;
  imageUrl: string;
  label: string;
}

interface AvatarSelectorProps {
  avatars: AvatarOption[];
  selectedAvatar: string;
  onSelect: (url: string) => void;
  onPreview: (url: string) => void;
}

export default function AvatarSelector({
  avatars,
  selectedAvatar,
  onSelect,
  onPreview,
}: AvatarSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {avatars.map((avatar) => {
        const isSelected = selectedAvatar === avatar.imageUrl;
        return (
          <div
            key={avatar.id}
            className={`relative flex flex-col items-center justify-between p-3 rounded-2xl transition-all border-2 ${
              isSelected
                ? "border-blue-600 bg-blue-50/60 shadow-md"
                : "border-slate-100 bg-slate-50 hover:bg-slate-100/80"
            }`}
          >
            <div
              onClick={() => onPreview(avatar.imageUrl)}
              className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shadow-sm mb-2 cursor-pointer hover:opacity-90 transition-opacity"
              title="کلیک برای بزرگ‌نمایی"
            >
              <img
                src={avatar.imageUrl}
                alt={avatar.label}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs text-slate-700 font-bold mb-2">
              {avatar.label}
            </span>

            <button
              type="button"
              onClick={() => onSelect(avatar.imageUrl)}
              className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isSelected
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <CheckCircle2
                className={`w-3.5 h-3.5 ${
                  isSelected ? "text-white" : "text-slate-400"
                }`}
              />
              <span>{isSelected ? "انتخاب‌شده" : "انتخاب"}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}