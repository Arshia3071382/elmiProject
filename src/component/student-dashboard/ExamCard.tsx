// Exam card component
import { motion } from "framer-motion";
import { FileText, CheckCircle2 } from "lucide-react";

export default function ExamCard() {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white/90 backdrop-blur-xl border border-slate-100 rounded-3xl p-6 shadow-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">
              کارت آزمون جامع علمی
            </h3>
            <p className="text-xs text-slate-400 font-[iranSans-r]">
              مجوز ورود به جلسه و جزئیات آزمون
            </p>
          </div>
        </div>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold flex items-center gap-1 font-[iranSans-r]">
          <CheckCircle2 className="w-4 h-4" /> فعال
        </span>
      </div>

      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-right w-full sm:w-auto font-[iranSans-r]">
          <div className="text-xs text-slate-400">
            وضعیت شرکت در آزمون:
          </div>
          <div className="text-sm font-bold text-slate-800">
            آماده برای دریافت کارت ورود به جلسه
          </div>
        </div>
        <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-xl transition-all shadow-md text-sm font-[iranSans-r] cursor-pointer">
          مشاهده و چاپ کارت آزمون
        </button>
      </div>
    </motion.div>
  );
}