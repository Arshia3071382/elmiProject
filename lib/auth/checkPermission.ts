// src/lib/auth/checkPermission.ts

import { getCurrentAdmin } from "./getCurrentAdmin";
import { Permission } from "./../../src/config/permissions";

export async function checkPermission(
  permission: Permission
): Promise<boolean> {
  try {
    const admin = await getCurrentAdmin();

    if (!admin) {
      return false;
    }

    // Super admin has all permissions
    if (admin.role === "super_admin") {
      return true;
    }

    // Check if admin has the specific permission
    return admin.permissions?.includes(permission) || false;
  } catch (error) {
    console.error("Error checking permission:", error);
    return false;
  }
}

export async function checkAnyPermission(
  permissions: Permission[]
): Promise<boolean> {
  try {
    const admin = await getCurrentAdmin();

    if (!admin) {
      return false;
    }

    // Super admin has all permissions
    if (admin.role === "super_admin") {
      return true;
    }

    // Check if admin has any of the specified permissions
    return permissions.some((p) => admin.permissions?.includes(p)) || false;
  } catch (error) {
    console.error("Error checking any permission:", error);
    return false;
  }
}

export async function checkAllPermissions(
  permissions: Permission[]
): Promise<boolean> {
  try {
    const admin = await getCurrentAdmin();

    if (!admin) {
      return false;
    }

    // Super admin has all permissions
    if (admin.role === "super_admin") {
      return true;
    }

    // Check if admin has all of the specified permissions
    return permissions.every((p) => admin.permissions?.includes(p)) || false;
  } catch (error) {
    console.error("Error checking all permissions:", error);
    return false;
  }
}