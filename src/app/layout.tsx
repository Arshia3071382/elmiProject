import type { Metadata, Viewport } from "next";
import "./globals.css";
import LayoutShell from "@/component/app/LayoutShell";

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "مجموعه علمی منتظران",
  description: "سامانه علمی و آموزشی مجموعه علمی منتظرan",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/logo6.png",
    apple: "/icons/logo6.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "علمی منتظران",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="flex flex-col min-h-screen bg-white overflow-x-hidden antialiased">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}