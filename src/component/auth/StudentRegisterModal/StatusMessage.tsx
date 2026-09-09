// components/auth/StudentRegisterModal/StatusMessage.tsx
"use client";

import { CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface StatusMessageProps {
  type: "success" | "error";
  message: string;
}

export const StatusMessage = ({ type, message }: StatusMessageProps) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`p-4 rounded-2xl flex items-center gap-3 shadow-sm mt-4 ${
      type === "error" 
        ? "bg-red-50 border border-red-200 text-red-800" 
        : "bg-emerald-50 border border-emerald-200 text-emerald-800"
    }`}
  >
    {type === "error" ? (
      <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
    ) : (
      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
    )}
    <span className="text-xs sm:text-sm font-bold font-[iranSans-r]">{message}</span>
  </motion.div>
);