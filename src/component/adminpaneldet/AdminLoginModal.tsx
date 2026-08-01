import React, { useState } from "react";
import { ShieldCheck, Lock, User, AlertCircle } from "lucide-react";

export default function AdminLoginModal({
  onLoginSuccess,
}: {
  onLoginSuccess: () => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }).then((r) => r.json());

      if (res?.success) {
        onLoginSuccess();
      } else {
        setError(res?.error || "نام کاربری یا رمز عبور اشتباه است");
      }
    } catch {
      setError("خطا در برقراری ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-white flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-2xl mb-2">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-gray-800">
            ورود به پنل مدیریت
          </h2>
          <p className="text-xs text-gray-400">
            نام کاربری و رمز عبور خود را وارد کنید (در صورت ورود بار اول، حساب
            ساخته می‌شود)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ورودی نام کاربری */}
          <div className="relative">
            <User className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              required
              placeholder="نام کاربری"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-200 rounded-xl pr-11 pl-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 text-gray-800"
            />
          </div>

          {/* ورودی رمز عبور */}
          <div className="relative">
            <Lock className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="password"
              required
              placeholder="رمز عبور ادمین"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl pr-11 pl-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 text-gray-800"
            />
          </div>

          {/* نمایش خطا */}
          {error && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* دکمه ارسال */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-3.5 rounded-xl shadow-lg transition disabled:opacity-50 text-sm"
          >
            {loading ? "در حال تایید..." : "ورود به مدیریت"}
          </button>
        </form>
      </div>
    </div>
  );
}
