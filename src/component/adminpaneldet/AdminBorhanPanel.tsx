"use client";

import { useState, useEffect, useCallback } from "react";

interface BorhanMember {
  _id: string;
  role: 'teacher' | 'student';
  fullName: string;
  phone: string;
  job?: string;
  teachingExperience?: string;
  honors?: string;
  background?: string;
  grade?: string;
  school?: string;
  interests?: string;
  createdAt: string;
}

interface AdminBorhanPanelProps {
  onShowMessage: (type: "success" | "error", text: string) => void;
}

export default function AdminBorhanPanel({ onShowMessage }: AdminBorhanPanelProps) {
  const [members, setMembers] = useState<BorhanMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<BorhanMember | null>(null); // برای مدیریت مودال جزئیات

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/borhan-team", { 
        cache: "no-store",
        credentials: "include"
      });
      
      const data = await response.json();

      if (data.success) {
        const list = data.data || data.members || data.team || (Array.isArray(data) ? data : []);
        setMembers(list);
      } else {
        onShowMessage("error", data.message || "خطا در دریافت لیست تیم برهان");
      }
    } catch (err) {
      console.error(err);
      onShowMessage("error", "خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }, [onShowMessage]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  if (loading) {
    return (
      <div className="py-12 text-center text-gray-500 font-bold" dir="rtl">
        در حال بارگذاری اطلاعات تیم برهان...
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-2xl font-black text-[#1F3A5F]">مدیریت تیم برهان</h2>
          <p className="text-sm text-gray-500 mt-1">اعلام آمادگی مدرسان و دانش‌آموزان برای حضور در پروژه بزرگ علمی</p>
        </div>
        <button 
          onClick={fetchMembers}
          className="px-4 py-2 bg-blue-50 text-[#2563EB] rounded-xl font-bold text-sm hover:bg-blue-100 transition cursor-pointer"
        >
          بروزرسانی لیست
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm bg-white">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-gray-50 text-[#475569] text-xs sm:text-sm font-bold">
              <th className="p-4">نقش</th>
              <th className="p-4">نام و نام خانوادگی</th>
              <th className="p-4">شغل / پایه تحصیلی</th>
              <th className="p-4 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
            {members.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-400">هنوز درخواستی ثبت نشده است.</td>
              </tr>
            ) : (
              members.map((m) => (
                <tr key={m._id || Math.random()} className="hover:bg-gray-50/80 transition">
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-black ${m.role === 'teacher' ? 'bg-blue-50 text-[#2563EB] border border-blue-200' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'}`}>
                      {m.role === 'teacher' ? '👨‍🏫 مربی فیزیک' : '🎓 دانش‌آموز'}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-[#0F172A]">{m.fullName || '-'}</td>
                  <td className="p-4 text-gray-700 font-medium">{m.job || m.grade || '-'}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setSelectedMember(m)}
                      className="px-4 py-1.5 bg-slate-100 text-slate-700 hover:bg-[#2563EB] hover:text-white rounded-xl font-bold text-xs transition cursor-pointer"
                    >
                      مشاهده جزئیات
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* مودال جزئیات */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 relative space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-black text-[#1F3A5F]">جزئیات ثبت‌نام</h3>
              <button 
                onClick={() => setSelectedMember(null)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between bg-gray-50 p-3 rounded-xl">
                <span className="text-gray-500">نقش:</span>
                <span className="font-bold">{selectedMember.role === 'teacher' ? 'مربی فیزیک' : 'دانش‌آموز'}</span>
              </div>
              <div className="flex justify-between bg-gray-50 p-3 rounded-xl">
                <span className="text-gray-500">نام و نام خانوادگی:</span>
                <span className="font-bold">{selectedMember.fullName}</span>
              </div>
              <div className="flex justify-between bg-gray-50 p-3 rounded-xl">
                <span className="text-gray-500">شماره تماس:</span>
                <span className="font-mono font-bold" dir="ltr">{selectedMember.phone}</span>
              </div>

              {selectedMember.role === 'teacher' ? (
                <>
                  <div className="flex justify-between bg-gray-50 p-3 rounded-xl">
                    <span className="text-gray-500">شغل یا تخصص:</span>
                    <span className="font-medium">{selectedMember.job || '-'}</span>
                  </div>
                  <div className="flex justify-between bg-gray-50 p-3 rounded-xl">
                    <span className="text-gray-500">سابقه تدریس:</span>
                    <span className="font-medium">{selectedMember.teachingExperience || '-'}</span>
                  </div>
                  <div className="flex justify-between bg-gray-50 p-3 rounded-xl">
                    <span className="text-gray-500">افتخارات:</span>
                    <span className="font-medium">{selectedMember.honors || '-'}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl space-y-1">
                    <span className="text-gray-500 block">بیوگرافی / سوابق:</span>
                    <p className="text-gray-700 leading-relaxed">{selectedMember.background || '-'}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between bg-gray-50 p-3 rounded-xl">
                    <span className="text-gray-500">پایه تحصیلی:</span>
                    <span className="font-medium">{selectedMember.grade || '-'}</span>
                  </div>
                  <div className="flex justify-between bg-gray-50 p-3 rounded-xl">
                    <span className="text-gray-500">مدرسه:</span>
                    <span className="font-medium">{selectedMember.school || '-'}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl space-y-1">
                    <span className="text-gray-500 block">علایق و انگیزه‌ها:</span>
                    <p className="text-gray-700 leading-relaxed">{selectedMember.interests || '-'}</p>
                  </div>
                </>
              )}

              <div className="flex justify-between bg-gray-50 p-3 rounded-xl text-xs">
                <span className="text-gray-400">تاریخ ثبت‌نام:</span>
                <span className="font-mono text-gray-500">{new Date(selectedMember.createdAt).toLocaleDateString('fa-IR')}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedMember(null)}
              className="w-full py-3 bg-[#1F3A5F] text-white rounded-xl font-bold hover:bg-opacity-90 transition cursor-pointer mt-2"
            >
              بستن
            </button>
          </div>
        </div>
      )}
    </div>
  );
}