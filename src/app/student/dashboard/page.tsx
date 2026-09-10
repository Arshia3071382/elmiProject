import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import StudentDashboardClient from "@/component/StudentDashboardClient";

export default async function DashboardPage() {
  // چک کردن کوکی در سطح سرور با نام استاندارد student_token
  const cookieStore = await cookies();
  const token = cookieStore.get("student_token");

  // اگر توکن نبود، به صفحه اصلی هدایت شود
  if (!token) {
    redirect("/");
  }

  // اگر توکن بود، کامپوننت نمایشی بارگذاری شود
  return <StudentDashboardClient />;
}