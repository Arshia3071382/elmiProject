// Rules and conditions modal
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, FileText } from "lucide-react";

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export default function RulesModal({ isOpen, onClose, onAccept }: RulesModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" dir="rtl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-[500px] max-h-[82vh] overflow-y-auto bg-white rounded-[2rem] shadow-2xl p-7 z-10"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                  قوانین و شرایط استفاده از سامانه
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-2 rounded-full bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed text-right font-medium">
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-900">
                <strong>هشدار امنیتی مهم:</strong> حفظ رمز عبور و اطلاعات حساب
                کاربری انحصاراً بر عهده دانش‌آموز است. افشای اطلاعات به دیگران
                می‌تواند منجر به سوءاستفاده از حساب و مسدود شدن دائم آن گردد.
              </div>
              <p>
                <strong>۱. صحت اطلاعات هویتی:</strong> ورود کد ملی، شماره
                موبایل و نام معتبر الزامی است. سامانه در صورت مغایرت اطلاعات،
                دسترسی را محدود خواهد کرد.
              </p>
              <p>
                <strong>۲. اخلاق و انضباط:</strong> رعایت اخلاق حرفه‌ای و محیط
                آموزشی در تمام بخش‌های سامانه الزامی بوده و هرگونه تخلف پیگرد
                انضباطی دارد.
              </p>
              <p>
                <strong>۳. حریم خصوصی:</strong> داده‌های تحصیلی شما کاملاً
                ایمن نگهداری شده و هرگز در اختیار شخص ثالث قرار نمی‌گیرد.
              </p>
            </div>

            <div className="mt-7 pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={onAccept}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                مطالعه کردم و می‌پذیرم
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}