import React, { useState } from "react";
import { Clock, BookOpen, Mail, Trash2, AlertCircle, CheckCircle } from "lucide-react";

export default function AdminSidebar({ courses, contactMessages, onMessageDelete }: { 
  courses: any[]; 
  contactMessages: any[]; 
  onMessageDelete?: (messageId: string) => void;
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteStatus, setDeleteStatus] = useState<{ id: string; type: 'success' | 'error'; text: string } | null>(null);

  const recentCourses = [...courses]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

const handleDeleteMessage = async (messageId: string, e: React.MouseEvent) => {
  e.stopPropagation();
  
  if (!confirm("آیا از حذف این پیام اطمینان دارید؟")) {
    return;
  }

  setDeletingId(messageId);
  setDeleteStatus(null);

  try {
    console.log("Deleting message with ID:", messageId); // برای دیباگ

    const res = await fetch(`/api/contacts/${messageId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "خطا در حذف پیام");
    }

    if (data.success) {
      setDeleteStatus({
        id: messageId,
        type: 'success',
        text: 'پیام با موفقیت حذف شد'
      });
      
      if (onMessageDelete) {
        onMessageDelete(messageId);
      }

      setTimeout(() => {
        setDeleteStatus(null);
      }, 3000);
    }
  } catch (error) {
    console.error("Delete error:", error);
    setDeleteStatus({
      id: messageId,
      type: 'error',
      text: error instanceof Error ? error.message : 'خطا در حذف پیام'
    });
  } finally {
    setDeletingId(null);
  }
};

  // تابع کمکی برای بررسی وضعیت حذف یک پیام خاص
  const getDeleteStatusForMessage = (messageId: string) => {
    if (!deleteStatus) return null;
    return deleteStatus.id === messageId ? deleteStatus : null;
  };

  return (
    <div className="space-y-6">
      {/* بخش دوره‌های اخیر */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 text-gray-800 font-bold">
          <Clock className="w-5 h-5 text-blue-600" />
          ۱۰ دوره اخیر ثبت شده
        </div>
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {recentCourses.length === 0 ? (
            <p className="text-gray-400 text-xs text-center py-4">هنوز دوره‌ای ثبت نشده است.</p>
          ) : (
            recentCourses.map((c) => (
              <div key={c._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 line-clamp-1">{c.name}</h4>
                    <span className="text-gray-400">{c.category?.name || "بدون گروه"}</span>
                  </div>
                </div>
                <span className="text-gray-500 bg-white px-2 py-1 rounded-md shadow-sm">
                  {new Date(c.createdAt).toLocaleDateString("fa-IR")}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* بخش پیام‌های کاربران */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-800 font-bold">
            <Mail className="w-5 h-5 text-indigo-600" />
            ۱۰ پیام اخیر کاربران
          </div>
          <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">
            {contactMessages.length} پیام
          </span>
        </div>

        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {contactMessages.length === 0 ? (
            <p className="text-gray-400 text-xs text-center py-4">پیامی دریافت نشده است.</p>
          ) : (
            contactMessages.map((m) => {
              // دریافت وضعیت حذف برای این پیام
              const status = getDeleteStatusForMessage(m._id);
              
              return (
                <div key={m._id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2 text-xs relative">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {m.name}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(m.createdAt).toLocaleDateString("fa-IR")}
                    </span>
                  </div>

                  <h4 className="font-black text-gray-800">موضوع: {m.subject}</h4>
                  <p className="text-gray-600 bg-white p-2 rounded-lg border border-gray-50 leading-relaxed break-words">
                    {m.message}
                  </p>
                  <div className="text-[11px] text-gray-500 text-left font-mono" dir="ltr">
                    📞 {m.phone}
                  </div>

                  {/* دکمه حذف - پایین سمت راست */}
                  <div className="flex justify-end mt-1">
                    <button
                      onClick={(e) => handleDeleteMessage(m._id, e)}
                      disabled={deletingId === m._id}
                      className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="حذف پیام"
                    >
                      {deletingId === m._id ? (
                        <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* نمایش وضعیت حذف */}
                  {status && (
                    <div className={`mt-2 p-2 rounded-lg flex items-center gap-1.5 text-xs ${
                      status.type === 'success' 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {status.type === 'success' ? (
                        <CheckCircle className="w-3.5 h-3.5" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5" />
                      )}
                      <span>{status.text}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}