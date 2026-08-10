
// src/lib/auth/.ts

import { cookies } from "next/headers";
import dbConnect from "../dbConnect";
import SeniorAdmin, { ISeniorAdmin } from "../../models/SeniorAdmin";

export interface AdminSession {
  username: string;
  createdAt: number;
}

export interface AdminUser {
  _id: string;
  username: string;
  name: string;
  role: "super_admin" | "senior_admin";
  permissions: string[];
  isActive: boolean;
  isFirstLogin: boolean;
  lastLoginAt: Date;
}

export async function getCurrentAdmin(): Promise<ISeniorAdmin | null> {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("senior_admin_token")?.value;

    // اگر توکن وجود نداشته باشد
    if (!token) {
      console.log("No senior_admin_token cookie found");
      return null;
    }

    // Decode token
    let session: AdminSession;

    try {
      const decoded = Buffer.from(token, "base64").toString("utf-8");

      session = JSON.parse(decoded);
    } catch (error) {
      console.error("Token decode failed:", error);
      return null;
    }

    // بررسی username
    if (!session?.username) {
      console.log("Invalid admin session: username missing");
      return null;
    }

    // اتصال به دیتابیس
    await dbConnect();

    // پیدا کردن ادمین فعال
    const admin = await SeniorAdmin.findOne({
      username: session.username,
      isActive: true,
    }).lean();

    if (!admin) {
      console.log(
        "Admin not found or inactive:",
        session.username
      );

      return null;
    }

    return admin as ISeniorAdmin;
  } catch (error) {
    console.error("Error getting current admin:", error);
    return null;
  }
}

