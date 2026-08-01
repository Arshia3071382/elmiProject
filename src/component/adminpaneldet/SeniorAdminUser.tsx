"use client";

import { useEffect, useState } from "react";
import { Shield, Check, Save, Trophy, Calendar, Bell, BookOpen, MessageSquare, UserCheck } from "lucide-react";

interface SeniorAdmin {
  _id?: string;
  username: string;
  name?: string;
  permissions: string[];
}

// لیست کلیه ماژول‌ها و دسترسی‌های قابل اعطا
const AVAILABLE_PERMISSIONS = [
  { id: "calendar", label: "مدیریت تقویم آموزشی", icon: Calendar, color: "text-blue-600 bg-blue-50" },
  { id: "notices", label: "مدیریت اطلاعیه‌ها", icon: Bell, color: "text-emerald-600 bg-emerald-50" },
  { id: "courses", label: "مدیریت دوره‌های آموزشی", icon: BookOpen, color: "text-violet-600 bg-violet-50" },
  { id: "counseling", label: "اتاق‌های مشاوره", icon: MessageSquare, color: "text-amber-600 bg-amber-50" },
  { id: "grade_league", label: "لیگ علمی پایه", icon: Trophy, color: "text-yellow-600 bg-yellow-50" },
];

export default function SeniorAdminUser() {
  const [admins, setAdmins] = useState<SeniorAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingUsername, setSavingUsername] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // دریافت لیست معین‌های ارشد
  const fetchAdmins = async () => {
    try {
      const res = await fetch("/api/admin/manage-permissions");
      const data = await res.json();
      if (data.success) {
        setAdmins(data.admins || []);
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

  // تغییر تیک دسترسی برای یک معین خاص
  const handleTogglePermission = (username: string, permissionId: string) => {
    setAdmins((prevAdmins) =>
      prevAdmins.map((admin) => {
        if (admin.username !== username) return admin;

        const currentPerms = admin.permissions || [];
        const hasPerm = currentPerms.includes(permissionId);

        const newPerms = hasPerm
          ? currentPerms.filter((p) => p !== permissionId)
          : [...currentPerms, permissionId];

        return { ...admin, permissions: newPerms };
      })
    );
  };

  // ذخیره دسترسی‌های معین در دیتابیس
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

      if (res.ok && data.success) {
        setMessage({ type: "success", text: `دسترسی‌های معین (${username}) با موفقیت بروزرسانی شد.` });
      } else {
        setMessage({ type: "error", text: data.error || "خطا در ثبت تغییرات" });
      }
    } catch {
      setMessage({ type: "error", text: "خطا در برقراری ارتباط با سرور" });
    } finally {
      setSavingUsername(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 text-xs font-bold">
        در حال بارگذاری لیست معین‌های ارشد...
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* هدر بخش */}
      <div className="flex items-center justify-between bg-slate-100/70 p-4 rounded-2xl border border-slate-200/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 text-white rounded-xl">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-800">مدیریت دسترسی‌های معین‌های علمی</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              تیک ماژول‌های مورد نظر را بزنید و دکمه ذخیره را فشارد دهید تا در پنل معین مربوطه فعال شود.
            </p>
          </div>
        </div>
      </div>

      {/* پیام سیستم */}
      {message && (
        <div
          className={`p-3.5 rounded-xl text-xs font-bold transition-all ${
            message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* کارت معین‌ها */}
      <div className="grid grid-cols-1 gap-4">
        {admins.map((admin) => (
          <div key={admin.username} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-800">{admin.name || admin.username}</h3>
                  <span className="text-[11px] text-slate-400">نام کاربری: {admin.username}</span>
                </div>
              </div>

              <button
                onClick={() => handleSavePermissions(admin.username, admin.permissions || [])}
                disabled={savingUsername === admin.username}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95"
              >
                {savingUsername === admin.username ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>ذخیره دسترسی‌ها</span>
                  </>
                )}
              </button>
            </div>

            {/* لیست تیک ماژول‌ها */}
            <div>
              <p className="text-xs font-bold text-slate-600 mb-3">ماژول‌های مجاز:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {AVAILABLE_PERMISSIONS.map((perm) => {
                  const Icon = perm.icon;
                  const isChecked = admin.permissions?.includes(perm.id);

                  return (
                    <label
                      key={perm.id}
                      onClick={() => handleTogglePermission(admin.username, perm.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all select-none ${
                        isChecked
                          ? "border-blue-500 bg-blue-50/40 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-lg ${perm.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{perm.label}</span>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                          isChecked ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300 bg-white"
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        ))}

        {admins.length === 0 && (
          <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl">
            هیچ معین ارشدی یافت نشد.
          </div>
        )}
      </div>
    </div>
  );
}