// Contact us page - Main component
"use client";

import { useState, useEffect } from "react";
import Container from "@/component/Container";
import ContactHeader from "./ContactHeader";
import SocialLinks from "./SocialLinks";
import ContactInfo from "./ContactInfo";
import ContactForm from "./ContactForm";
import CopyToast from "./CopyToast";
import { ContactFormData } from "./constants";

export default function ContactUs() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    grade: "",
    subject: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [canSend, setCanSend] = useState(true);
  const [lastSendTime, setLastSendTime] = useState<number | null>(null);

  // Check send limit
  useEffect(() => {
    const savedTime = localStorage.getItem("lastContactSendTime");
    if (savedTime) {
      const time = parseInt(savedTime);
      const now = Date.now();
      const diff = now - time;
      const oneDay = 24 * 60 * 60 * 1000;
      if (diff < oneDay) {
        setCanSend(false);
        setLastSendTime(time);
      }
    }
  }, []);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSend) {
      const remaining = Math.ceil(
        (24 * 60 * 60 * 1000 - (Date.now() - (lastSendTime || 0))) / (60 * 60 * 1000)
      );
      setStatus({
        type: "error",
        text: `شما قبلاً امروز پیام ارسال کرده‌اید. ${remaining} ساعت دیگر می‌توانید مجدداً پیام دهید.`,
      });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("lastContactSendTime", Date.now().toString());
        setCanSend(false);
        setLastSendTime(Date.now());

        setStatus({
          type: "success",
          text: "پیام شما با موفقیت ثبت شد. تیم علمی ما در اسرع وقت با شما تماس می‌گیرد.",
        });
        setFormData({ name: "", grade: "", subject: "", phone: "", message: "" });
      } else {
        setStatus({
          type: "error",
          text: data.error || "خطایی رخ داده است. لطفاً دوباره تلاش کنید.",
        });
      }
    } catch (error) {
      setStatus({ type: "error", text: "خطا در ارتباط با سرور" });
    } finally {
      setLoading(false);
    }
  };

  // Copy support ID
  const handleCopySupport = () => {
    const supportId = "@Admin_elmi";
    navigator.clipboard?.writeText(supportId);
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 2000);
  };

  return (
    <Container>
      <div dir="rtl" className="min-h-screen mt-10 sm:mt-20 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <ContactHeader />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Right column - Contact info */}
            <div className="lg:col-span-2 space-y-6">
              <SocialLinks onCopySupport={handleCopySupport} />
              <ContactInfo />
            </div>

            {/* Left column - Form */}
            <div className="lg:col-span-3">
              <ContactForm
                formData={formData}
                loading={loading}
                canSend={canSend}
                status={status}
                onFormChange={setFormData}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>

      <CopyToast show={showCopyToast} />
    </Container>
  );
}