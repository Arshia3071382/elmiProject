"use client";

import { useState } from "react";

export default function AdminCredentialsForm() {
  const [formData, setFormData] = useState({
    oldUsername: "",
    oldPassword: "",
    newUsername: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("/api/admin/credentials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ text: data.message, type: "success" });
        setFormData({
          oldUsername: "",
          oldPassword: "",
          newUsername: "",
          newPassword: "",
        });
      } else {
        setMessage({ text: data.message || "خطایی رخ داد.", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "خطا در ارتباط با سرور.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-xl font-bold mb-4 text-gray-800">تغییر نام کاربری و رمز عبور ادمین</h2>
      
      {message.text && (
        <div
          className={`p-3 mb-4 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نام کاربری فعلی</label>
          <input
            type="text"
            name="oldUsername"
            value={formData.oldUsername}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">رمز عبور فعلی</label>
          <input
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <hr className="my-2 border-gray-200" />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نام کاربری جدید</label>
          <input
            type="text"
            name="newUsername"
            value={formData.newUsername}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">رمز عبور جدید</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
            placeholder="۶ تا ۸ کاراکتر (حروف بزرگ/کوچک و عدد)"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            باید شامل ۶ الی ۸ کاراکتر، شامل حروف کوچک و بزرگ انگلیسی و عدد باشد.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50"
        >
          {loading ? "در حال ذخیره..." : "به‌روزرسانی اطلاعات"}
        </button>
      </form>
    </div>
  );
}