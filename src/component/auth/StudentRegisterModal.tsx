// Student registration modal
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";
import RegisterForm from "./StudentRegisterModal/RegisterForm";
import RulesModal from "./StudentRegisterModal/RulesModal";
import { isValidNationalId } from "./StudentRegisterModal/constants";

interface StudentRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function StudentRegisterModal({
  isOpen,
  onClose,
  onSwitchToLogin,
}: StudentRegisterModalProps) {
  const router = useRouter();

  // Form state
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptRules, setAcceptRules] = useState(false);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Errors state
  const [errors, setErrors] = useState({
    username: "",
    firstName: "",
    lastName: "",
    nationalId: "",
    phone: "",
    password: "",
    confirmPassword: "",
    rules: "",
  });

  // Reset form
  const handleResetAndClose = () => {
    if (status === "loading") return;
    setUsername("");
    setFirstName("");
    setLastName("");
    setNationalId("");
    setPhone("");
    setPassword("");
    setConfirmPassword("");
    setAcceptRules(false);
    setErrors({
      username: "",
      firstName: "",
      lastName: "",
      nationalId: "",
      phone: "",
      password: "",
      confirmPassword: "",
      rules: "",
    });
    setStatus("idle");
    setErrorMessage("");
    onClose();
  };

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        if (isRulesModalOpen) setIsRulesModalOpen(false);
        else handleResetAndClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, status, isRulesModalOpen]);

  // Validation handlers
  const handleUsernameChange = (val: string) => {
    const cleaned = val.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    setUsername(cleaned);
    if (!cleaned) {
      setErrors((prev) => ({ ...prev, username: "نام کاربری الزامی است." }));
    } else if (cleaned.length < 3 || cleaned.length > 15) {
      setErrors((prev) => ({ ...prev, username: "باید بین ۳ تا ۱۵ کاراکتر باشد." }));
    } else {
      setErrors((prev) => ({ ...prev, username: "" }));
    }
  };

  const handleFirstNameChange = (val: string) => {
    setFirstName(val);
    if (!val.trim()) {
      setErrors((prev) => ({ ...prev, firstName: "نام الزامی است." }));
    } else if (!/^[\u0600-\u06FF\s]{2,30}$/.test(val.trim())) {
      setErrors((prev) => ({ ...prev, firstName: "فقط حروف فارسی مجاز است." }));
    } else {
      setErrors((prev) => ({ ...prev, firstName: "" }));
    }
  };

  const handleLastNameChange = (val: string) => {
    setLastName(val);
    if (!val.trim()) {
      setErrors((prev) => ({ ...prev, lastName: "نام خانوادگی الزامی است." }));
    } else if (!/^[\u0600-\u06FF\s]{2,30}$/.test(val.trim())) {
      setErrors((prev) => ({ ...prev, lastName: "فقط حروف فارسی مجاز است." }));
    } else {
      setErrors((prev) => ({ ...prev, lastName: "" }));
    }
  };

  const handleNationalIdChange = (val: string) => {
    const cleaned = val.replace(/\D/g, "");
    setNationalId(cleaned);
    if (!cleaned) {
      setErrors((prev) => ({ ...prev, nationalId: "کد ملی الزامی است." }));
    } else if (cleaned.length < 10) {
      setErrors((prev) => ({ ...prev, nationalId: "کد ملی باید ۱۰ رقم باشد." }));
    } else if (!isValidNationalId(cleaned)) {
      setErrors((prev) => ({ ...prev, nationalId: "کد ملی وارد شده نامعتبر است." }));
    } else {
      setErrors((prev) => ({ ...prev, nationalId: "" }));
    }
  };

  const handlePhoneChange = (val: string) => {
    const cleaned = val.replace(/\D/g, "");
    setPhone(cleaned);
    const phoneRegex = /^09[0-9]{9}$/;
    if (!cleaned) {
      setErrors((prev) => ({ ...prev, phone: "شماره تماس الزامی است." }));
    } else if (!phoneRegex.test(cleaned)) {
      setErrors((prev) => ({ ...prev, phone: "باید با 09 شروع شده و ۱۱ رقم باشد." }));
    } else {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (!val) {
      setErrors((prev) => ({ ...prev, password: "رمز عبور الزامی است." }));
    } else if (val.length < 6 || val.length > 8) {
      setErrors((prev) => ({ ...prev, password: "رمز عبور باید بین ۶ تا ۸ کاراکتر باشد." }));
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(val)) {
      setErrors((prev) => ({ ...prev, password: "باید شامل حروف بزرگ، کوچک و عدد باشد." }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }

    if (confirmPassword && val !== confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "تکرار رمز عبور مطابقت ندارد." }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  const handleConfirmPasswordChange = (val: string) => {
    setConfirmPassword(val);
    if (val !== password) {
      setErrors((prev) => ({ ...prev, confirmPassword: "تکرار رمز عبور مطابقت ندارد." }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  const handleAcceptRulesChange = (checked: boolean) => {
    setAcceptRules(checked);
    if (checked) setErrors((prev) => ({ ...prev, rules: "" }));
  };

  // Validate all fields
  const validateAll = () => {
    const newErrors = {
      username: !username ? "نام کاربری الزامی است." : username.length < 3 ? "باید حداقل ۳ کاراکتر باشد." : "",
      firstName: !firstName.trim() ? "نام الزامی است." : "",
      lastName: !lastName.trim() ? "نام خانوادگی الزامی است." : "",
      nationalId: !nationalId ? "کد ملی الزامی است." : !isValidNationalId(nationalId) ? "کد ملی نامعتبر است." : "",
      phone: !phone ? "شماره تماس الزامی است." : !/^09[0-9]{9}$/.test(phone) ? "شماره تماس نامعتبر است." : "",
      password: !password ? "رمز عبور الزامی است." : password.length < 6 ? "رمز عبور کوتاه است." : "",
      confirmPassword: password !== confirmPassword ? "تکرار رمز عبور مطابقت ندارد." : "",
      rules: !acceptRules ? "پذیرش قوانین الزامی است." : "",
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((err) => err === "");
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll() || status === "loading") return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/student/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, firstName, lastName, nationalId, phone, password }),
      });

      const data = await res.json();

      if (res.status === 409) {
        setStatus("error");
        if (data.field === "username") {
          setErrors((prev) => ({ ...prev, username: data.message }));
        } else if (data.field === "nationalId") {
          setErrors((prev) => ({ ...prev, nationalId: data.message }));
        } else if (data.field === "phone") {
          setErrors((prev) => ({ ...prev, phone: data.message }));
        }
        setErrorMessage(data.message || "اطلاعات وارد شده تکراری است.");
        return;
      }

      if (res.ok && data.success) {
        setStatus("success");
        if (nationalId) localStorage.setItem("studentNationalId", nationalId);
        if (phone) localStorage.setItem("studentPhone", phone);

        setTimeout(() => {
          onClose();
          router.push(data.redirectTo || "/student/dashboard");
          router.refresh();
        }, 1200);
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
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleResetAndClose}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />

            {/* Modal Box with inner wrapper to keep scrollbar inside borders */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 25 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 25 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
              className="relative w-full max-w-[540px] max-h-[90vh] overflow-y-auto overflow-x-hidden 
                bg-gradient-to-b from-white via-white to-slate-50/90 
                border border-white/80 rounded-[2.5rem] shadow-2xl shadow-slate-900/20 
                p-2 sm:p-3 z-10
                [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-slate-300
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb]:hover:bg-slate-400
                scrollbar-thin
                scrollbar-thumb-slate-300
                hover:scrollbar-thumb-slate-400"
            >
              {/* Inner wrapper providing correct padding so scrollbar stays inside */}
              <div className="p-5 sm:p-7 relative">
                {/* Close button */}
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  disabled={status === "loading"}
                  className="absolute left-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2.5 rounded-full transition-all duration-200 shadow-sm cursor-pointer z-20"
                  aria-label="بستن"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Header with gradient text */}
                <div className="mb-7 text-right">
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-[textGradient_4s_ease_infinite] font-[iranBold]">
                    ثبت‌نام دانش‌آموز
                  </h2>
                  <p className="text-sm sm:text-base text-slate-500 mt-2 font-[iranSans-r]">
                    لطفاً اطلاعات خود را با دقت وارد کنید تا حساب کاربری شما فعال شود.
                  </p>
                </div>

                {/* Form */}
                <RegisterForm
                  username={username}
                  firstName={firstName}
                  lastName={lastName}
                  nationalId={nationalId}
                  phone={phone}
                  password={password}
                  confirmPassword={confirmPassword}
                  acceptRules={acceptRules}
                  showPassword={showPassword}
                  showConfirmPassword={showConfirmPassword}
                  status={status}
                  errors={errors}
                  onUsernameChange={handleUsernameChange}
                  onFirstNameChange={handleFirstNameChange}
                  onLastNameChange={handleLastNameChange}
                  onNationalIdChange={handleNationalIdChange}
                  onPhoneChange={handlePhoneChange}
                  onPasswordChange={handlePasswordChange}
                  onConfirmPasswordChange={handleConfirmPasswordChange}
                  onAcceptRulesChange={handleAcceptRulesChange}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  onToggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
                  onOpenRules={() => setIsRulesModalOpen(true)}
                  onSubmit={handleSubmit}
                  onClose={handleResetAndClose}
                />

                {/* Status messages */}
                {status === "success" && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 shadow-sm animate-fadeIn mt-4">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-xs sm:text-sm font-bold font-[iranSans-r]">
                      ثبت‌نام با موفقیت انجام شد. در حال انتقال...
                    </span>
                  </div>
                )}

                {status === "error" && (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-800 shadow-sm animate-fadeIn mt-4">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                    <span className="text-xs sm:text-sm font-bold font-[iranSans-r]">
                      {errorMessage}
                    </span>
                  </div>
                )}

                {/* Switch to login */}
                <div className="mt-7 pt-4 border-t border-slate-100 text-center text-sm sm:text-base text-slate-500 font-[iranSans-r]">
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

      {/* Rules modal */}
      <RulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
        onAccept={() => {
          setAcceptRules(true);
          setErrors((prev) => ({ ...prev, rules: "" }));
          setIsRulesModalOpen(false);
        }}
      />
    </>
  );
}