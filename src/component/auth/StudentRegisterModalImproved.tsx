// components/auth/StudentRegisterModalImproved.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import RulesModal from "./StudentRegisterModal/RulesModal";
import { isValidNationalId } from "./StudentRegisterModal/constants";
import { StepIndicator } from "./StudentRegisterModal/StepIndicator";
import { StepContent } from "./StudentRegisterModal/StepContent";
import { StatusMessage } from "./StudentRegisterModal/StatusMessage";
import { SecurityCardModal } from "./StudentRegisterModal/SecurityCardModal";

export const SECURITY_QUESTIONS = [
  "کلمه مهم شخصی",
  "عدد مهم شخصی",
  "نام اولین کتاب غیردرسی که خواندید؟",
  "کد پستی یا شماره پلاک اولین خانه‌ای که یادش هستید؟",
  "نام سریالی که حداقل ۲ بار کامل آن را دیده‌اید؟",
  "اسم عجیب‌ترین یا غافلگیرکننده‌ترین هدیه‌ای که گرفتید؟",
];

interface StudentRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function StudentRegisterModalImproved({
  isOpen,
  onClose,
  onSwitchToLogin,
}: StudentRegisterModalProps) {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nationalId: "",
    phone: "",
    password: "",
    confirmPassword: "",
    securityQuestion: SECURITY_QUESTIONS[0],
    securityAnswer: "",
    acceptRules: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSecurityNotice, setShowSecurityNotice] = useState(false);
  const [savedDataForNotice, setSavedDataForNotice] = useState<{
    fullName: string;
    question: string;
    answer: string;
    nationalId: string;
  } | null>(null);

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    nationalId: "",
    phone: "",
    password: "",
    confirmPassword: "",
    securityAnswer: "",
    rules: "",
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validation logic for each field
    switch (field) {
      case "firstName":
        if (!value.trim()) {
          setErrors(prev => ({ ...prev, firstName: "نام الزامی است." }));
        } else if (!/^[\u0600-\u06FF\s]{2,30}$/.test(value.trim())) {
          setErrors(prev => ({ ...prev, firstName: "فقط حروف فارسی مجاز است." }));
        } else {
          setErrors(prev => ({ ...prev, firstName: "" }));
        }
        break;
      case "lastName":
        if (!value.trim()) {
          setErrors(prev => ({ ...prev, lastName: "نام خانوادگی الزامی است." }));
        } else if (!/^[\u0600-\u06FF\s]{2,30}$/.test(value.trim())) {
          setErrors(prev => ({ ...prev, lastName: "فقط حروف فارسی مجاز است." }));
        } else {
          setErrors(prev => ({ ...prev, lastName: "" }));
        }
        break;
      case "nationalId":
        const cleaned = value.replace(/\D/g, "");
        setFormData(prev => ({ ...prev, nationalId: cleaned }));
        if (!cleaned) {
          setErrors(prev => ({ ...prev, nationalId: "کد ملی الزامی است." }));
        } else if (cleaned.length < 10) {
          setErrors(prev => ({ ...prev, nationalId: "کد ملی باید ۱۰ رقم باشد." }));
        } else if (!isValidNationalId(cleaned)) {
          setErrors(prev => ({ ...prev, nationalId: "کد ملی وارد شده نامعتبر است." }));
        } else {
          setErrors(prev => ({ ...prev, nationalId: "" }));
        }
        return;
      case "phone":
        const phoneCleaned = value.replace(/\D/g, "");
        setFormData(prev => ({ ...prev, phone: phoneCleaned }));
        if (!phoneCleaned) {
          setErrors(prev => ({ ...prev, phone: "شماره تماس الزامی است." }));
        } else if (!/^09[0-9]{9}$/.test(phoneCleaned)) {
          setErrors(prev => ({ ...prev, phone: "باید با 09 شروع شده و ۱۱ رقم باشد." }));
        } else {
          setErrors(prev => ({ ...prev, phone: "" }));
        }
        return;
      case "password":
        if (!value) {
          setErrors(prev => ({ ...prev, password: "رمز عبور الزامی است." }));
        } else if (value.length < 6 || value.length > 8) {
          setErrors(prev => ({ ...prev, password: "رمز عبور باید بین ۶ تا ۸ کاراکتر باشد." }));
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(value)) {
          setErrors(prev => ({ ...prev, password: "باید شامل حروف بزرگ، کوچک و عدد باشد." }));
        } else {
          setErrors(prev => ({ ...prev, password: "" }));
        }
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          setErrors(prev => ({ ...prev, confirmPassword: "تکرار رمز عبور مطابقت ندارد." }));
        } else {
          setErrors(prev => ({ ...prev, confirmPassword: "" }));
        }
        break;
      case "confirmPassword":
        if (value !== formData.password) {
          setErrors(prev => ({ ...prev, confirmPassword: "تکرار رمز عبور مطابقت ندارد." }));
        } else {
          setErrors(prev => ({ ...prev, confirmPassword: "" }));
        }
        break;
      case "securityAnswer":
        if (!value.trim()) {
          setErrors(prev => ({ ...prev, securityAnswer: "ورود کلمه شخصی الزامی است." }));
        } else if (/\s/.test(value)) {
          setErrors(prev => ({ ...prev, securityAnswer: "استفاده از فاصله (Space) مجاز نیست." }));
        } else if (!/^[a-zA-Z0-9\u0600-\u06FF]+$/.test(value)) {
          setErrors(prev => ({ ...prev, securityAnswer: "فقط حروف و اعداد (بدون نماد و علامت‌ها) مجاز است." }));
        } else if (value.length < 2 || value.length > 30) {
          setErrors(prev => ({ ...prev, securityAnswer: "کلمه شخصی باید بین ۲ تا ۳۰ کاراکتر باشد." }));
        } else {
          setErrors(prev => ({ ...prev, securityAnswer: "" }));
        }
        break;
      case "acceptRules":
        if (value) setErrors(prev => ({ ...prev, rules: "" }));
        break;
    }
  };

  const canGoToStep2 = () => {
    return formData.firstName.trim().length >= 2 && 
           formData.lastName.trim().length >= 2 && 
           !errors.firstName && 
           !errors.lastName;
  };

  const canGoToStep3 = () => {
    return formData.nationalId.length === 10 && 
           isValidNationalId(formData.nationalId) && 
           /^09[0-9]{9}$/.test(formData.phone) && 
           !errors.nationalId && 
           !errors.phone;
  };

  const canGoToStep4 = () => {
    return formData.password.length >= 6 &&
           formData.password.length <= 8 &&
           /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(formData.password) &&
           formData.password === formData.confirmPassword &&
           !errors.password &&
           !errors.confirmPassword;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        setErrors(prev => ({
          ...prev,
          firstName: !formData.firstName.trim() ? "نام الزامی است." : "",
          lastName: !formData.lastName.trim() ? "نام خانوادگی الزامی است." : "",
        }));
        return;
      }
      if (canGoToStep2()) setStep(2);
    } else if (step === 2) {
      if (!formData.nationalId || !formData.phone) {
        setErrors(prev => ({
          ...prev,
          nationalId: !formData.nationalId ? "کد ملی الزامی است." : "",
          phone: !formData.phone ? "شماره تماس الزامی است." : "",
        }));
        return;
      }
      if (canGoToStep3()) setStep(3);
    } else if (step === 3) {
      if (!formData.password || !formData.confirmPassword) {
        setErrors(prev => ({
          ...prev,
          password: !formData.password ? "رمز عبور الزامی است." : "",
          confirmPassword: !formData.confirmPassword ? "تکرار رمز عبور الزامی است." : "",
        }));
        return;
      }
      if (canGoToStep4()) setStep(4);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(prev => (prev - 1) as 1 | 2 | 3 | 4);
  };

  const handleResetAndClose = () => {
    if (status === "loading") return;
    setStep(1);
    setFormData({
      firstName: "",
      lastName: "",
      nationalId: "",
      phone: "",
      password: "",
      confirmPassword: "",
      securityQuestion: SECURITY_QUESTIONS[0],
      securityAnswer: "",
      acceptRules: false,
    });
    setErrors({
      firstName: "",
      lastName: "",
      nationalId: "",
      phone: "",
      password: "",
      confirmPassword: "",
      securityAnswer: "",
      rules: "",
    });
    setStatus("idle");
    setErrorMessage("");
    setShowSecurityNotice(false);
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        if (isRulesModalOpen) setIsRulesModalOpen(false);
        else if (!showSecurityNotice) handleResetAndClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, status, isRulesModalOpen, showSecurityNotice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.securityAnswer || errors.securityAnswer) {
      setErrors(prev => ({ ...prev, securityAnswer: prev.securityAnswer || "لطفا کلمه شخصی معتبر وارد کنید." }));
      return;
    }

    if (!formData.acceptRules) {
      setErrors(prev => ({ ...prev, rules: "پذیرش قوانین الزامی است." }));
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/student/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: `user_${formData.nationalId}`,
          firstName: formData.firstName,
          lastName: formData.lastName,
          nationalId: formData.nationalId,
          phone: formData.phone,
          password: formData.password,
          securityQuestion: formData.securityQuestion,
          securityAnswer: formData.securityAnswer,
        }),
      });

      const data = await res.json();

      if (res.status === 409) {
        setStatus("error");
        if (data.field === "nationalId") {
          setStep(2);
          setErrors(prev => ({ ...prev, nationalId: data.message }));
        } else if (data.field === "phone") {
          setStep(2);
          setErrors(prev => ({ ...prev, phone: data.message }));
        }
        setErrorMessage(data.message || "اطلاعات وارد شده تکراری است.");
        return;
      }

      if (res.ok && data.success) {
        setStatus("success");
        localStorage.setItem("studentNationalId", formData.nationalId);
        localStorage.setItem("studentPhone", formData.phone);

        setSavedDataForNotice({
          fullName: `${formData.firstName} ${formData.lastName}`,
          question: formData.securityQuestion,
          answer: formData.securityAnswer,
          nationalId: formData.nationalId,
        });

        setTimeout(() => setShowSecurityNotice(true), 600);
      } else {
        setStatus("error");
        setErrorMessage(data.message || "خطایی در ثبت‌نام رخ داد.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage("ارتباط با سرور برقرار نشد.");
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" dir="rtl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleResetAndClose}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 25 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 25 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
              className="relative w-full max-w-[540px] max-h-[90vh] overflow-y-auto 
                bg-gradient-to-b from-white via-white to-slate-50/90 
                border border-white/80 rounded-[2.5rem] shadow-2xl shadow-slate-900/20 
                p-2 sm:p-3 z-10
                [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-slate-300
                [&::-webkit-scrollbar-thumb]:rounded-full"
            >
              <div className="p-5 sm:p-7 relative">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  disabled={status === "loading"}
                  className="absolute left-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2.5 rounded-full transition-all duration-200 shadow-sm cursor-pointer z-20"
                >
                  <X className="w-4 h-4" />
                </button>

                <StepIndicator step={step} />

                <div className="mb-6 text-right">
                  <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent font-[iranBold]">
                    ثبت‌نام دانش‌آموز
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 font-[iranSans-r]">
                    لطفاً اطلاعات خود را دقیق وارد کنید
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <StepContent
                    step={step}
                    formData={formData}
                    errors={errors}
                    showPassword={showPassword}
                    showConfirmPassword={showConfirmPassword}
                    onFieldChange={updateField}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                    onToggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
                    onNext={handleNextStep}
                    onPrev={handlePrevStep}
                    onViewRules={() => setIsRulesModalOpen(true)}
                    isNextLoading={status === "loading"}
                    securityQuestions={SECURITY_QUESTIONS}
                  />
                </form>

                {status === "error" && (
                  <StatusMessage type="error" message={errorMessage} />
                )}

                <div className="mt-6 pt-4 border-t border-slate-100 text-center text-sm text-slate-500 font-[iranSans-r]">
                  قبلاً ثبت‌نام کرده‌اید؟{" "}
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="text-emerald-600 font-extrabold hover:underline mr-1 cursor-pointer font-[iranBold]"
                  >
                    وارد شوید
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {showSecurityNotice && savedDataForNotice && (
        <SecurityCardModal
          data={savedDataForNotice}
          onConfirm={() => {
            handleResetAndClose();
            router.push("/student/dashboard");
            router.refresh();
          }}
        />
      )}

      <RulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
        onAccept={() => {
          updateField("acceptRules", true);
          setErrors(prev => ({ ...prev, rules: "" }));
          setIsRulesModalOpen(false);
        }}
      />
    </>
  );
}