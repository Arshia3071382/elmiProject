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
        // Reset changed permissions
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

  // تغییر وضعیت یک دسترسی
  const togglePermission = (adminId: string, permission: Permission) => {
    const admin = admins.find((a) => a._id === adminId);
    if (!admin) return;

    // برای super_admin نمی‌توان دسترسی تغییر داد
    if (admin.role === "super_admin") {
      onShowMessage("error", "شما نمی‌توانید دسترسی مدیر اصلی را تغییر دهید");
      return;
    }

    // محاسبه دسترسی‌های جدید
    const currentPermissions = changedPermissions[adminId] || admin.permissions;
    let newPermissions: Permission[];

    if (currentPermissions.includes(permission)) {
      newPermissions = currentPermissions.filter((p) => p !== permission);
    } else {
      newPermissions = [...currentPermissions, permission];
    }

    // بروزرسانی state
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

    // اگر دسترسی‌ها با حالت فعلی برابر است
    if (JSON.stringify(permissions) === JSON.stringify(admin.permissions)) {
      setChangedPermissions((prev) => {
        const newState = { ...prev };
        delete newState[adminId];
        return newState;
      });
      // رفع خطای "info" - استفاده از "success" به جای "info"
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
        // بروزرسانی لیست معین‌ها
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

  // بررسی آیا معین تغییرات دارد
  const hasChanges = (adminId: string): boolean => {
    return !!changedPermissions[adminId];
  };

  // دریافت وضعیت یک دسترسی
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

  if (admins.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
        <p className="text-gray-500 text-center">هیچ معینی یافت نشد</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-bold mb-6 text-gray-800">
        مدیریت دسترسی معین‌ها
      </h2>

      <div className="space-y-6">
        {admins.map((admin) => (
          <div
            key={admin._id}
            className={`border rounded-xl p-4 transition-all ${
              hasChanges(admin._id) ? "border-blue-400 bg-blue-50" : "border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{admin.name}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">نام کاربری: {admin.username}</span>
                  <span className="text-gray-300">|</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      admin.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {admin.isActive ? "فعال" : "غیرفعال"}
                  </span>
                  {admin.role === "super_admin" && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                      مدیر اصلی
                    </span>
                  )}
                </div>
              </div>
              {admin.role !== "super_admin" && (
                <button
                  onClick={() => savePermissions(admin._id)}
                  disabled={saving[admin._id] || !hasChanges(admin._id)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    saving[admin._id]
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : hasChanges(admin._id)
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {saving[admin._id] ? "در حال ذخیره..." : "ذخیره تغییرات"}
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(PERMISSION_LABELS).map(([key, label]) => {
                const permission = key as Permission;
                const isChecked = getPermissionStatus(admin, permission);
                const isDisabled = admin.role === "super_admin";

                return (
                  <label
                    key={key}
                    className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                      isDisabled
                        ? "cursor-not-allowed opacity-60"
                        : "cursor-pointer hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => togglePermission(admin._id, permission)}
                      disabled={isDisabled}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                );
              })}
            </div>

            {hasChanges(admin._id) && (
              <div className="mt-3 text-sm text-blue-600">
                🔄 تغییرات اعمال نشده است
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}