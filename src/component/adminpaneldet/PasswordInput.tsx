"use client";

import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  show: boolean;
  onToggle: () => void;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  className?: string;
}

export default function PasswordInput({
  value,
  onChange,
  name,
  show,
  onToggle,
  placeholder,
  maxLength,
  required,
  className = "",
}: PasswordInputProps) {
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={maxLength}
        className={`w-full pl-10 pr-3 py-2 text-sm border rounded-xl focus:ring-2 focus:ring-blue-500 ${className}`}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}