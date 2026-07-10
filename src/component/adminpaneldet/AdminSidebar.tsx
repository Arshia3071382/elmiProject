import React from "react";
import { Clock, BookOpen, Mail } from "lucide-react";

export default function AdminSidebar({ courses, contactMessages }: { courses: any[]; contactMessages: any[] }) {
  const recentCourses = [...courses].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 text-gray-800 font-bold"><Clock className="w-5 h-5 text-blue-600" /> ۱۰ دوره اخیر ثبت شده</div>
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {recentCourses.length === 0 ? <p className="text-gray-400 text-xs text-center py-4">هنوز دوره‌ای ثبت نشده است.</p> : recentCourses.map((c) => (
            <div key={c._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><BookOpen className="w-4 h-4" /></div>
                <div><h4 className="font-semibold text-gray-800 line-clamp-1">{c.name}</h4><span className="text-gray-400">{c.category?.name || "بدون گروه"}</span></div>
              </div>
              <span className="text-gray-500 bg-white px-2 py-1 rounded-md shadow-sm">{new Date(c.createdAt).toLocaleDateString("fa-IR")}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 text-gray-800 font-bold"><Mail className="w-5 h-5 text-indigo-600" /> ۱۰ پیام اخیر کاربران</div>
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {contactMessages.length === 0 ? <p className="text-gray-400 text-xs text-center py-4">پیامی دریافت نشده است.</p> : contactMessages.map((m) => (
            <div key={m._id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between items-center"><span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">{m.name}</span><span className="text-[10px] text-gray-400">{new Date(m.createdAt).toLocaleDateString("fa-IR")}</span></div>
              <h4 className="font-black text-gray-800">موضوع: {m.subject}</h4>
              <p className="text-gray-600 bg-white p-2 rounded-lg border border-gray-50 leading-relaxed break-words">{m.message}</p>
              <div className="text-[11px] text-gray-500 text-left font-mono" dir="ltr">📞 {m.phone}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}