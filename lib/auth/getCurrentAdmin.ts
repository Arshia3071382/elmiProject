// src/lib/auth/getCurrentAdmin.ts

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

    if (!token) {
      return null;
    }

    // Decode token (هماهنگ با سیستم موجود)
    let session: AdminSession;
    try {
      const decoded = Buffer.from(token, "base64").toString();
      session = JSON.parse(decoded);
    } catch (error) {
      console.error("Token decode failed:", error);
      return null;
    }

    if (!session.username) {
      return null;
    }

    // Connect to database
    await dbConnect();

    // Find admin
    const admin = await SeniorAdmin.findOne({
      username: session.username,
      isActive: true,
    }).lean();

    if (!admin) {
      return null;
    }

    return admin as ISeniorAdmin;
  } catch (error) {
    console.error("Error getting current admin:", error);
    return null;
  }
}