// components/auth/StudentRegisterModal.tsx
"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { X, Download, ArrowLeft, Loader2 } from "lucide-react";

import { StepOnePersonal } from "./student-register/StepOnePersonal";
import { StepTwoContact } from "./student-register/StepTwoContact";
import { StepThreePassword } from "./student-register/StepThreePassword";
import { StepFourSecurity } from "./student-register/StepFourSecurity";

const toEnglishDigits = (str: string): string => {
  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
  const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
  let converted = str;
  for (let i = 0; i < 10; i++) {
    converted = converted
      .replace(persianNumbers[i], i.toString())
      .replace(arabicNumbers[i], i.toString());
  }
  return converted.replace(/\D/g, "");
};

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
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4 | "security-card">(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [securityCardImage, setSecurityCardImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
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

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleResetAndClose = () => {
    if (loading) return;
    setStep(1);
    setLoading(false);
    setErrorMessage("");
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
    setErrors({});
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !loading) {
        handleResetAndClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading]);

  const updateField = (field: string, value: string | boolean) => {
    let processedValue = value;
    if (field === "nationalId" && typeof value === "string") {
      processedValue = toEnglishDigits(value).slice(0, 10);
    } else if (field === "phone" && typeof value === "string") {
      processedValue = toEnglishDigits(value).slice(0, 11);
    } else if (field === "securityPin" && typeof value === "string") {
      processedValue = toEnglishDigits(value).slice(0, 6);
    } else if (field === "favoritePlayer" && typeof value === "string") {
      processedValue = value.replace(/[^A-Za-z]/g, "").slice(0, 3);
    }

    setFormData((prev) => ({ ...prev, [field]: processedValue }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
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
      setErrors({});
      setStep(2);
    } else if (step === 2) {
      if (!isValidNationalId(formData.nationalId) || !/^09[0-9]{9}$/.test(formData.phone)) {
        setErrors({
          nationalId: !isValidNationalId(formData.nationalId) ? "کد ملی نامعتبر است." : "",
          phone: !/^09[0-9]{9}$/.test(formData.phone) ? "شماره همراه نامعتبر است." : "",
        });
        return;
      }
      setErrors({});
      setStep(3);
    } else if (step === 3) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,8}$/;
      if (!passwordRegex.test(formData.password) || formData.password !== formData.confirmPassword) {
        setErrors({
          password: !passwordRegex.test(formData.password)
            ? "رمز عبور بین ۶ تا ۸ کاراکتر و شامل حروف بزرگ، کوچک و عدد انگلیسی باشد."
            : "",
          confirmPassword: formData.password !== formData.confirmPassword ? "تکرار رمز عبور مطابقت ندارد." : "",
        });
        return;
      }
      setErrors({});
      setStep(4);
    }
  };

  const handlePrevStep = () => {
    const numericStep = Number(step);
    if (!isNaN(numericStep) && numericStep > 1) {
      setStep((numericStep - 1) as 1 | 2 | 3 | 4);
    }
  };

  const generateSecurityCardDataUrl = (fullName: string, pin: string, player: string): string => {
    const canvas = document.createElement("canvas");
    canvas.width = 750;
    canvas.height = 500;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 3;
      ctx.strokeRect(16, 16, canvas.width - 32, canvas.height - 32);

      ctx.fillStyle = "#fff1f2";
      ctx.fillRect(16, 16, canvas.width - 32, 130);

      ctx.fillStyle = "#9f1239";
      ctx.font = "bold 24px Vazirmatn, IRANSans, Tahoma, sans-serif";
      ctx.direction = "rtl";
      ctx.textAlign = "center";
      ctx.fillText("کارت امنیتی محرمانه - سامانه علمی منتظران", canvas.width / 2, 85);

      const startX = 670;
      const endX = 80;

      ctx.textAlign = "right";
      ctx.fillStyle = "#475569";
      ctx.font = "15px Vazirmatn, IRANSans, Tahoma, sans-serif";
      ctx.fillText("نام و نام خانوادگی دانش‌آموز:", startX, 185);

      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 20px Vazirmatn, IRANSans, Tahoma, sans-serif";
      ctx.fillText(fullName, startX, 218);

      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(endX, 245);
      ctx.lineTo(startX, 245);
      ctx.stroke();

      ctx.fillStyle = "#475569";
      ctx.font = "15px Vazirmatn, IRANSans, Tahoma, sans-serif";
      ctx.fillText("پاسخ‌های امنیتی شما (کد پین - بازیکن):", startX, 305);

      ctx.fillStyle = "#059669";
      ctx.font = "bold 26px monospace, sans-serif";
      ctx.fillText(`${pin}   -   ${player.toUpperCase()}`, startX, 345);

      ctx.fillStyle = "#dc2626";
      ctx.font = "bold 13px Vazirmatn, IRANSans, Tahoma, sans-serif";
      ctx.fillText(
        "⚠️ توجه: این اطلاعات را در جای امنی ذخیره کنید؛ برای بازیابی حساب به آن نیاز خواهید داشت.",
        startX,
        425
      );

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

      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        nationalId: formData.nationalId.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        securityQuestion: "کد ۶ رقمی و سه حرف بازیکن",
        securityAnswer: `${formData.securityPin.trim()}${formData.favoritePlayer.trim().toLowerCase()}`,
      };

      const res = await fetch("/api/auth/student/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        if (formData.nationalId) {
          localStorage.setItem("studentNationalId", formData.nationalId.trim());
        }
        localStorage.setItem("studentPhone", formData.phone.trim());

        const cardImage = generateSecurityCardDataUrl(
          `${formData.firstName} ${formData.lastName}`,
          formData.securityPin,
          formData.favoritePlayer
        );
        setSecurityCardImage(cardImage);
        setStep("security-card");
      } else {
        throw new Error(data?.message || data?.error || "خطا در ثبت‌نام دانش‌آموز");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید.");
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
    handleResetAndClose();
    router.push("/student/dashboard");
    router.refresh();
  };

  if (!mounted || !isOpen) return null;

  const stepNumber = typeof step === "number" ? step : 4;
  const progressPercentage = (stepNumber / 4) * 100;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-[iranSans-r]" dir="rtl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleResetAndClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 25 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 25 }}
          className={`relative w-full ${
            step === "security-card" ? "max-w-[480px]" : "max-w-[540px]"
          } bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl p-5 sm:p-6 z-10 my-auto ${
            step === "security-card" ? "overflow-hidden" : "max-h-[90vh] overflow-y-auto"
          }`}
        >
          <button
            type="button"
            onClick={handleResetAndClose}
            disabled={loading}
            className="absolute left-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-all cursor-pointer z-20"
            aria-label="بستن"
          >
            <X className="w-4 h-4" />
          </button>

          {step !== "security-card" ? (
            <div>
              <div className="mb-5 pt-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                  <span>مرحله {step} از ۴</span>
                  <span>
                    {step === 1
                      ? "اطلاعات فردی"
                      : step === 2
                      ? "کد ملی و تماس"
                      : step === 3
                      ? "رمز عبور"
                      : "امنیت و قوانین"}
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
                <h2 className="text-xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent font-[iranBold]">
                  ثبت‌نام دانش‌آموز
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">لطفاً اطلاعات خود را دقیق وارد کنید</p>
              </div>

              {errorMessage && (
                <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              <form
                onSubmit={
                  step === 4
                    ? handleSubmit
                    : (e) => {
                        e.preventDefault();
                        handleNextStep();
                      }
                }
              >
                {step === 1 && <StepOnePersonal formData={formData} errors={errors} updateField={updateField} />}
                {step === 2 && <StepTwoContact formData={formData} errors={errors} updateField={updateField} />}
                {step === 3 && <StepThreePassword formData={formData} errors={errors} updateField={updateField} />}
                {step === 4 && (
                  <StepFourSecurity
                    formData={formData}
                    errors={errors}
                    updateField={updateField}
                    onOpenRules={() => setIsRulesModalOpen(true)}
                  />
                )}

                <div className="flex gap-3 mt-5">
                  {Number(step) > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      disabled={loading}
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
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>در حال ثبت‌نام...</span>
                      </>
                    ) : step === 4 ? (
                      "تکمیل ثبت‌نام"
                    ) : (
                      "مرحله بعد"
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="text-center space-y-3 pt-1">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3.5 rounded-2xl text-white text-base sm:text-lg font-bold flex items-center justify-center gap-2.5 shadow-lg shadow-amber-500/20 tracking-wide font-[iranBold]">
                <span>حتماً از کارتت عکس بگیر!</span>
              </div>

              {securityCardImage && (
                <div className="flex justify-center my-1">
                  <img
                    src={securityCardImage}
                    alt="کارت امنیتی"
                    className="rounded-xl shadow-md border border-slate-200 max-h-[220px] w-auto object-contain"
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSaveImage}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  ذخیره در گالری
                </button>

                <button
                  type="button"
                  onClick={handleFinish}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>عکس گرفتم / ورود</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {onSwitchToLogin && step !== "security-card" && (
            <div className="mt-4 pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
              قبلاً ثبت‌نام کرده‌اید؟{" "}
              <button
                type="button"
                onClick={() => {
                  handleResetAndClose();
                  onSwitchToLogin();
                }}
                className="text-emerald-600 font-extrabold hover:underline mr-1 cursor-pointer font-[iranBold]"
              >
                وارد شوید
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}