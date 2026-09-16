import React from "react";
import { Download, ArrowLeft } from "lucide-react";

interface Props {
  securityCardImage: string | null;
  onSaveImage: () => void;
  onFinish: () => void;
}

export const SecurityCardView: React.FC<Props> = ({ securityCardImage, onSaveImage, onFinish }) => (
  <div className="space-y-4 text-center">
    <div className="mb-2 text-right">
      <h2 className="text-lg font-extrabold text-slate-800">کارت امنیتی شما آماده است</h2>
      <p className="text-xs text-slate-500 mt-0.5">لطفاً پیش از ورود، این کارت را ذخیره کنید</p>
    </div>

    {securityCardImage && (
      <div className="flex justify-center">
        <img src={securityCardImage} alt="Security Card" className="w-full max-w-[440px] rounded-2xl shadow-md border border-slate-200" />
      </div>
    )}

    <div className="flex gap-2.5 pt-1">
      <button
        type="button"
        onClick={onSaveImage}
        className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm shadow-lg shadow-emerald-600/20 cursor-pointer"
      >
        <Download className="w-4 h-4" /> ذخیره عکس در گالری
      </button>
      <button
        type="button"
        onClick={onFinish}
        className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-1.5 text-xs sm:text-sm cursor-pointer"
      >
        <span>متوجه شدم / ورود</span> <ArrowLeft className="w-4 h-4" />
      </button>
    </div>
  </div>
);