import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import StudentDashboardClient from "@/component/StudentDashboardClient"; // آدرس فایل جدیدتان

export default async function DashboardPage() {
  // چک کردن کوکی در سطح سرور
  const cookieStore = await cookies();
  const token = cookieStore.get("studentToken");

  // اگر توکن نبود، قبل از اینکه صفحه رندر شود، کاربر را به صفحه اصلی بفرست
  if (!token) {
    redirect("/");
  }

  // اگر توکن بود، کامپوننت نمایشی را نشان بده
  return <StudentDashboardClient />;
}