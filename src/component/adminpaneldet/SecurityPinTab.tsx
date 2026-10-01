"use client";

import PasswordInput from "./PasswordInput";

interface SecurityPinTabProps {
  form: { oldPin: string; newPin: string; confirmPin: string };
  loading: boolean;
  message: { text: string; type: string };
  showOld: boolean;
  showNew: boolean;
  showConfirm: boolean;
  onToggleOld: () => void;
  onToggleNew: () => void;
  onToggleConfirm: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SecurityPinTab({
  form,
  loading,
  message,
  showOld,
  showNew,
  showConfirm,
  onToggleOld,
  onToggleNew,
  onToggleConfirm,
  onChange,
  onSubmit,
}: SecurityPinTabProps) {
  const inputClass = "font-mono tracking-widest text-center";

  return (
    <div>
      <h2 className="text-base font-black text-gray-900 mb-1 text-right">
        مدیریت کد امنیتی ۸ رقمی تب‌ها
      </h2>
      <p className="text-[11px] text-gray-500 mb-3 text-right">
        برای ورود به بخش‌های حساس، این پین ۸ رقمی عددی الزامی است.
      </p>

      {message.text && (
        <div
          className={`p-3 mb-3 rounded-xl text-xs text-right ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-3 text-right">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            کد امنیتی قبلی (اگر قبلاً تعیین شده)
          </label>
          <PasswordInput
            name="oldPin"
            value={form.oldPin}
            onChange={onChange}
            show={showOld}
            onToggle={onToggleOld}
            maxLength={8}
            placeholder="اختیاری (برای بار اول خالی بگذارید)"
            className={`bg-gray-50 ${inputClass}`}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            کد امنیتی جدید (دقیقاً ۸ رقم عدد)
          </label>
          <PasswordInput
            name="newPin"
            value={form.newPin}
            onChange={onChange}
            show={showNew}
            onToggle={onToggleNew}
            required
            maxLength={8}
            placeholder="12345678"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            تکرار کد امنیتی جدید
          </label>
          <PasswordInput
            name="confirmPin"
            value={form.confirmPin}
            onChange={onChange}
            show={showConfirm}
            onToggle={onToggleConfirm}
            required
            maxLength={8}
            placeholder="12345678"
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-sm transition cursor-pointer mt-2"
        >
          {loading ? "در حال ثبت..." : "ثبت و فعال‌سازی کد امنیتی"}
        </button>
      </form>
    </div>
  );
}