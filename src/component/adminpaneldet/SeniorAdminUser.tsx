"use client";

import React, { useState, useEffect } from "react";
import { Shield, Check, Save, Trophy, Calendar, Bell, BookOpen, MessageSquare, UserCheck, UserPlus, Key, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface SeniorAdmin {
  _id?: string;
  username: string;
  name?: string;
  permissions: string[];
}

const AVAILABLE_PERMISSIONS = [
  { id: "calendar", label: "مدیریت تقویم آموزشی", icon: Calendar, color: "text-blue-600 bg-blue-50" },
  { id: "notices", label: "مدیریت اطلاعیه‌ها", icon: Bell, color: "text-emerald-600 bg-emerald-50" },
  { id: "courses", label: "مدیریت دوره‌های آموزشی", icon: BookOpen, color: "text-violet-600 bg-violet-50" },
  { id: "counseling", label: "اتاق‌های مشاوره", icon: MessageSquare, color: "text-amber-600 bg-amber-50" },
  { id: "grade_league", label: "لیگ علمی پایه", icon: Trophy, color: "text-yellow-600 bg-yellow-50" },
];

export default function SeniorAdminUser() {
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const [admins, setAdmins] = useState<SeniorAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingUsername, setSavingUsername] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // فرم ایجاد معین ارشد جدید
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/senior-admin/manage-permissions");
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

  const handleTogglePermission = (targetUsername: string, permissionId: string) => {
    setAdmins((prevAdmins) =>
      prevAdmins.map((admin) => {
        if (admin.username !== targetUsername) return admin;

        const currentPerms = admin.permissions || [];
        const hasPerm = currentPerms.includes(permissionId);

        const newPerms = hasPerm
          ? currentPerms.filter((p) => p !== permissionId)
          : [...currentPerms, permissionId];

        return { ...admin, permissions: newPerms };
      })
    );
  };

  const handleSavePermissions = async (targetUsername: string, permissions: string[]) => {
    setSavingUsername(targetUsername);
    setMessage(null);

    try {
      const res = await fetch("/api/senior-admin/manage-permissions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: targetUsername, permissions }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ type: "success", text: `دسترسی‌های معین (${targetUsername}) با موفقیت بروزرسانی شد.` });
      } else {
        setMessage({ type: "error", text: data.error || "خطا در ثبت تغییرات" });
      }
    } catch {
      setMessage({ type: "error", text: "خطا در برقراری ارتباط با سرور" });
    } finally {
      setSavingUsername(null);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password || !name.trim()) {
      setMessage({ type: "error", text: "تمامی فیلدها (نام، نام کاربری، رمز عبور) الزامی هستند." });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/senior-admin/manage-permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), name: name.trim(), password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: "success", text: "معین ارشد با موفقیت ایجاد شد و رمز عبور به صورت امن هش گردید." });
        setUsername("");
        setName("");
        setPassword("");
        setActiveTab("list");
        fetchAdmins();
      } else {
        setMessage({ type: "error", text: data.error || "خطا در ایجاد معین ارشد." });
      }
    } catch {
      setMessage({ type: "error", text: "خطای ارتباط با سرور." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* هدر بخش و تب‌ها */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-100/70 p-4 rounded-2xl border border-slate-200/80 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 text-white rounded-xl">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-800">مدیریت معین‌های ارشد و دسترسی‌ها</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              ایجاد حساب کاربری، تنظیم رمز عبور و تعیین سطح دسترسی معین‌های علمی.
            </p>
          </div>
        </div>

        {/* سوییچ تب‌ها */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => { setActiveTab("list"); setMessage(null); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "list" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            لیست و دسترسی‌ها
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab("create"); setMessage(null); }}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "create" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>افزودن معین جدید</span>
          </button>
        </div>
      </div>

      {/* پیام سیستم */}
      {message && (
        <div
          className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}
        >
          {message.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* محتوای تب ایجاد معین جدید */}
      {activeTab === "create" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-blue-600" />
            ثبت حساب کاربری جدید برای معین ارشد
          </h3>
          <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">نام و نام خانوادگی</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: داوود رضایی"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">نام کاربری (جهت ورود)</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="مثال: davood"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">رمز عبور امن</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="sm:col-span-3 flex justify-end mt-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                <span>ذخیره و ایجاد حساب معین</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* محتوای تب لیست و مدیریت دسترسی‌ها */}
      {activeTab === "list" && (
        <div className="space-y-4">
          {loading ? (
            <div className="p-8 text-center text-slate-500 text-xs font-bold">
              در حال بارگذاری لیست معین‌های ارشد...
            </div>
          ) : admins.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-white">
              هیچ معین ارشدی ثبت نشده است. از تب «افزودن معین جدید» یک حساب بسازید.
            </div>
          ) : (
            admins.map((admin) => (
              <div key={admin.username} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <UserCheck className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">{admin.name || admin.username}</h3>
                      <span className="text-[11px] text-slate-400 font-mono">نام کاربری: {admin.username}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSavePermissions(admin.username, admin.permissions || [])}
                    disabled={savingUsername === admin.username}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
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
            ))
          )}
        </div>
      )}
    </div>
  );
}