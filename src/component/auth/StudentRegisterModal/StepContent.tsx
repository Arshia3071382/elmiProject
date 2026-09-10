"use client";

import { motion } from "framer-motion";
import { User, CreditCard, Phone, Lock, BookOpen } from "lucide-react";
import { FormInput } from "./FormInput";
import PasswordStrength from "./PasswordStrength"; // اصلاح شد: به صورت Default Import
import { RulesCheckbox } from "./RulesCheckbox";
import { NavigationButtons } from "./NavigationButtons ";

interface StepContentProps {
  step: 1 | 2 | 3 | 4;
  formData: {
    firstName: string;
    lastName: string;
    nationalId: string;
    phone: string;
    password: string;
    confirmPassword: string;
    securityQuestion: string;
    securityAnswer: string;
    acceptRules: boolean;
  };
  errors: Record<string, string>;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onFieldChange: (field: string, value: any) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
  onNext: () => void;
  onPrev: () => void;
  onViewRules: () => void;
  isNextLoading?: boolean;
  securityQuestions: string[];
}

export const StepContent = ({
  step,
  formData,
  errors,
  showPassword,
  showConfirmPassword,
  onFieldChange,
  onTogglePassword,
  onToggleConfirmPassword,
  onNext,
  onPrev,
  onViewRules,
  isNextLoading = false,
  securityQuestions,
}: StepContentProps) => {
  const renderStep1 = () => (
    <>
      <FormInput
        label="نام"
        value={formData.firstName}
        onChange={(e) => onFieldChange("firstName", e.target.value)}
        placeholder="مثال: علی"
        error={errors.firstName}
        icon={User}
      />
      <FormInput
        label="نام خانوادگی"
        value={formData.lastName}
        onChange={(e) => onFieldChange("lastName", e.target.value)}
        placeholder="مثال: محمدی"
        error={errors.lastName}
        icon={User}
      />
      <NavigationButtons onNext={onNext} showPrev={false} />
    </>
  );

  const renderStep2 = () => (
    <>
      <FormInput
        label="کد ملی (۱۰ رقم)"
        value={formData.nationalId}
        onChange={(e) => onFieldChange("nationalId", e.target.value)}
        placeholder="مثال: 0012345678"
        error={errors.nationalId}
        icon={CreditCard}
        maxLength={10}
        dir="ltr"
      />
      <FormInput
        label="شماره همراه"
        value={formData.phone}
        onChange={(e) => onFieldChange("phone", e.target.value)}
        placeholder="مثال: 09123456789"
        error={errors.phone}
        icon={Phone}
        maxLength={11}
        dir="ltr"
      />
      <NavigationButtons onPrev={onPrev} onNext={onNext} />
    </>
  );

  const renderStep3 = () => (
    <>
      <FormInput
        label="رمز عبور (۶ تا ۸ کاراکتر)"
        type={showPassword ? "text" : "password"}
        value={formData.password}
        onChange={(e) => onFieldChange("password", e.target.value)}
        placeholder="******"
        error={errors.password}
        icon={Lock}
        maxLength={8}
        dir="ltr"
        showToggle
        onToggleShow={onTogglePassword}
        isShowing={showPassword}
      />
      <PasswordStrength password={formData.password} />
      <FormInput
        label="تکرار رمز عبور"
        type={showConfirmPassword ? "text" : "password"}
        value={formData.confirmPassword}
        onChange={(e) => onFieldChange("confirmPassword", e.target.value)}
        placeholder="******"
        error={errors.confirmPassword}
        icon={Lock}
        maxLength={8}
        dir="ltr"
        showToggle
        onToggleShow={onToggleConfirmPassword}
        isShowing={showConfirmPassword}
      />
      <NavigationButtons onPrev={onPrev} onNext={onNext} />
    </>
  );

  const renderStep4 = () => (
    <>
     
      <FormInput
        label="کلمه مهم شخصی (پاسخ سوال)"
        value={formData.securityAnswer}
        onChange={(e) => onFieldChange("securityAnswer", e.target.value)}
        placeholder="پاسخ را بدون فاصله وارد کنید"
        error={errors.securityAnswer}
        icon={BookOpen}
      />
      {!errors.securityAnswer && formData.securityAnswer && (
        <p className="text-emerald-500 text-[11px] -mt-2 font-[IRANSans] flex items-center gap-1">
          ✓ کلمه شخصی معتبر است
        </p>
      )}
      <RulesCheckbox
        checked={formData.acceptRules}
        onChange={(checked) => onFieldChange("acceptRules", checked)}
        onViewRules={onViewRules}
        error={errors.rules}
      />
      <NavigationButtons
        onPrev={onPrev}
        onNext={onNext}
        isNextLoading={isNextLoading}
        nextLabel="تکمیل ثبت‌نام و ورود"
        nextType="submit"
      />
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-4"
    >
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
    </motion.div>
  );
};