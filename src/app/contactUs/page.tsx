"use client";
import aparat from "./../../../public/image/Aparat_Icon.png";
import rubika from "./../../../public/image/Rubika_Icon.png";
import { useState, useEffect } from "react";
import {
  Send,
  User,
  Phone,
  FileText,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Headphones,
  ChevronDown,
  GraduationCap,
} from "lucide-react";
import Container from "@/component/Container";
import Image from "next/image";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    grade: "",
    subject: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // موضوعات
  const subjects = [
    "دوره‌های آموزشی",
    "لیگ نخبگان",
    "گفتینو",
    "مشاوره تحصیلی",
    "اشکالات درسی",
    "انتقادات و پیشنهادات",
    "سایر",
  ];

  // پایه‌های تحصیلی
  const grades = [
    "پایه دوم",
    "پایه سوم",
    "پایه چهارم",
    "پایه پنجم",
    "پایه ششم",
    "پایه هفتم",
    "پایه هشتم",
    "پایه نهم",
    "پایه دهم",
    "پایه یازدهم",
    "پایه دوازدهم",
    "دانشگاهی",
  ];

  // محدودیت ارسال پیام (یک بار در روز)
  const [canSend, setCanSend] = useState(true);
  const [lastSendTime, setLastSendTime] = useState<number | null>(null);

  useEffect(() => {
    // بررسی محدودیت ارسال از localStorage
    const savedTime = localStorage.getItem("lastContactSendTime");
    if (savedTime) {
      const time = parseInt(savedTime);
      const now = Date.now();
      const diff = now - time;
      const oneDay = 24 * 60 * 60 * 1000; // 24 ساعت
      if (diff < oneDay) {
        setCanSend(false);
        setLastSendTime(time);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // بررسی محدودیت ارسال
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
        // ذخیره زمان ارسال
        localStorage.setItem("lastContactSendTime", Date.now().toString());
        setCanSend(false);
        setLastSendTime(Date.now());

        setStatus({
          type: "success",
          text: "پیام شما با موفقیت ثبت شد. تیم علمی ما در اسرع وقت با شما تماس می‌گیرد.",
        });
        setFormData({ name: "", grade: "", subject: "", phone: "", message: "" });
        setIsDropdownOpen(false);
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

  // کپی آیدی پشتیبانی با انیمیشن
  const handleCopySupport = () => {
    const supportId = "@Admin_elmi";
    navigator.clipboard?.writeText(supportId);
    setShowCopyToast(true);
    setTimeout(() => {
      setShowCopyToast(false);
    }, 2000);
  };

  // لینک‌های کانال‌ها
  const socialLinks = {
    rubika: "https://rubika.ir/elmiMontazeran",
    aparat: "https://www.aparat.com/elmiMontazeran",
    support: "@Admin_elmi",
  };

  // اعتبارسنجی شماره تلفن
  const validatePhone = (phone: string) => {
    // شماره باید با ۰۹ شروع شود و ۱۱ رقم باشد
    const phoneRegex = /^09[0-9]{9}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // فقط اعداد
    if (value.length <= 11) {
      setFormData({ ...formData, phone: value });
    }
  };

  // محدودیت نام (حداکثر ۵۰ کاراکتر)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 50) {
      setFormData({ ...formData, name: value });
    }
  };

  // محدودیت پیام (حداکثر ۵۰۰ کاراکتر)
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setFormData({ ...formData, message: value });
    }
  };

  return (
    <Container>
      <div
        dir="rtl"
        className="min-h-screen mt-10 sm:mt-20 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 py-12 px-4"
      >
        <div className="max-w-6xl mx-auto">
          {/* هدر صفحه */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              <Sparkles className="w-8 h-8 text-secondary" />
              <h1
                className="text-4xl md:text-5xl font-bold tracking-tight"
                style={{ fontFamily: "iranBold" }}
              >
                ارتباط با ما
              </h1>
            </div>
            <p
              className="text-text-secondary text-lg max-w-2xl mx-auto"
              style={{ fontFamily: "iranSans-r" }}
            >
              خوشحال می‌شویم نظرات، پیشنهادات علمی و سوالات شما را بشنویم. تیم
              متخصص ما آماده پاسخگویی است.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* بخش اطلاعات تماس - سمت راست */}
            <div className="lg:col-span-2 space-y-6">
              {/* کارت کانال‌های اجتماعی و رسانه */}
              <div className="bg-white/80 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
                <h3
                  className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2"
                  style={{ fontFamily: "iranBold" }}
                >
                  <ExternalLink className="w-5 h-5 text-secondary" />
                  ما را دنبال کنید
                </h3>
                <p
                  className="text-sm text-text-secondary mb-4"
                  style={{ fontFamily: "iranSans-r" }}
                >
                  در کانال‌های علمی ما عضو شوید و از جدیدترین دستاوردها مطلع
                  گردید.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={socialLinks.rubika}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-600/10 to-purple-600/5 hover:from-purple-600/20 hover:to-purple-600/10 border border-purple-200/30 rounded-xl transition-all group"
                  >
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform">
                      <Image src={rubika} alt="روبیکا" className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-primary">
                        روبیکا
                      </p>
                      <p className="text-[10px] text-text-secondary">
                        elmiMontazeran
                      </p>
                    </div>
                  </a>

                  <a
                    href={socialLinks.aparat}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-red-600/10 to-red-600/5 hover:from-red-600/20 hover:to-red-600/10 border border-red-200/30 rounded-xl transition-all group"
                  >
                    <div className="bg-white p-2 rounded-lg shadow-lg shadow-red-500/25 group-hover:scale-110 transition-transform">
                      <Image src={aparat} alt="آپارات" className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-primary">
                        آپارات
                      </p>
                      <p className="text-[10px] text-text-secondary">
                        elmiMontazeran
                      </p>
                    </div>
                  </a>
                </div>

                {/* بخش پشتیبانی */}
                <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200/50">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-2 rounded-lg shadow-lg shadow-emerald-500/25">
                      <Headphones className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p
                        className="text-xs font-bold text-text-primary"
                        style={{ fontFamily: "iranBold" }}
                      >
                        پشتیبانی در پیام رسان روبیکا
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className="text-xs text-text-secondary"
                          style={{ fontFamily: "iranSans-r" }}
                        >
                          آیدی:
                        </span>
                        <code className="text-xs bg-white/70 px-2 py-0.5 rounded border border-emerald-200 text-emerald-700 font-mono">
                          {socialLinks.support}
                        </code>
                        <button
                          onClick={handleCopySupport}
                          className="text-[10px] bg-emerald-500 hover:bg-emerald-600 text-white px-2 py-0.5 rounded transition-colors"
                        >
                          کپی
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* کارت اعتماد و تعهدات */}
              <div className="bg-white/80 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-xl">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50/50 transition-colors">
                    <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                      <span className="text-green-500 text-sm">✓</span>
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium text-text-primary"
                        style={{ fontFamily: "iranSans-r" }}
                      >
                        پاسخگویی سریع
                      </p>
                      <p className="text-xs text-text-secondary">
                        طی ۲۴ ساعت کاری
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50/50 transition-colors">
                    <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                      <span className="text-blue-500 text-sm">🔒</span>
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium text-text-primary"
                        style={{ fontFamily: "iranSans-r" }}
                      >
                        حریم خصوصی
                      </p>
                      <p className="text-xs text-text-secondary">
                        اطلاعات شما محفوظ است
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50/50 transition-colors">
                    <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center">
                      <span className="text-purple-500 text-sm">👨‍🔬</span>
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium text-text-primary"
                        style={{ fontFamily: "iranSans-r" }}
                      >
                        تیم متخصص
                      </p>
                      <p className="text-xs text-text-secondary">
                        پاسخگویی توسط کارشناسان علمی
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              
            </div>

            {/* فرم تماس - سمت چپ */}
            <div className="lg:col-span-3">
              <div className="bg-white/90 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <div className="mb-8">
                  <h2
                    className="text-2xl font-bold text-text-primary flex items-center gap-2"
                    style={{ fontFamily: "iranBold" }}
                  >
                    <MessageSquare className="w-6 h-6 text-secondary" />
                    ارسال پیام
                  </h2>
                  <p
                    className="text-sm text-text-secondary mt-1"
                    style={{ fontFamily: "iranSans-r" }}
                  >
                    فرم زیر را تکمیل کنید تا در اسرع وقت با شما تماس بگیریم
                  </p>
                  {!canSend && (
                    <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      شما امروز قبلاً پیام ارسال کرده‌اید. ارسال مجدد در ۲۴ ساعت آینده امکان‌پذیر است.
                    </p>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* نام و نام خانوادگی */}
                  <div className="relative group">
                    <User className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-secondary transition-colors" />
                    <input
                      type="text"
                      required
                      placeholder="نام و نام خانوادگی"
                      value={formData.name}
                      onChange={handleNameChange}
                      className="w-full border-2 border-border bg-white/50 rounded-xl pr-12 pl-4 py-3.5 text-sm focus:outline-none focus:border-secondary focus:ring-4 focus:ring-blue-500/10 transition-all hover:border-blue-300"
                      style={{ fontFamily: "iranSans-r" }}
                      maxLength={50}
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-text-secondary opacity-50">
                      {formData.name.length}/۵۰
                    </div>
                  </div>

                  {/* پایه تحصیلی - Dropdown */}
                  <div className="relative group">
                    <GraduationCap className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-secondary transition-colors z-10" />
                    <select
                      required
                      value={formData.grade}
                      onChange={(e) =>
                        setFormData({ ...formData, grade: e.target.value })
                      }
                      className="w-full border-2 border-border bg-white/50 rounded-xl pr-12 pl-4 py-3.5 text-sm focus:outline-none focus:border-secondary focus:ring-4 focus:ring-blue-500/10 transition-all hover:border-blue-300 appearance-none cursor-pointer"
                      style={{ fontFamily: "iranSans-r" }}
                    >
                      <option value="">پایه تحصیلی خود را انتخاب کنید</option>
                      {grades.map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>

                  {/* موضوع - Dropdown مدرن */}
                  <div className="relative group">
                    <FileText className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-secondary transition-colors z-10" />
                    <div
                      className="relative"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <div
                        className={`w-full border-2 ${
                          isDropdownOpen ? "border-secondary" : "border-border"
                        } bg-white/50 rounded-xl pr-12 pl-4 py-3.5 text-sm cursor-pointer transition-all hover:border-blue-300 flex items-center justify-between`}
                        style={{ fontFamily: "iranSans-r" }}
                      >
                        <span
                          className={
                            formData.subject
                              ? "text-text-primary"
                              : "text-gray-400"
                          }
                        >
                          {formData.subject || "موضوع پیام را انتخاب کنید"}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 transition-transform ${
                            isDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      {isDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-xl shadow-2xl z-20 overflow-hidden">
                          {subjects.map((subject) => (
                            <div
                              key={subject}
                              className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors text-sm"
                              style={{ fontFamily: "iranSans-r" }}
                              onClick={() => {
                                setFormData({ ...formData, subject });
                                setIsDropdownOpen(false);
                              }}
                            >
                              {subject}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* شماره تماس */}
                  <div className="relative group">
                    <Phone className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-secondary transition-colors" />
                    <input
                      type="text"
                      required
                      placeholder="شماره تماس (۰۹۱۲۳۴۵۶۷۸۹)"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className="w-full text-right w-full border-2 border-border bg-white/50 rounded-xl pr-12 pl-4 py-3.5 text-sm focus:outline-none focus:border-secondary focus:ring-4 focus:ring-blue-500/10 transition-all hover:border-blue-300 text-left font-mono"
                      dir="ltr"
                      maxLength={11}
                    />
                    {formData.phone && !validatePhone(formData.phone) && (
                      <p className="text-xs text-red-500 mt-1 mr-4">
                        شماره تماس باید با ۰۹ شروع شود و ۱۱ رقم باشد
                      </p>
                    )}
                  </div>

                  {/* پیام */}
                  <div className="relative group">
                    <textarea
                      required
                      rows={5}
                      placeholder="متن پیام شما (حداکثر ۵۰۰ کاراکتر)..."
                      value={formData.message}
                      onChange={handleMessageChange}
                      className="w-full border-2 border-border bg-white/50 rounded-xl p-4 text-sm focus:outline-none focus:border-secondary focus:ring-4 focus:ring-blue-500/10 transition-all hover:border-blue-300 resize-none"
                      style={{ fontFamily: "iranSans-r" }}
                      maxLength={500}
                    />
                    <div className="absolute bottom-3 left-3 text-[10px] text-text-secondary opacity-50">
                      {formData.message.length}/۵۰۰
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !canSend || !validatePhone(formData.phone) || !formData.grade || !formData.subject}
                    className="w-full bg-gradient-to-r from-secondary to-primary hover:from-blue-700 hover:to-primary text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 flex items-center justify-center gap-3 text-sm group disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: "iranBold" }}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        در حال ارسال...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        ارسال پیام
                      </>
                    )}
                  </button>
                </form>

                {status && (
                  <div
                    className={`mt-6 flex items-start gap-3 p-4 rounded-xl border ${
                      status.type === "success"
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-red-50 border-red-200 text-red-700"
                    }`}
                  >
                    {status.type === "success" ? (
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    )}
                    <span className="text-sm" style={{ fontFamily: "iranSans-r" }}>
                      {status.text}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast کپی شدن با انیمیشن */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 transform ${
          showCopyToast
            ? "translate-y-0 opacity-100"
            : "translate-y-20 opacity-0"
        }`}
      >
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl shadow-emerald-500/30 flex items-center gap-3">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium text-sm" style={{ fontFamily: "iranSans-r" }}>
            آیدی پشتیبانی با موفقیت کپی شد!
          </span>
        </div>
      </div>
    </Container>
  );
}