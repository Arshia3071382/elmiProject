"use client";

import PasswordInput from "./PasswordInput";

interface CredentialsTabProps {
  form: {
    oldUsername: string;
    oldPassword: string;
    newUsername: string;
    newPassword: string;
  };
  loading: boolean;
  message: { text: string; type: string };
  showOld: boolean;
  showNew: boolean;
  onToggleOld: () => void;
  onToggleNew: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function CredentialsTab({
  form,
  loading,
  message,
  showOld,
  showNew,
  onToggleOld,
  onToggleNew,
  onChange,
  onSubmit,
}: CredentialsTabProps) {
  return (
    <div>
      <h2 className="text-base font-black text-gray-900 mb-3 text-right">
        تغییر نام کاربری و رمز ورود ادمین
      </h2>

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
          <label className="block text-xs font-bold text-gray-700 mb-1">نام کاربری فعلی</label>
          <input
            type="text"
            name="oldUsername"
            value={form.oldUsername}
            onChange={onChange}
            required
            className="w-full px-3 py-2 text-sm border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500"
            placeholder="نام کاربری فعلی"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">رمز عبور فعلی</label>
          <PasswordInput
            name="oldPassword"
            value={form.oldPassword}
            onChange={onChange}
            show={showOld}
            onToggle={onToggleOld}
            placeholder="••••••••"
            required
            className="bg-gray-50"
          />
        </div>

        <hr className="my-1 border-gray-100" />

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">نام کاربری جدید</label>
          <input
            type="text"
            name="newUsername"
            value={form.newUsername}
            onChange={onChange}
            required
            className="w-full px-3 py-2 text-sm border rounded-xl focus:ring-2 focus:ring-blue-500"
            placeholder="نام کاربری جدید"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            رمز عبور جدید (۶ تا ۸ کاراکتر)
          </label>
          <PasswordInput
            name="newPassword"
            value={form.newPassword}
            onChange={onChange}
            show={showNew}
            onToggle={onToggleNew}
            placeholder="رمز جدید"
            maxLength={8}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold text-sm transition cursor-pointer mt-2"
        >
          {loading ? "در حال ذخیره..." : "ثبت تغییرات حساب"}
        </button>
      </form>
    </div>
  );
}