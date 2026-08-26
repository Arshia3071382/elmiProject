// src/component/adminpaneldet/SeniorPermissionManager.tsx

"use client";

import { useState, useEffect } from "react";
import { PERMISSION_LABELS, Permission } from "../../config/permissions";

interface SeniorAdmin {
  _id: string;
  username: string;
  name: string;
  role: string;
  permissions: Permission[];
  isActive: boolean;
}

interface PermissionManagerProps {
  onShowMessage: (type: "success" | "error", text: string) => void;
}

export default function SeniorPermissionManager({
  onShowMessage,
}: PermissionManagerProps) {
  const [admins, setAdmins] = useState<SeniorAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [changedPermissions, setChangedPermissions] = useState<
    Record<string, Permission[]>
  >({});

  // States مربوط به فرم افزودن معین جدید
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [creating, setCreating] = useState(false);

  // دریافت لیست معین‌ها
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/senior-admin/manage-permissions", {
        cache: "no-store",
      });
      const data = await res.json();

      if (data.success) {
        setAdmins(data.admins);
        setChangedPermissions({});
      } else {
        onShowMessage("error", data.error || "خطا در دریافت لیست معین‌ها");
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
      onShowMessage("error", "خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // ایجاد معین ارشد جدید
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUsername.trim() || !newPassword.trim()) {
      onShowMessage("error", "لطفاً تمامی فیلدها را پر کنید");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/senior-admin/manage-permissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName.trim(),
          username: newUsername.trim(),
          password: newPassword,
        }),
      });

      const data = await res.json();

      if (data.success) {
        onShowMessage("success", "معین ارشد جدید با موفقیت ایجاد شد");
        setNewName("");
        setNewUsername("");
        setNewPassword("");
        setShowAddModal(false);
        fetchAdmins();
      } else {
        onShowMessage("error", data.error || "خطا در ایجاد معین ارشد");
      }
    } catch (error) {
      console.error("Error creating admin:", error);
      onShowMessage("error", "خطا در ارتباط با سرور");
    } finally {
      setCreating(false);
    }
  };

  // تغییر وضعیت یک دسترسی
  const togglePermission = (adminId: string, permission: Permission) => {
    const admin = admins.find((a) => a._id === adminId);
    if (!admin) return;

    if (admin.role === "super_admin") {
      onShowMessage("error", "شما نمی‌توانید دسترسی مدیر اصلی را تغییر دهید");
      return;
    }

    const currentPermissions = changedPermissions[adminId] || admin.permissions;
    let newPermissions: Permission[];

    if (currentPermissions.includes(permission)) {
      newPermissions = currentPermissions.filter((p) => p !== permission);
    } else {
      newPermissions = [...currentPermissions, permission];
    }

    setChangedPermissions((prev) => ({
      ...prev,
      [adminId]: newPermissions,
    }));
  };

  // ذخیره تغییرات برای یک معین
  const savePermissions = async (adminId: string) => {
    const admin = admins.find((a) => a._id === adminId);
    if (!admin) return;

    const permissions = changedPermissions[adminId];
    if (!permissions) {
      onShowMessage("error", "تغییری برای ذخیره وجود ندارد");
      return;
    }

    if (JSON.stringify(permissions) === JSON.stringify(admin.permissions)) {
      setChangedPermissions((prev) => {
        const newState = { ...prev };
        delete newState[adminId];
        return newState;
      });
      onShowMessage("success", "تغییری صورت نگرفته است");
      return;
    }

    setSaving((prev) => ({ ...prev, [adminId]: true }));

    try {
      const res = await fetch("/api/senior-admin/manage-permissions", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: admin.username,
          permissions,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setAdmins((prev) =>
          prev.map((a) =>
            a._id === adminId ? { ...a, permissions: data.admin.permissions } : a
          )
        );
        setChangedPermissions((prev) => {
          const newState = { ...prev };
          delete newState[adminId];
          return newState;
        });
        onShowMessage("success", "دسترسی‌ها با موفقیت بروزرسانی شد");
      } else {
        onShowMessage("error", data.error || "خطا در ذخیره تغییرات");
      }
    } catch (error) {
      console.error("Error saving permissions:", error);
      onShowMessage("error", "خطا در ارتباط با سرور");
    } finally {
      setSaving((prev) => ({ ...prev, [adminId]: false }));
    }
  };

  const hasChanges = (adminId: string): boolean => {
    return !!changedPermissions[adminId];
  };

  const getPermissionStatus = (
    admin: SeniorAdmin,
    permission: Permission
  ): boolean => {
    const permissions = changedPermissions[admin._id] || admin.permissions;
    return permissions.includes(permission);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
        <div className="flex justify-center items-center h-40">
          <div className="text-gray-500">در حال بارگذاری...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* هدر بخش همراه با دکمه افزودن */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            مدیریت معین‌های ارشد و دسترسی‌ها
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            ایجاد حساب کاربری جدید و کنترل سطح دسترسی ماژول‌ها برای معین‌ها
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer"
        >
          + ایجاد معین ارشد جدید
        </button>
      </div>

      {/* مودال ایجاد معین ارشد جدید */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              ثبت حساب کاربری معین ارشد جدید
            </h3>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نام و نام خانوادگی
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="مثال: علی احمدی"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نام کاربری (جهت ورود)
                </label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="مثال: ali_admin"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  رمز عبور امن
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-sm transition-all cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {creating ? "در حال ساخت..." : "ثبت و ایجاد حساب"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* لیست معین‌های موجود */}
      <div className="space-y-4">
        {admins.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 text-center">
            <p className="text-gray-500">هیچ معینی یافت نشد</p>
          </div>
        ) : (
          admins.map((admin) => (
            <div
              key={admin._id}
              className={`bg-white rounded-2xl shadow-sm p-6 border transition-all ${
                hasChanges(admin._id)
                  ? "border-blue-400 ring-2 ring-blue-50"
                  : "border-gray-100"
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {admin.name}
                  </h3>
                  <div className="flex items-center gap-3 text-sm mt-1">
                    <span className="text-gray-500 font-medium">
                      نام کاربری: <strong className="text-gray-700">{admin.username}</strong>
                    </span>
                    <span className="text-gray-300">|</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        admin.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {admin.isActive ? "فعال" : "غیرفعال"}
                    </span>
                    {admin.role === "super_admin" && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                        مدیر اصلی
                      </span>
                    )}
                  </div>
                </div>

                {admin.role !== "super_admin" && (
                  <button
                    onClick={() => savePermissions(admin._id)}
                    disabled={saving[admin._id] || !hasChanges(admin._id)}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                      saving[admin._id]
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : hasChanges(admin._id)
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {saving[admin._id] ? "در حال ذخیره..." : "ذخیره تغییرات"}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(PERMISSION_LABELS).map(([key, label]) => {
                  const permission = key as Permission;
                  const isChecked = getPermissionStatus(admin, permission);
                  const isDisabled = admin.role === "super_admin";

                  return (
                    <label
                      key={key}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        isDisabled
                          ? "bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed"
                          : isChecked
                          ? "bg-blue-50/50 border-blue-200 cursor-pointer"
                          : "bg-gray-50/50 border-gray-100 hover:bg-gray-50 cursor-pointer"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => togglePermission(admin._id, permission)}
                        disabled={isDisabled}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-xs sm:text-sm font-medium text-gray-700">
                        {label}
                      </span>
                    </label>
                  );
                })}
              </div>

              {hasChanges(admin._id) && (
                <div className="mt-4 text-xs font-bold text-blue-600 flex items-center gap-1">
                  <span>⚠️</span> تغییرات ذخیره نشده است؛ لطفاً روی دکمه ذخیره کلیک کنید.
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}