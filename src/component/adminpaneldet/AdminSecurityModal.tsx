"use client";

import { useState } from "react";
import { ShieldAlert, Eye, EyeOff, Lock } from "lucide-react";

interface AdminSecurityModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export default function AdminSecurityModal({ isOpen, onSuccess, onClose }: AdminSecurityModalProps) {
  // Internal state — all managed inside this component
  const [securityCode, setSecurityCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/security-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ securityCode }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSecurityCode("");
        setShowCode(false);
        onSuccess();
      } else {
        setErrorMsg(data.message || "خطا در احراز هویت");
      }
    } catch {
      setErrorMsg("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSecurityCode("");
    setShowCode(false);
    setErrorMsg("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white text-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 relative border border-gray-100 text-right">
        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner border border-amber-100">
          <Lock className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-black text-gray-900 text-center mb-1">
          محافظت امنیتی پنل ادمین
        </h3>
        <p className="text-xs text-gray-500 text-center mb-5">
          برای ورود به این بخش حساس، لطفاً کد امنیتی اختصاصی خود را وارد کنید.
        </p>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl text-xs bg-red-50 text-red-700 border border-red-200 flex items-start gap-2 leading-relaxed">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              کد امنیتی ادمین
            </label>
            <div className="relative">
              <input
                type={showCode ? "text" : "password"}
                value={securityCode}
                onChange={(e) => setSecurityCode(e.target.value)}
                required
                maxLength={8}
                className="w-full pl-10 pr-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-mono tracking-widest"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowCode(!showCode)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
              >
                {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl transition font-bold text-sm disabled:opacity-50 shadow-md shadow-blue-500/20 cursor-pointer"
            >
              {loading ? "در حال بررسی..." : "تایید و ورود"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition font-bold text-sm cursor-pointer"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}