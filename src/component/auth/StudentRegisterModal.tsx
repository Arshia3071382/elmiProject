// components/auth/StudentRegisterModal.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { X, User, CreditCard, Phone, Lock, Eye, EyeOff, ShieldCheck, Download, ArrowLeft, KeyRound, Trophy } from "lucide-react";
import RulesModal from "./StudentRegisterModal/RulesModal";

// تابع کمکی برای تبدیل ارقام فارسی و عربی به انگلیسی و فیلتر کردن غیر اعداد
const toEnglishDigits = (str: string): string => {
  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
  const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
  let converted = str;
  for (let i = 0; i < 10; i++) {
    converted = converted.replace(persianNumbers[i], i.toString()).replace(arabicNumbers[i], i.toString());
  }
  return converted.replace(/\D/g, "");
};

// تابع اعتبارسنجی کد ملی ایران
export const isValidNationalId = (id: string): boolean => {
  if (!/^\d{10}$/.test(id)) return false;
  const check = parseInt(id[9], 10);
  const sum = id
    .split("")
    .slice(0, 9)
    .reduce((acc, x, i) => acc + parseInt(x, 10) * (10 - i), 0);
  const remainder = sum % 11;
  return (
    (remainder < 2 && check === remainder) ||
    (remainder >= 2 && check === 11 - remainder)
  );
};

