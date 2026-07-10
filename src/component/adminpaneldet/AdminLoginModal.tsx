import React, { useState } from "react";
import { ShieldCheck, Lock, AlertCircle } from "lucide-react";

export default function AdminLoginModal({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true); setError("");
    const res = await fetch("/api/admin-login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) }).then(r => r.json()).catch(() => null);
    if (res?.success) onLoginSuccess();
    else setError(res?.error || "رمز عبور وارد شده اشتباه است");
    setLoading(false);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-2xl mb-2"><ShieldCheck className="w-8 h-8" /></div>
          <h2 className="text-2xl font-black text-gray-800">ورود به پنل مدیریت</h2>
          <p className="text-xs text-gray-400">برای دسترسی به تنظیمات سایت، رمز عبور را وارد کنید</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative"><Lock className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" /><input type="password" required placeholder="رمز عبور ادمین" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-200 rounded-xl pr-11 pl-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50" /></div>
          {error && <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100"><AlertCircle className="w-4 h-4 flex-shrink-0" /><span>{error}</span></div>}
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition disabled:opacity-50 text-sm">{loading ? "در حال تایید..." : "ورود به مدیریت"}</button>
        </form>
      </div>
    </div>
  );
}