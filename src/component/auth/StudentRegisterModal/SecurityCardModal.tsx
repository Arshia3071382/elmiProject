// components/auth/StudentRegisterModal/SecurityCardModal.tsx
"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Download, Loader2, AlertTriangle } from "lucide-react";

interface SecurityCardModalProps {
  data: {
    fullName: string;
    question: string;
    answer: string;
    nationalId: string;
  };
  onConfirm: () => void;
}

export const SecurityCardModal = ({ data, onConfirm }: SecurityCardModalProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleSaveImage = () => {
    if (!cardRef.current) return;
    setIsDownloading(true);

    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 420;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 600, 420);
      gradient.addColorStop(0, "#0f172a");
      gradient.addColorStop(0.5, "#1e293b");
      gradient.addColorStop(1, "#0f172a");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const borderPadding = 20;
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 4;
      ctx.strokeRect(borderPadding, borderPadding, canvas.width - borderPadding * 2, canvas.height - borderPadding * 2);

      ctx.strokeStyle = "rgba(16, 185, 129, 0.3)";
      ctx.lineWidth = 1;
      ctx.strokeRect(borderPadding + 8, borderPadding + 8, canvas.width - borderPadding * 2 - 16, canvas.height - borderPadding * 2 - 16);

      ctx.fillStyle = "#10b981";
      ctx.font = "bold 24px Tahoma, sans-serif";
      ctx.direction = "rtl";
      ctx.textAlign = "right";
      ctx.fillText("🛡️ کارت اطلاعات امنیتی", 560, 55);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "13px Tahoma, sans-serif";
      ctx.fillText("این اطلاعات برای بازیابی حساب کاربری شما ضروری است", 560, 80);

      ctx.strokeStyle = "rgba(148, 163, 184, 0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(40, 95);
      ctx.lineTo(560, 95);
      ctx.stroke();

      ctx.fillStyle = "#e2e8f0";
      ctx.font = "16px Tahoma, sans-serif";
      ctx.fillText(`نام و نام خانوادگی: ${data.fullName}`, 560, 135);
      ctx.fillText(`کد ملی: ${data.nationalId}`, 560, 175);

      ctx.fillStyle = "#10b981";
      ctx.font = "bold 16px Tahoma, sans-serif";
      ctx.fillText(`سوال امنیتی: ${data.question}`, 560, 235);

      ctx.fillStyle = "#f59e0b";
      ctx.font = "bold 20px Tahoma, sans-serif";
      ctx.fillText(`🔑 کلمه شخصی: ${data.answer}`, 560, 285);

      ctx.fillStyle = "#ef4444";
      ctx.font = "13px Tahoma, sans-serif";
      ctx.fillText("⚠️ این کارت را در جای امن نگهداری کنید.", 560, 335);

      ctx.fillStyle = "rgba(148, 163, 184, 0.3)";
      ctx.font = "11px Tahoma, sans-serif";
      ctx.fillText("تاریخ ایجاد: " + new Date().toLocaleDateString("fa-IR"), 560, 385);

      const imageURI = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `Security-Card-${data.nationalId}.png`;
      link.href = imageURI;
      link.click();
    }
    setIsDownloading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md" dir="rtl">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white"
      >
        <div className="text-center mb-4">
          <ShieldCheck className="w-14 h-14 text-emerald-400 mx-auto mb-2 animate-pulse" />
          <h3 className="text-xl font-bold font-[iranBold] text-emerald-400">
            اطلاعات امنیتی حساب شما
          </h3>
          <p className="text-xs text-slate-300 mt-1 font-[iranSans-r]">
            لطفاً این اطلاعات را در جای امن نگهداری کنید
          </p>
        </div>

        <div
          ref={cardRef}
          className="bg-slate-800/90 border border-emerald-500/30 rounded-2xl p-5 my-4 space-y-3 font-[iranSans-r] text-sm"
        >
          <div className="flex justify-between border-b border-slate-700/50 pb-2">
            <span className="text-slate-400">دانش‌آموز:</span>
            <span className="font-bold text-slate-200">{data.fullName}</span>
          </div>
          <div className="flex justify-between border-b border-slate-700/50 pb-2">
            <span className="text-slate-400">سوال امنیتی:</span>
            <span className="font-bold text-emerald-400 text-xs">{data.question}</span>
          </div>
          <div className="flex justify-between bg-slate-700/30 rounded-xl p-3 border border-amber-500/20">
            <span className="text-slate-400">کلمه شخصی:</span>
            <span className="font-extrabold text-amber-400 tracking-wider text-base">{data.answer}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-red-400 font-bold pt-1">
            <AlertTriangle className="w-4 h-4" />
            <span>حتماً اسکرین‌شات بگیرید و در حفظ و نگهداری آن کوشا باشید!</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-5">
          <motion.button
            type="button"
            onClick={handleSaveImage}
            disabled={isDownloading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all font-[iranBold] disabled:opacity-50"
          >
            {isDownloading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            {isDownloading ? "در حال ذخیره..." : "ذخیره تصویر کارت در گالری"}
          </motion.button>

          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition-all font-[iranBold] mt-1"
          >
            اسکرین‌شات گرفتم / ورود به پنل
          </button>
        </div>
      </motion.div>
    </div>
  );
};