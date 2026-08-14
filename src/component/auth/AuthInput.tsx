"use client";

import React, { InputHTMLAttributes, ReactNode } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
  hint?: string;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  label,
  error,
  icon,
  rightElement,
  hint,
  id,
  ...props
}) => {
  const inputId = id || label;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={inputId} className="text-sm font-medium text-slate-800">
        {label}
      </label>
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute right-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          {...props}
          className={`w-full bg-white/70 backdrop-blur-sm border rounded-xl py-2.5 px-4 text-slate-800 placeholder:text-slate-400 text-sm transition-all outline-none 
            ${icon ? "pr-11" : "pr-4"} 
            ${rightElement ? "pl-11" : "pl-4"}
            ${
              error
                ? "border-red-400 focus:ring-2 focus:ring-red-100"
                : "border-slate-200/80 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            }
            ${props.disabled ? "opacity-60 cursor-not-allowed bg-slate-100" : ""}
          `}
        />
        {rightElement && (
          <span className="absolute left-3.5 flex items-center justify-center">
            {rightElement}
          </span>
        )}
      </div>
      {hint && !error && <span className="text-xs text-slate-500">{hint}</span>}
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
  );
};