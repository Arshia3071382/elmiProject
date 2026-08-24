// Contact form component
"use client";

import { useState } from "react";
import {
  Send,
  User,
  Phone,
  FileText,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  GraduationCap,
} from "lucide-react";
import { ContactFormData, subjects, grades, validatePhone } from "./constants";

interface ContactFormProps {
  formData: ContactFormData;
  loading: boolean;
  canSend: boolean;
  status: { type: "success" | "error"; text: string } | null;
  onFormChange: (data: ContactFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ContactForm({
  formData,
  loading,
  canSend,
  status,
  onFormChange,
  onSubmit,
}: ContactFormProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleChange = (field: keyof ContactFormData, value: string) => {
    onFormChange({ ...formData, [field]: value });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      handleChange("phone", value);
    }
  };

  const isFormValid =
    formData.name.trim() &&
    formData.grade &&
    formData.subject &&
    validatePhone(formData.phone) &&
    formData.message.trim();

  return (
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

      <form onSubmit={onSubmit} className="space-y-5">
        {/* Name */}
        <div className="relative group">
          <User className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-secondary transition-colors" />
          <input
            type="text"
            required
            placeholder="نام و نام خانوادگی"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full border-2 border-border bg-white/50 rounded-xl pr-12 pl-4 py-3.5 text-sm focus:outline-none focus:border-secondary focus:ring-4 focus:ring-blue-500/10 transition-all hover:border-blue-300"
            style={{ fontFamily: "iranSans-r" }}
            maxLength={50}
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-text-secondary opacity-50">
            {formData.name.length}/۵۰
          </div>
        </div>

        {/* Grade dropdown */}
        <div className="relative group">
          <GraduationCap className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-secondary transition-colors z-10" />
          <select
            required
            value={formData.grade}
            onChange={(e) => handleChange("grade", e.target.value)}
            className="w-full border-2 border-border bg-white/50 rounded-xl pr-12 pl-4 py-3.5 text-sm focus:outline-none focus:border-secondary focus:ring-4 focus:ring-blue-500/10 transition-all hover:border-blue-300 appearance-none cursor-pointer"
            style={{ fontFamily: "iranSans-r" }}
          >
            <option value="">پایه تحصیلی</option>
            {grades.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>

        {/* Subject dropdown */}
        <div className="relative group">
          <FileText className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-secondary transition-colors z-10" />
          <div className="relative" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <div
              className={`w-full border-2 ${
                isDropdownOpen ? "border-secondary" : "border-border"
              } bg-white/50 rounded-xl pr-12 pl-4 py-3.5 text-sm cursor-pointer transition-all hover:border-blue-300 flex items-center justify-between`}
              style={{ fontFamily: "iranSans-r" }}
            >
              <span className={formData.subject ? "text-text-primary" : "text-gray-400"}>
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
                      handleChange("subject", subject);
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

        {/* Phone */}
        <div className="relative group">
          <Phone className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-secondary transition-colors" />
          <input
            type="text"
            required
            placeholder="شماره تماس"
            value={formData.phone}
            onChange={handlePhoneChange}
            className="w-full border-2 border-border bg-white/50 rounded-xl pr-12 pl-4 py-3.5 text-sm focus:outline-none focus:border-secondary focus:ring-4 focus:ring-blue-500/10 transition-all hover:border-blue-300 text-left font-mono"
            dir="ltr"
            maxLength={11}
          />
          {formData.phone && !validatePhone(formData.phone) && (
            <p className="text-xs text-red-500 mt-1 mr-4">
              شماره تماس باید با ۰۹ شروع شود و ۱۱ رقم باشد
            </p>
          )}
        </div>

        {/* Message */}
        <div className="relative group">
          <textarea
            required
            rows={5}
            placeholder="متن پیام شما (حداکثر ۵۰۰ کاراکتر)..."
            value={formData.message}
            onChange={(e) => handleChange("message", e.target.value)}
            className="w-full border-2 border-border bg-white/50 rounded-xl p-4 text-sm focus:outline-none focus:border-secondary focus:ring-4 focus:ring-blue-500/10 transition-all hover:border-blue-300 resize-none"
            style={{ fontFamily: "iranSans-r" }}
            maxLength={500}
          />
          <div className="absolute bottom-3 left-3 text-[10px] text-text-secondary opacity-50">
            {formData.message.length}/۵۰۰
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading || !canSend || !isFormValid}
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
  );
}