interface StudentRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export default function StudentRegisterModal({
  isOpen,
  onClose,
  onSuccess,
  onSwitchToLogin,
}: StudentRegisterModalProps) {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | "security-card">(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

  // استیت نگهداری تصویر کارت امنیتی به صورت Data URL
  const [securityCardImage, setSecurityCardImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nationalId: "",
    phone: "",
    password: "",
    confirmPassword: "",
    securityPin: "", // کد ۶ رقمی عددی
    favoritePlayer: "", // ۳ حرف انگلیسی بازیکن
    acceptRules: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const updateField = (field: string, value: any) => {
    let processedValue = value;

    if (field === "securityPin") {
      processedValue = toEnglishDigits(value).slice(0, 6);
    } else if (field === "favoritePlayer") {
      processedValue = value.replace(/[^A-Za-z]/g, "").slice(0, 3);
    }

    setFormData((prev) => ({ ...prev, [field]: processedValue }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        setErrors({
          firstName: !formData.firstName.trim() ? "نام الزامی است." : "",
          lastName: !formData.lastName.trim() ? "نام خانوادگی الزامی است." : "",
        });
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const cleanedId = formData.nationalId.replace(/\D/g, "");
      const cleanedPhone = formData.phone.replace(/\D/g, "");

      if (!cleanedId || !cleanedPhone || !isValidNationalId(cleanedId) || !/^09[0-9]{9}$/.test(cleanedPhone)) {
        setErrors({
          nationalId: !cleanedId ? "کد ملی الزامی است." : !isValidNationalId(cleanedId) ? "کد ملی نامعتبر است." : "",
          phone: !cleanedPhone ? "شماره همراه الزامی است." : !/^09[0-9]{9}$/.test(cleanedPhone) ? "شماره همراه نامعتبر است." : "",
        });
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (
        formData.password.length < 6 ||
        formData.password !== formData.confirmPassword
      ) {
        setErrors({
          password: formData.password.length < 6 ? "رمز عبور باید حداقل ۶ کاراکتر باشد." : "",
          confirmPassword: formData.password !== formData.confirmPassword ? "تکرار رمز عبور مطابقت ندارد." : "",
        });
        return;
      }
      setStep(4);
    }
  };

  const handlePrevStep = () => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
    else if (step === 4) setStep(3);
  };

  // تابع تولید تصویر کارت امنیتی دقیقاً مطابق با طراحی نمونه و بدون اسکرول
  const generateSecurityCardDataUrl = (fullName: string, pin: string, player: string): string => {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 450; // اندازه متناسب به صورت کارت جمع‌وجور بدون نیاز به اسکرول
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // پس‌زمینه کلی کارت (سفید)
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // حاشیه دور کارت
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 2;
      ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);

      // هدر صورتی رنگ بالا
      ctx.fillStyle = "#fff1f2";
      ctx.fillRect(12, 12, canvas.width - 24, 115);

      // رسم آیکون سپر (Shield)
      ctx.save();
      ctx.translate(canvas.width / 2, 40);
      ctx.fillStyle = "#e11d48";
      ctx.beginPath();
      ctx.moveTo(0, -16);
      ctx.lineTo(14, -8);
      ctx.lineTo(14, 4);
      ctx.quadraticCurveTo(14, 16, 0, 23);
      ctx.quadraticCurveTo(-14, 16, -14, 4);
      ctx.lineTo(-14, -8);
      ctx.closePath();
      ctx.fill();
      
      // چک‌مارک داخل سپر
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-5, 1);
      ctx.lineTo(-1, 6);
      ctx.lineTo(7, -3);
      ctx.stroke();
      ctx.restore();

      // عنوان اصلی در هدر
      ctx.fillStyle = "#9f1239";
      ctx.font = "bold 20px iranBold, sans-serif";
      ctx.direction = "rtl";
      ctx.textAlign = "center";
      ctx.fillText("کارت امنیتی مهم", canvas.width / 2, 82);

      // متن هشدار زیر عنوان
      ctx.fillStyle = "#e11d48";
      ctx.font = "13px iranSans-r, sans-serif";
      ctx.fillText("حتماً از این کارت اسکرین‌شات بگیرید یا آن را ذخیره کنید!", canvas.width / 2, 108);

      // --- بخش فیلدها با فونت خوانا و بسیار واضح ---
      ctx.textAlign = "right";

      const startX = 500;
      const endX = 100;

      // ۱. نام کودک
      ctx.fillStyle = "#64748b";
      ctx.font = "12px iranSans-r, sans-serif";
      ctx.fillText("نام کودک:", startX, 155);

      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 16px iranBold, sans-serif";
      ctx.fillText(fullName, startX, 178);

      // خط زیرین فیلد اول
      ctx.strokeStyle = "#f1f5f9";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(endX, 192);
      ctx.lineTo(startX, 192);
      ctx.stroke();

      // ۲. سوال محرمانه
      ctx.fillStyle = "#64748b";
      ctx.font = "12px iranSans-r, sans-serif";
      ctx.fillText("سوال محرمانه:", startX, 222);

      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 15px iranBold, sans-serif";
      ctx.fillText("۱. کد ۶ رقمی شخصی | ۲. سه حرف اول بازیکن فوتبال", startX, 245);

      // خط زیرین فیلد دوم
      ctx.beginPath();
      ctx.moveTo(endX, 258);
      ctx.lineTo(startX, 258);
      ctx.stroke();

      // ۳. پاسخ محرمانه (کاملاً واضح و پررنگ)
      ctx.fillStyle = "#64748b";
      ctx.font = "12px iranSans-r, sans-serif";
      ctx.fillText("پاسخ محرمانه:", startX, 288);

      ctx.fillStyle = "#059669";
      ctx.font = "bold 20px iranBold, sans-serif";
      ctx.fillText(`${pin} - ${player.toUpperCase()}`, startX, 315);

      // خط چین پایین بخش پاسخ‌ها
      ctx.strokeStyle = "#cbd5e1";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(endX, 340);
      ctx.lineTo(startX, 340);
      ctx.stroke();
      ctx.setLineDash([]);

      // فوتر کارت با نام درخواستی
      ctx.fillStyle = "#94a3b8";
      ctx.font = "12px iranSans-r, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("سامانه علمی منتظران", canvas.width / 2, 385);

      return canvas.toDataURL("image/png");
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.securityPin.trim() || formData.securityPin.length !== 6) {
      newErrors.securityPin = "کد امنیتی باید دقیقاً یک عدد ۶ رقمی باشد.";
    }

    if (!formData.favoritePlayer.trim() || formData.favoritePlayer.length !== 3) {
      newErrors.favoritePlayer = "لطفاً دقیقاً ۳ حرف انگلیسی از اسم بازیکن وارد کنید.";
    }

    if (!formData.acceptRules) {
      newErrors.rules = "پذیرش قوانین الزامی است.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const cleanPin = formData.securityPin.trim();
      const cleanPlayer = formData.favoritePlayer.trim().toLowerCase();
      const finalSecurityAnswer = `${cleanPin}-${cleanPlayer}`;

      const payload = {
        username: `user_${formData.nationalId}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        nationalId: formData.nationalId,
        phone: formData.phone,
        password: formData.password,
        securityQuestion: "۱. کد ۶ رقمی شخصی | ۲. سه حرف اول بازیکن فوتبال",
        securityAnswer: finalSecurityAnswer,
      };

      const res = await fetch("/api/auth/student/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "خطا در ثبت‌نام دانش‌آموز");
      }

      // تولید و ذخیره تصویر کارت امنیتی در استیت جهت نمایش در UI
      const fullName = `${formData.firstName} ${formData.lastName}`;
      const cardImage = generateSecurityCardDataUrl(
        fullName,
        formData.securityPin,
        formData.favoritePlayer
      );
      setSecurityCardImage(cardImage);

      setStep("security-card");
    } catch (err: any) {
      setErrorMessage(err.message || "ارتباط با سرور برقرار نشد.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveImage = () => {
    if (!securityCardImage) return;
    const link = document.createElement("a");
    link.href = securityCardImage;
    link.download = `security-card-${formData.nationalId}.png`;
    link.click();
  };

  const handleFinish = () => {
    onSuccess?.();
    onClose();
    setStep(1);
    setSecurityCardImage(null);
    setFormData({
      firstName: "",
      lastName: "",
      nationalId: "",
      phone: "",
      password: "",
      confirmPassword: "",
      securityPin: "",
      favoritePlayer: "",
      acceptRules: false,
    });
    router.push("/student/dashboard");
    router.refresh();
  };

  if (!isOpen) return null;

  const stepNumber = typeof step === "number" ? step : 4;
  const progressPercentage = (stepNumber / 4) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" dir="rtl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 25 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 25 }}
        className="relative w-full max-w-[500px] bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl p-6 sm:p-7 z-10 overflow-hidden"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute left-5 top-5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {step !== "security-card" ? (
          <div>
            <div className="mb-5 pt-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                <span>مرحله {step} از 4</span>
                <span>
                  {step === 1 && "اطلاعات فردی"}
                  {step === 2 && "کد ملی و تماس"}
                  {step === 3 && "رمز عبور"}
                  {step === 4 && "امنیت و قوانین"}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full"
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <div className="mb-5 text-right">
              <h2 className="text-xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                ثبت‌نام دانش‌آموز
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">لطفاً اطلاعات خود را دقیق وارد کنید</p>
            </div>

            {errorMessage && (
              <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); handleNextStep(); }}>
              {step === 1 && (
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">نام</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute right-3 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => updateField("firstName", e.target.value)}
                        placeholder="مثال: علی"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-10 pl-3 text-sm text-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    {errors.firstName && <p className="text-rose-500 text-[11px] mt-0.5">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">نام خانوادگی</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute right-3 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => updateField("lastName", e.target.value)}
                        placeholder="مثال: محمدی"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-10 pl-3 text-sm text-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    {errors.lastName && <p className="text-rose-500 text-[11px] mt-0.5">{errors.lastName}</p>}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">کد ملی (۱۰ رقم)</label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 absolute right-3 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        maxLength={10}
                        value={formData.nationalId}
                        onChange={(e) => updateField("nationalId", e.target.value.replace(/\D/g, ""))}
                        placeholder="0012345678"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-10 pl-3 text-sm text-slate-800 dir-ltr text-right focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    {errors.nationalId && <p className="text-rose-500 text-[11px] mt-0.5">{errors.nationalId}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">شماره همراه</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute right-3 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        maxLength={11}
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value.replace(/\D/g, ""))}
                        placeholder="09123456789"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-10 pl-3 text-sm text-slate-800 dir-ltr text-right focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    {errors.phone && <p className="text-rose-500 text-[11px] mt-0.5">{errors.phone}</p>}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">رمز عبور (حداقل ۶ کاراکتر)</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute right-3 top-3.5 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => updateField("password", e.target.value)}
                        placeholder="******"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-10 pl-10 text-sm text-slate-800 dir-ltr text-right focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-rose-500 text-[11px] mt-0.5">{errors.password}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">تکرار رمز عبور</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute right-3 top-3.5 text-slate-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => updateField("confirmPassword", e.target.value)}
                        placeholder="******"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-10 pl-10 text-sm text-slate-800 dir-ltr text-right focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute left-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-rose-500 text-[11px] mt-0.5">{errors.confirmPassword}</p>}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ۱. یک کد ۶ رقمی شخصی و محرمانه (فقط عدد)
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        maxLength={6}
                        value={formData.securityPin}
                        onChange={(e) => updateField("securityPin", e.target.value)}
                        placeholder="مثال: ۷۴۸۵۱۲"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-10 pl-3 text-sm text-slate-800 dir-ltr text-right focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    {errors.securityPin && <p className="text-rose-500 text-[11px] mt-0.5">{errors.securityPin}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ۲. سه حرف اول اسم بازیکن فوتبال مورد علاقه (فقط انگلیسی)
                    </label>
                    <div className="relative">
                      <Trophy className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        maxLength={3}
                        value={formData.favoritePlayer}
                        onChange={(e) => updateField("favoritePlayer", e.target.value)}
                        placeholder="مثال: ron یا mes"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-10 pl-3 text-sm text-slate-800 dir-ltr text-right uppercase focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    {errors.favoritePlayer && <p className="text-rose-500 text-[11px] mt-0.5">{errors.favoritePlayer}</p>}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="rules"
                      checked={formData.acceptRules}
                      onChange={(e) => updateField("acceptRules", e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                    />
                    <label htmlFor="rules" className="text-xs text-slate-600 cursor-pointer">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsRulesModalOpen(true);
                        }}
                        className="text-emerald-600 font-bold hover:underline inline mx-1 cursor-pointer"
                      >
                        قوانین و شرایط استفاده از سامانه
                      </button>
                      را مطالعه کرده‌ام و می‌پذیرم.
                    </label>
                  </div>
                  {errors.rules && <p className="text-rose-500 text-[11px]">{errors.rules}</p>}
                </div>
              )}

              <div className="flex gap-3 mt-5">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all text-sm cursor-pointer"
                  >
                    مرحله قبل
                  </button>
                )}
                <button
                  type={step === 4 ? "submit" : "button"}
                  onClick={step === 4 ? undefined : handleNextStep}
                  disabled={loading}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? "در حال ثبت‌نام..." : step === 4 ? "تکمیل ثبت‌نام" : "مرحله بعد"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            {/* نمایش تصویر تولید شده کارت امنیتی بدون نیاز به اسکرول و بسیار واضح */}
            {securityCardImage && (
              <div className="flex justify-center">
                <img
                  src={securityCardImage}
                  alt="Security Card"
                  className="w-full max-w-[440px] rounded-2xl shadow-md border border-slate-200"
                />
              </div>
            )}

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleSaveImage}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                <Download className="w-4 h-4" /> ذخیره عکس در گالری
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-1.5 text-xs sm:text-sm cursor-pointer"
              >
                <span>اسکرین‌شات گرفتم / ورود</span> <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {onSwitchToLogin && step !== "security-card" && (
          <div className="mt-4 pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
            قبلاً ثبت‌نام کرده‌اید؟{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-emerald-600 font-extrabold hover:underline mr-1 cursor-pointer"
            >
              وارد شوید
            </button>
          </div>
        )}
      </motion.div>

      {/* اتصال کامل مودال قوانین و شرایط */}
      <RulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
        onAccept={() => {
          setFormData((prev) => ({ ...prev, acceptRules: true }));
          setIsRulesModalOpen(false);
        }}
      />
    </div>
  );
}