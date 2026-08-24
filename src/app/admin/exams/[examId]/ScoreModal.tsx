"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ISubjectScore, IStudentResult, toPersianDigits } from "./constants";

interface ScoreModalProps {
  student: IStudentResult | null;
  scores: ISubjectScore[];
  saving: boolean;
  onClose: () => void;
  onScoreChange: (index: number, field: "correctAnswers" | "wrongAnswers", value: number) => void;
  onSave: () => void;
}

export default function ScoreModal({
  student,
  scores,
  saving,
  onClose,
  onScoreChange,
  onSave,
}: ScoreModalProps) {
  if (!student) return null;

  const calculateTotal = () => {
    let totalWeightedPercentage = 0;
    let totalCoefficients = 0;
    scores.forEach((s) => {
      const coeff = Number(s.coefficient) || 1;
      totalWeightedPercentage += Number(s.percentage || 0) * coeff;
      totalCoefficients += coeff;
    });
    return totalCoefficients > 0 ? (totalWeightedPercentage / totalCoefficients).toFixed(2) : "0";
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden my-4 sm:my-8"
        >
          {/* Header */}
          <div className="bg-emerald-700 text-white p-4 flex items-center justify-between">
            <h3 className="font-bold text-sm sm:text-base">
              ثبت نمرات: {student.firstName} {student.lastName}
            </h3>
            <button onClick={onClose} className="text-white/80 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scores list */}
          <div className="p-3 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-3">
              {scores.map((score, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 sm:grid-cols-12 gap-3 items-center bg-slate-50 p-3.5 rounded-2xl border border-slate-200"
                >
                  <div className="col-span-2 sm:col-span-4 font-black text-slate-800 text-sm">
                    {score.subjectName}
                    <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                      کل سوالات: {toPersianDigits(score.totalQuestions)} | ضریب: {toPersianDigits(score.coefficient)}
                    </span>
                  </div>

                  {/* Correct */}
                  <div className="col-span-1 sm:col-span-2">
                    <label className="text-[10px] text-emerald-600 block mb-1 font-bold">صحیح</label>
                    <input
                      type="number"
                      value={score.correctAnswers || ""}
                      onChange={(e) => onScoreChange(index, "correctAnswers", Number(e.target.value))}
                      className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-center font-mono text-emerald-600 font-bold"
                    />
                  </div>

                  {/* Wrong */}
                  <div className="col-span-1 sm:col-span-2">
                    <label className="text-[10px] text-rose-600 block mb-1 font-bold">غلط</label>
                    <input
                      type="number"
                      value={score.wrongAnswers || ""}
                      onChange={(e) => onScoreChange(index, "wrongAnswers", Number(e.target.value))}
                      className="w-full bg-white border border-rose-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-center font-mono text-rose-600 font-bold"
                    />
                  </div>

                  {/* Unanswered */}
                  <div className="col-span-1 sm:col-span-2 text-center bg-slate-200/60 py-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">نزده</span>
                    <span className="text-xs sm:text-sm font-black text-slate-700 font-mono">
                      {toPersianDigits(score.unanswered ?? 0)}
                    </span>
                  </div>

                  {/* Percentage */}
                  <div className="col-span-1 sm:col-span-2 text-center bg-white py-2 rounded-xl border border-slate-100 flex flex-col justify-center">
                    <span className="text-[10px] text-slate-400">درصد</span>
                    <span className="text-xs sm:text-sm font-black text-emerald-700 font-mono">
                      {toPersianDigits(score.percentage)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="text-xs sm:text-sm font-bold text-emerald-900">
                میانگین کل درصد دروس با احتساب ضرایب:
              </span>
              <span className="text-base sm:text-lg font-black text-emerald-700 font-mono">
                {toPersianDigits(calculateTotal())}%
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 p-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-200 transition-all text-center"
            >
              انصراف
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={onSave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-emerald-600/20 text-center"
            >
              {saving ? "در حال ثبت..." : "ثبت کارنامه دانش‌آموز"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}