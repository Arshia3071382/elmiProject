"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Calendar, 
  Bell, 
  BookOpen, 
  MessageSquare, 
  Save, 
  User, 
  Trophy 
} from "lucide-react";

interface SeniorAdminUser {
  _id: string;
  username: string;
  name?: string;
  permissions: string[];
}

// لیست تمام ماژول‌های موجود در سیستم (شامل لیگ علمی پایه)
const ALL_PERMISSIONS = [
  { id: "calendar", label: "تقویم آموزشی", icon: Calendar, color: "text-blue-600" },
  { id: "notices", label: "اطلاعیه‌ها و اخبار", icon: Bell, color: "text-emerald-600" },
  { id: "courses", label: "دوره‌های آموزشی", icon: BookOpen, color: "text-violet-600" },
  { id: "counseling", label: "اتاق‌های مشاوره", icon: MessageSquare, color: "text-amber-600" },
  { id: "grade_league", label: "لیگ علمی پایه", icon: Trophy, color: "text-yellow-600" },
];

export default function AdminPermissionsManager() {
  const [admins, setAdmins] = useState<SeniorAdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingUsername, setSavingUsername] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // دریافت لیست معین‌ها از سرور
  const fetchAdmins = async () => {
    try {
      const res = await fetch("/api/admin/manage-permissions");
      const data = await res.json();
      if (data.success) {
        setAdmins(data.admins);
      }
    } catch {
      setMessage({ type: "error", text: "خطا در دریافت لیست معین‌ها" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // تغییر وضعیت یک چک‌باکس در استیت محلی
  const handleTogglePermission = (username: string, permId: string) => {
    setAdmins((prevAdmins) =>
      prevAdmins.map((admin) => {
        if (admin.username !== username) return admin;

        const hasPerm = admin.permissions.includes(permId);
        const updatedPermissions = hasPerm
          ? admin.permissions.filter((p) => p !== permId)
          : [...admin.permissions, permId];

        return { ...admin, permissions: updatedPermissions };
      })
    );
  };

  // ذخیره دسترسی‌های جدید معین در دیتابیس
  const handleSavePermissions = async (username: string, permissions: string[]) => {
    setSavingUsername(username);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/manage-permissions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, permissions }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: `دسترسی‌های ${username} با موفقیت به‌روزرسانی شد.` });
      } else {
        setMessage({ type: "error", text: data.error || "خطا در ذخیره‌سازی" });
      }
    } catch {
      setMessage({ type: "error", text: "خطا در برقراری ارتباط با سرور" });
    } finally {
      setSavingUsername(null);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-xs text-slate-500 font-bold">در حال دریافت لیست معین‌ها...</div>;
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm" dir="rtl">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800">مدیریت سطوح دسترسی معین‌های ارشد</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            دسترسی هر معین را با تیک زدن ماژول‌های مربوطه تعیین کرده و ذخیره کنید.
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`p-3.5 mb-5 rounded-2xl text-xs font-bold ${
            message.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-rose-50 border border-rose-200 text-rose-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        {admins.map((admin) => (
          <div
            key={admin._id}
            className="p-4 rounded-2xl border border-slate-200/70 bg-slate-50/50 hover:bg-slate-50 transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              {/* مشخصات معین */}
              <div className="flex items-center gap-3 min-w-[180px]">
                <div className="w-10 h-10 rounded-xl bg-slate-200/80 flex items-center justify-center text-slate-600">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-800">{admin.name || admin.username}</h3>
                  <span className="text-[11px] text-slate-400">@{admin.username}</span>
                </div>
              </div>

              {/* لیست چک‌باکس‌های دسترسی */}
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                {ALL_PERMISSIONS.map((perm) => {
                  const Icon = perm.icon;
                  const isChecked = admin.permissions.includes(perm.id);

                  return (
                    <label
                      key={perm.id}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all select-none ${
                        isChecked
                          ? "bg-white border-blue-500 text-slate-800 shadow-sm"
                          : "bg-slate-100/80 border-slate-200 text-slate-400 opacity-60"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleTogglePermission(admin.username, perm.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <Icon className={`w-4 h-4 ${isChecked ? perm.color : "text-slate-400"}`} />
                      <span>{perm.label}</span>
                    </label>
                  );
                })}
              </div>

              {/* دکمه ذخیره‌سازی برای این معین */}
              <button
                onClick={() => handleSavePermissions(admin.username, admin.permissions)}
                disabled={savingUsername === admin.username}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 min-w-[110px]"
              >
                {savingUsername === admin.username ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>ذخیره تغییرات</span>
                  </>
                )}
              </button>

            </div>
          </div>
        ))}

        {admins.length === 0 && (
          <div className="text-center py-8 text-xs text-slate-400 font-bold">
            هیچ معین ارشدی در دیتابیس یافت نشد.
          </div>
        )}
      </div>
    </div>
  );
}